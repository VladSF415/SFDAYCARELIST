// ==============================================================================
// YELP FUSION API SCRAPER
// ==============================================================================
// Fetches reviews, ratings, pricing, and photos from Yelp

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../../data/scraped/yelp-data.json');
const DELAY_MS = 500; // 500ms delay between requests

// Get API key from environment
const YELP_API_KEY = process.env.YELP_API_KEY || '';

if (!YELP_API_KEY) {
  console.warn('⚠️  YELP_API_KEY not set in environment variables');
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search for a business on Yelp
 */
async function searchYelpBusiness(name, address) {
  try {
    const params = new URLSearchParams({
      term: `${name} daycare`,
      location: `${address}, San Francisco, CA`,
      categories: 'childcare',
      limit: 1
    });

    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${YELP_API_KEY}`,
          'User-Agent': 'SFDaycareList/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.businesses && data.businesses.length > 0) {
      return data.businesses[0].id;
    }

    return null;
  } catch (error) {
    console.error(`  ❌ Yelp search error for ${name}:`, error.message);
    return null;
  }
}

/**
 * Get business details from Yelp
 */
async function getYelpBusinessDetails(businessId) {
  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${businessId}`,
      {
        headers: {
          'Authorization': `Bearer ${YELP_API_KEY}`,
          'User-Agent': 'SFDaycareList/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`  ❌ Yelp details error for ${businessId}:`, error.message);
    return null;
  }
}

/**
 * Get reviews for a business
 */
async function getYelpReviews(businessId) {
  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${businessId}/reviews?limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${YELP_API_KEY}`,
          'User-Agent': 'SFDaycareList/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error(`  ⚠️  Could not fetch Yelp reviews for ${businessId}`);
    return [];
  }
}

/**
 * Transform Yelp data to our format
 */
function transformYelpData(business, reviews) {
  const transformedReviews = reviews.map(review => ({
    author: review.user.name,
    rating: review.rating,
    text: review.text,
    time: review.time_created,
    url: review.url
  }));

  const hours = {};
  if (business.hours && business.hours[0]) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    business.hours[0].open.forEach(slot => {
      const day = days[slot.day];
      hours[day] = `${formatTime(slot.start)} - ${formatTime(slot.end)}`;
    });
  }

  return {
    yelp_id: business.id,
    yelp_url: business.url,
    name: business.name,

    contact: {
      phone: business.display_phone || business.phone || '',
      website: business.url
    },

    location: {
      address: business.location.address1,
      city: business.location.city,
      state: business.location.state,
      zip: business.location.zip_code,
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude
    },

    hours: Object.keys(hours).length > 0 ? hours : null,

    pricing: {
      price_level: business.price ? business.price.length : null, // $ to $$$$
      transactions: business.transactions || []
    },

    ratings: {
      overall: business.rating || 0,
      review_count: business.review_count || 0,
      source: 'Yelp'
    },

    reviews: transformedReviews,
    photos: business.photos || [],

    categories: business.categories.map(c => c.title),
    is_closed: business.is_closed,

    scraped_at: new Date().toISOString()
  };
}

/**
 * Format Yelp time (0800 -> 8:00 AM)
 */
function formatTime(timeStr) {
  const hours = parseInt(timeStr.substring(0, 2));
  const minutes = timeStr.substring(2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);

  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Scrape Yelp data for a list of daycares
 */
async function scrapeYelp(daycares) {
  console.log('🚀 Starting Yelp Scraper\n');

  if (!YELP_API_KEY) {
    console.error('❌ Missing YELP_API_KEY environment variable');
    console.log('\n📋 To get an API key:');
    console.log('1. Go to: https://www.yelp.com/developers');
    console.log('2. Create an app');
    console.log('3. Get your API key');
    console.log('4. Add to .env: YELP_API_KEY=your_key_here\n');
    return [];
  }

  const results = [];
  const total = daycares.length;

  for (let i = 0; i < total; i++) {
    const daycare = daycares[i];
    console.log(`\n[${i + 1}/${total}] ${daycare.name}`);

    // Step 1: Search for business
    console.log('  🔍 Searching Yelp...');
    const businessId = await searchYelpBusiness(daycare.name, daycare.location.address);

    if (!businessId) {
      console.log('  ⚠️  Not found on Yelp');
      continue;
    }

    await sleep(DELAY_MS);

    // Step 2: Get details
    console.log('  📊 Fetching details...');
    const business = await getYelpBusinessDetails(businessId);

    if (!business) {
      console.log('  ⚠️  Could not fetch details');
      continue;
    }

    await sleep(DELAY_MS);

    // Step 3: Get reviews
    console.log('  💬 Fetching reviews...');
    const reviews = await getYelpReviews(businessId);

    await sleep(DELAY_MS);

    // Step 4: Transform and save
    const transformed = transformYelpData(business, reviews);
    transformed.original_id = daycare.id;
    results.push(transformed);

    console.log(`  ✅ Rating: ${business.rating}★ (${business.review_count} reviews)`);
  }

  // Save results
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n✅ Saved ${results.length} Yelp records to ${OUTPUT_FILE}`);

  return results;
}

export default scrapeYelp;
