// ==============================================================================
// GOOGLE PLACES API SCRAPER
// ==============================================================================
// Fetches reviews, ratings, photos, hours, and contact info from Google Places API

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../../data/scraped/google-places-data.json');
const DELAY_MS = 200; // 200ms delay between requests

// Get API key from environment
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

if (!GOOGLE_API_KEY) {
  console.warn('⚠️  GOOGLE_PLACES_API_KEY not set in environment variables');
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search for a daycare by name and location
 */
async function searchPlace(name, address) {
  const query = `${name} ${address} San Francisco CA daycare`;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=${encodeURIComponent(query)}` +
      `&inputtype=textquery` +
      `&fields=place_id,name,formatted_address,geometry` +
      `&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.candidates.length > 0) {
      return data.candidates[0].place_id;
    }

    return null;
  } catch (error) {
    console.error(`  ❌ Search error for ${name}:`, error.message);
    return null;
  }
}

/**
 * Get detailed place information
 */
async function getPlaceDetails(placeId) {
  const fields = [
    'name',
    'formatted_address',
    'formatted_phone_number',
    'website',
    'rating',
    'user_ratings_total',
    'reviews',
    'photos',
    'opening_hours',
    'geometry',
    'price_level',
    'business_status'
  ].join(',');

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}` +
      `&fields=${fields}` +
      `&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (data.status === 'OK') {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error(`  ❌ Details error for place ${placeId}:`, error.message);
    return null;
  }
}

/**
 * Get photo URL
 */
function getPhotoUrl(photoReference, maxWidth = 800) {
  if (!photoReference) return null;

  return `https://maps.googleapis.com/maps/api/place/photo?` +
    `maxwidth=${maxWidth}` +
    `&photo_reference=${photoReference}` +
    `&key=${GOOGLE_API_KEY}`;
}

/**
 * Transform Google Places data to our format
 */
function transformGoogleData(placeDetails) {
  const reviews = (placeDetails.reviews || []).map(review => ({
    author: review.author_name,
    rating: review.rating,
    text: review.text,
    time: review.time,
    relative_time: review.relative_time_description
  }));

  const photos = (placeDetails.photos || []).slice(0, 10).map(photo =>
    getPhotoUrl(photo.photo_reference)
  );

  return {
    google_place_id: placeDetails.place_id,
    name: placeDetails.name,

    contact: {
      phone: placeDetails.formatted_phone_number || '',
      website: placeDetails.website || ''
    },

    location: {
      address: placeDetails.formatted_address,
      latitude: placeDetails.geometry?.location?.lat,
      longitude: placeDetails.geometry?.location?.lng
    },

    hours: transformHours(placeDetails.opening_hours),

    ratings: {
      overall: placeDetails.rating || 0,
      review_count: placeDetails.user_ratings_total || 0,
      source: 'Google'
    },

    reviews: reviews,
    photos: photos,

    business_status: placeDetails.business_status,
    scraped_at: new Date().toISOString()
  };
}

/**
 * Transform opening hours to our format
 */
function transformHours(openingHours) {
  if (!openingHours?.weekday_text) {
    return null;
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hours = {};

  openingHours.weekday_text.forEach((text, index) => {
    // Format: "Monday: 7:00 AM – 6:00 PM"
    const parts = text.split(': ');
    if (parts.length === 2) {
      hours[days[index]] = parts[1];
    }
  });

  return hours;
}

/**
 * Scrape Google Places data for a list of daycares
 */
async function scrapeGooglePlaces(daycares) {
  console.log('🚀 Starting Google Places Scraper\n');

  if (!GOOGLE_API_KEY) {
    console.error('❌ Missing GOOGLE_PLACES_API_KEY environment variable');
    console.log('\n📋 To get an API key:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Enable "Places API"');
    console.log('3. Create API key');
    console.log('4. Add to .env: GOOGLE_PLACES_API_KEY=your_key_here\n');
    return [];
  }

  const results = [];
  const total = daycares.length;

  for (let i = 0; i < total; i++) {
    const daycare = daycares[i];
    console.log(`\n[${i + 1}/${total}] ${daycare.name}`);

    // Step 1: Search for place
    console.log('  🔍 Searching...');
    const placeId = await searchPlace(daycare.name, daycare.location.address);

    if (!placeId) {
      console.log('  ⚠️  Not found on Google Maps');
      continue;
    }

    await sleep(DELAY_MS);

    // Step 2: Get details
    console.log('  📊 Fetching details...');
    const details = await getPlaceDetails(placeId);

    if (!details) {
      console.log('  ⚠️  Could not fetch details');
      continue;
    }

    await sleep(DELAY_MS);

    // Step 3: Transform and save
    const transformed = transformGoogleData(details);
    transformed.original_id = daycare.id;
    results.push(transformed);

    console.log(`  ✅ Rating: ${details.rating}★ (${details.user_ratings_total} reviews)`);
  }

  // Save results
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n✅ Saved ${results.length} Google Places records to ${OUTPUT_FILE}`);

  return results;
}

export default scrapeGooglePlaces;
