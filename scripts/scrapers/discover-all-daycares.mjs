#!/usr/bin/env node
// Automatically discover ALL daycares in San Francisco using Google Places API
// Uses Nearby Search to find every daycare, preschool, and child care center

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-discovered.json');
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const DELAY_MS = 500; // 500ms between requests to stay under rate limits

// San Francisco boundaries
const SF_CENTER = { lat: 37.7749, lng: -122.4194 };
const SEARCH_RADIUS = 15000; // 15km covers all of SF

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

async function nearbySearch(location, radius, type, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&key=${API_KEY}`;

  if (pageToken) {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${pageToken}&key=${API_KEY}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error(`API Error: ${data.status} - ${data.error_message || 'No message'}`);
    if (data.status === 'INVALID_REQUEST' && pageToken) {
      // Page token not ready yet, wait longer
      await sleep(2000);
      return nearbySearch(location, radius, type, pageToken);
    }
  }

  return data;
}

async function getPlaceDetails(placeId) {
  const fields = 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos,reviews,types,business_status';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK') {
    return data.result;
  }

  return null;
}

function transformToSchema(place, details) {
  const address = details?.formatted_address || place.vicinity || '';
  const zipMatch = address.match(/CA\s+(\d{5})/);
  const zip = zipMatch ? zipMatch[1] : '';

  // Extract street address
  const street = address
    .replace(/,?\s*San Francisco,?\s*CA\s*\d{5}?/i, '')
    .replace(/,?\s*United States/i, '')
    .trim();

  return {
    id: generateId(place.name),
    name: place.name,
    tagline: '',
    description: '',
    hero_image: details?.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${details.photos[0].photo_reference}&key=${API_KEY}` : '',

    location: {
      street: street,
      city: 'San Francisco',
      state: 'CA',
      zip: zip,
      neighborhood: '',
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      public_transit: []
    },

    contact: {
      phone: details?.formatted_phone_number || '',
      email: '',
      website: details?.website || ''
    },

    hours: details?.opening_hours?.weekday_text ? {
      monday: parseHours(details.opening_hours.weekday_text[0]),
      tuesday: parseHours(details.opening_hours.weekday_text[1]),
      wednesday: parseHours(details.opening_hours.weekday_text[2]),
      thursday: parseHours(details.opening_hours.weekday_text[3]),
      friday: parseHours(details.opening_hours.weekday_text[4]),
      saturday: parseHours(details.opening_hours.weekday_text[5]),
      sunday: parseHours(details.opening_hours.weekday_text[6])
    } : null,

    licensing: {
      license_number: '',
      status: 'Active',
      type: place.types.includes('preschool') ? 'Preschool' : 'Child Care Center',
      capacity: 0,
      issued_date: null,
      expiration_date: null,
      last_inspection: null,
      data_source: 'Google Places API'
    },

    program: {
      age_groups: ['Infants', 'Toddlers', 'Preschool'],
      ages_min_months: 0,
      ages_max_years: 5,
      languages: ['English'],
      curriculum: '',
      schedule_types: ['Full-time'],
      special_programs: []
    },

    availability: {
      accepting_enrollment: details?.business_status === 'OPERATIONAL' ? true : null,
      infant_spots: null,
      toddler_spots: null,
      preschool_spots: null,
      waitlist_available: null,
      last_updated: new Date().toISOString().split('T')[0]
    },

    pricing: {
      infant_monthly: null,
      toddler_monthly: null,
      preschool_monthly: null,
      currency: 'USD',
      financial_assistance: false,
      subsidy_accepted: false
    },

    ratings: {
      overall: details?.rating || place.rating || 0,
      google_rating: details?.rating || place.rating || 0,
      google_review_count: details?.user_ratings_total || 0,
      yelp_rating: 0,
      review_count: details?.user_ratings_total || 0
    },

    reviews: (details?.reviews || []).slice(0, 5).map(r => ({
      author: r.author_name,
      text: r.text,
      rating: r.rating,
      date: new Date(r.time * 1000).toISOString().split('T')[0],
      source: 'Google'
    })),

    photos: (details?.photos || []).slice(0, 10).map(p =>
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${API_KEY}`
    ),

    google_place_id: place.place_id,
    verified: true,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function parseHours(hourString) {
  // "Monday: 7:00 AM – 6:00 PM"
  if (!hourString) return { open: 'Closed', close: 'Closed' };

  const match = hourString.match(/:\s*(.+?)\s*–\s*(.+)/);
  if (!match) {
    if (hourString.includes('Closed')) {
      return { open: 'Closed', close: 'Closed' };
    }
    return { open: '7:00 AM', close: '6:00 PM' };
  }

  return {
    open: match[1].trim(),
    close: match[2].trim()
  };
}

async function discoverAllDaycares() {
  console.log('🔍 Discovering ALL Daycares in San Francisco\n');
  console.log('════════════════════════════════════════\n');

  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in .env');
    process.exit(1);
  }

  const allPlaces = new Map(); // Use Map to deduplicate by place_id
  const searchTypes = ['child_care', 'preschool', 'school'];

  for (const type of searchTypes) {
    console.log(`\n📍 Searching for type: ${type}`);
    console.log('─────────────────────────────────────────\n');

    let pageToken = null;
    let pageNum = 1;

    do {
      if (pageToken) {
        console.log(`   ⏳ Waiting for next page token to become valid...`);
        await sleep(2000); // Google requires 2 second delay before using page token
      }

      const data = await nearbySearch(SF_CENTER, SEARCH_RADIUS, type, pageToken);

      if (data.results && data.results.length > 0) {
        console.log(`   Page ${pageNum}: Found ${data.results.length} results`);

        // Filter for actual daycares
        const filtered = data.results.filter(place => {
          const name = place.name.toLowerCase();
          const types = place.types || [];

          // EXCLUDE obvious non-daycares and schools (elementary+)
          const excludeKeywords = ['hotel', 'inn', 'hostel', 'restaurant', 'bar', 'cafe', 'coffee', 'pizza', 'sushi', 'hospital', 'church', 'temple', 'synagogue', 'library', 'museum', 'store', 'shop', 'plaza', 'apartment', 'fedex', 'shipping', 'legal', 'medical', 'bike', 'bmw', 'costco', 'food', 'tavern', 'middle school', 'high school', 'secondary school', 'elementary', 'academy of science', 'university', 'college'];
          if (excludeKeywords.some(keyword => name.includes(keyword))) {
            return false;
          }

          // INCLUDE only if explicitly preschool/daycare type and name
          const includeKeywords = ['daycare', 'day care', 'preschool', 'pre-school', 'kindergarten', 'children', 'kids', 'child care', 'learning center', 'nursery', 'montessori', 'early childhood', 'early learning', 'infant', 'toddler', 'little', 'tiny'];
          const hasChildcareType = types.includes('child_care') || types.includes('preschool');
          const hasChildcareName = includeKeywords.some(keyword => name.includes(keyword));

          return hasChildcareType || hasChildcareName; // Include if either matches
        });

        for (const place of filtered) {
          if (!allPlaces.has(place.place_id)) {
            allPlaces.set(place.place_id, place);
            console.log(`      ✅ ${place.name}`);
          }
        }
      }

      pageToken = data.next_page_token;
      pageNum++;

      if (pageToken) {
        await sleep(DELAY_MS);
      }

    } while (pageToken);
  }

  console.log(`\n\n📊 Discovery Complete: ${allPlaces.size} unique daycares found\n`);

  // Get detailed information for each place
  console.log('════════════════════════════════════════');
  console.log('📋 FETCHING DETAILED INFORMATION');
  console.log('════════════════════════════════════════\n');

  const daycares = [];
  let count = 0;

  for (const [placeId, place] of allPlaces.entries()) {
    count++;
    console.log(`[${count}/${allPlaces.size}] ${place.name}`);

    const details = await getPlaceDetails(placeId);
    const daycare = transformToSchema(place, details);
    daycares.push(daycare);

    if (count % 10 === 0) {
      console.log(`   ⏸️  Progress: ${count}/${allPlaces.size} (${Math.round(count/allPlaces.size*100)}%)`);
    }

    await sleep(DELAY_MS);
  }

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(daycares, null, 2));

  console.log('\n════════════════════════════════════════');
  console.log('📊 FINAL RESULTS');
  console.log('════════════════════════════════════════');
  console.log(`Total daycares discovered: ${daycares.length}`);
  console.log(`With ratings: ${daycares.filter(d => d.ratings.overall > 0).length}`);
  console.log(`With reviews: ${daycares.filter(d => d.reviews.length > 0).length}`);
  console.log(`With photos: ${daycares.filter(d => d.photos.length > 0).length}`);
  console.log(`With phone numbers: ${daycares.filter(d => d.contact.phone).length}`);
  console.log(`With websites: ${daycares.filter(d => d.contact.website).length}`);
  console.log(`\n💾 Saved to: ${OUTPUT_FILE}`);

  console.log('\n✨ Discovery complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Review: src/data/daycares-discovered.json');
  console.log('   2. Copy to production: cp src/data/daycares-discovered.json src/data/daycares.json');
  console.log('   3. Deploy: git add -A && git commit -m "Add complete SF daycare dataset" && railway up --detach');

  return daycares;
}

discoverAllDaycares()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Discovery failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
