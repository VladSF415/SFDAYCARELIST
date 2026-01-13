// ==============================================================================
// MASTER DAYCARE SCRAPER
// ==============================================================================
// Orchestrates all scrapers and merges data from multiple sources

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import scrapeCALicensing from './ca-licensing-scraper.mjs';
import scrapeGooglePlaces from './google-places-scraper.mjs';
import scrapeYelp from './yelp-scraper.mjs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data/scraped');
const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-merged.json');
const EXISTING_FILE = path.join(__dirname, '../../src/data/daycares.json');

/**
 * Load existing daycare data
 */
function loadExistingData() {
  if (fs.existsSync(EXISTING_FILE)) {
    const data = fs.readFileSync(EXISTING_FILE, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

/**
 * Merge data from multiple sources
 */
function mergeData(caData, googleData, yelpData, existingData) {
  console.log('\n🔄 Merging data from all sources...');

  const merged = {};

  // Start with CA licensing data (most authoritative)
  caData.forEach(facility => {
    merged[facility.id] = { ...facility };
  });

  // Add existing manual data
  existingData.forEach(daycare => {
    if (!merged[daycare.id]) {
      merged[daycare.id] = { ...daycare };
    } else {
      // Preserve manually added data
      merged[daycare.id] = {
        ...merged[daycare.id],
        description: daycare.description || merged[daycare.id].description,
        program: {
          ...merged[daycare.id].program,
          ...(daycare.program || {})
        }
      };
    }
  });

  // Merge Google Places data
  googleData.forEach(google => {
    const matchingId = findMatchingId(google.name, google.location.address, merged);

    if (matchingId) {
      const existing = merged[matchingId];

      merged[matchingId] = {
        ...existing,
        contact: {
          ...existing.contact,
          phone: google.contact.phone || existing.contact.phone,
          website: google.contact.website || existing.contact.website
        },
        hours: google.hours || existing.hours,
        ratings: {
          ...existing.ratings,
          google_rating: google.ratings.overall,
          google_review_count: google.ratings.review_count
        },
        reviews: [...(existing.reviews || []), ...google.reviews],
        photos: [...(existing.photos || []), ...google.photos],
        google_place_id: google.google_place_id
      };
    }
  });

  // Merge Yelp data
  yelpData.forEach(yelp => {
    const matchingId = findMatchingId(yelp.name, yelp.location.address, merged);

    if (matchingId) {
      const existing = merged[matchingId];

      merged[matchingId] = {
        ...existing,
        ratings: {
          ...existing.ratings,
          yelp_rating: yelp.ratings.overall,
          yelp_review_count: yelp.ratings.review_count,
          overall: calculateOverallRating(
            existing.ratings.google_rating,
            yelp.ratings.overall
          )
        },
        reviews: [...(existing.reviews || []), ...yelp.reviews],
        photos: [...(existing.photos || []), ...yelp.photos],
        yelp_id: yelp.yelp_id,
        yelp_url: yelp.yelp_url
      };
    }
  });

  return Object.values(merged);
}

/**
 * Find matching daycare ID by name and address
 */
function findMatchingId(name, address, merged) {
  const normalizedName = name.toLowerCase().replace(/[^\w\s]/g, '');
  const normalizedAddress = address.toLowerCase();

  for (const [id, daycare] of Object.entries(merged)) {
    const daycareNormalizedName = daycare.name.toLowerCase().replace(/[^\w\s]/g, '');
    const daycareNormalizedAddress = daycare.location.address.toLowerCase();

    // Check name similarity (fuzzy match)
    if (
      daycareNormalizedName.includes(normalizedName) ||
      normalizedName.includes(daycareNormalizedName)
    ) {
      // Check address contains similar street/number
      if (addressMatch(normalizedAddress, daycareNormalizedAddress)) {
        return id;
      }
    }
  }

  return null;
}

/**
 * Check if addresses match (fuzzy)
 */
function addressMatch(addr1, addr2) {
  // Extract street number
  const num1 = addr1.match(/\d+/)?.[0];
  const num2 = addr2.match(/\d+/)?.[0];

  if (num1 && num2 && num1 === num2) {
    return true;
  }

  // Check for common street name
  const words1 = addr1.split(/\s+/);
  const words2 = addr2.split(/\s+/);

  const commonWords = words1.filter(w => words2.includes(w) && w.length > 3);

  return commonWords.length >= 2;
}

/**
 * Calculate overall rating from multiple sources
 */
function calculateOverallRating(...ratings) {
  const validRatings = ratings.filter(r => r && r > 0);

  if (validRatings.length === 0) return 0;

  const sum = validRatings.reduce((a, b) => a + b, 0);
  const avg = sum / validRatings.length;

  return Math.round(avg * 10) / 10; // Round to 1 decimal
}

/**
 * Enrich data with additional processing
 */
function enrichData(daycares) {
  return daycares.map(daycare => {
    // Calculate verified status
    const verified = !!(
      daycare.licensing?.license_number &&
      daycare.licensing?.status === 'active'
    );

    // Generate slug if missing
    const slug = daycare.slug || generateSlug(daycare.name, daycare.location.neighborhood);

    // Calculate review stats
    const reviewCount = daycare.reviews?.length || 0;
    const verifiedReviews = reviewCount; // All reviews from APIs are verified

    // Set premium status (can be updated manually later)
    const premium = daycare.premium || {
      is_premium: false,
      tier: null,
      featured_until: null
    };

    return {
      ...daycare,
      slug,
      verified,
      ratings: {
        ...daycare.ratings,
        review_count: reviewCount,
        verified_reviews: verifiedReviews
      },
      premium,
      claimed_by_owner: daycare.claimed_by_owner || false,
      owner_email: daycare.owner_email || null,
      seo: daycare.seo || generateSEO(daycare),
      created_at: daycare.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
}

/**
 * Generate slug from name and neighborhood
 */
function generateSlug(name, neighborhood) {
  const namePart = name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const neighborhoodPart = neighborhood || 'sf';

  return `${namePart}-${neighborhoodPart}`;
}

/**
 * Generate SEO meta tags
 */
function generateSEO(daycare) {
  const neighborhoodName = daycare.location.neighborhood
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const title = `${daycare.name} - ${neighborhoodName} Daycare | SF Daycare List`;

  const description = `${daycare.name} in ${neighborhoodName}. ` +
    `Licensed for ages ${daycare.program?.ages_min_months || 0}mo-${daycare.program?.ages_max_years || 5}yrs. ` +
    `${daycare.ratings?.overall ? `${daycare.ratings.overall}★ rating.` : ''}`.substring(0, 160);

  return {
    meta_title: title,
    meta_description: description
  };
}

/**
 * Main master scraper function
 */
async function runMasterScraper(options = {}) {
  console.log('🚀 Starting Master Daycare Scraper\n');
  console.log('════════════════════════════════════════\n');

  const {
    skipCALicensing = false,
    skipGoogle = false,
    skipYelp = false
  } = options;

  // Create data directory
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true});
  }

  // Load existing data
  const existingData = loadExistingData();
  console.log(`📂 Loaded ${existingData.length} existing daycares\n`);

  // Run scrapers
  let caData = [];
  let googleData = [];
  let yelpData = [];

  // 1. CA Licensing (foundation data)
  if (!skipCALicensing) {
    console.log('════════════════════════════════════════');
    console.log('1️⃣  CA LICENSING DATABASE');
    console.log('════════════════════════════════════════\n');
    caData = await scrapeCALicensing();
    console.log(`\n✅ CA Licensing: ${caData.length} facilities\n`);
  }

  // Use existing data or CA data as base for other scrapers
  const baseData = caData.length > 0 ? caData : existingData;

  // 2. Google Places (reviews, ratings, photos)
  if (!skipGoogle && baseData.length > 0) {
    console.log('\n════════════════════════════════════════');
    console.log('2️⃣  GOOGLE PLACES');
    console.log('════════════════════════════════════════\n');
    googleData = await scrapeGooglePlaces(baseData);
    console.log(`\n✅ Google Places: ${googleData.length} matches\n`);
  }

  // 3. Yelp (additional reviews, pricing hints)
  if (!skipYelp && baseData.length > 0) {
    console.log('\n════════════════════════════════════════');
    console.log('3️⃣  YELP');
    console.log('════════════════════════════════════════\n');
    yelpData = await scrapeYelp(baseData);
    console.log(`\n✅ Yelp: ${yelpData.length} matches\n`);
  }

  // Merge all data
  console.log('════════════════════════════════════════');
  console.log('4️⃣  MERGING DATA');
  console.log('════════════════════════════════════════');
  const merged = mergeData(caData, googleData, yelpData, existingData);
  const enriched = enrichData(merged);

  // Save merged data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log(`\n✅ Final merged data: ${enriched.length} daycares`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);

  // Generate summary
  console.log('\n════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`Total daycares: ${enriched.length}`);
  console.log(`With Google data: ${enriched.filter(d => d.google_place_id).length}`);
  console.log(`With Yelp data: ${enriched.filter(d => d.yelp_id).length}`);
  console.log(`With reviews: ${enriched.filter(d => d.reviews?.length > 0).length}`);
  console.log(`With photos: ${enriched.filter(d => d.photos?.length > 0).length}`);
  console.log(`Verified: ${enriched.filter(d => d.verified).length}`);

  console.log('\n✨ Master scraper completed!');

  return enriched;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {
    skipCALicensing: args.includes('--skip-ca'),
    skipGoogle: args.includes('--skip-google'),
    skipYelp: args.includes('--skip-yelp')
  };

  runMasterScraper(options)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Master scraper failed:', error);
      process.exit(1);
    });
}

export default runMasterScraper;
