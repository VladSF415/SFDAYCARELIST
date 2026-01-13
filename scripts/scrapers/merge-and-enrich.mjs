#!/usr/bin/env node
// Merge scraped data from Claude browser extension with existing daycares
// Then enrich everything with Google Places data

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import scrapeGooglePlaces from './google-places-scraper.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXISTING_FILE = path.join(__dirname, '../../src/data/daycares.json');
const SCRAPED_FILE = path.join(__dirname, '../../src/data/daycares-scraped.json');
const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-merged.json');

// Fuzzy matching helpers
function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(str1, str2) {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);

  if (s1 === s2) return 1.0;

  // Levenshtein distance
  const matrix = [];
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  const distance = matrix[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
}

function isDuplicate(daycare1, daycare2) {
  // Check name similarity
  const nameSim = similarity(daycare1.name, daycare2.name);

  // Check address similarity
  const addr1 = daycare1.location?.street || daycare1.address || '';
  const addr2 = daycare2.location?.street || daycare2.address || '';
  const addrSim = similarity(addr1, addr2);

  // Consider duplicate if name is very similar OR (name somewhat similar AND address similar)
  if (nameSim > 0.9) return true;
  if (nameSim > 0.7 && addrSim > 0.7) return true;

  return false;
}

// Transform scraped data to our schema
function transformScrapedData(scraped) {
  // Generate unique ID
  const id = scraped.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id: id,
    name: scraped.name || scraped['Facility Name'] || '',
    tagline: '',
    description: scraped.description || '',
    hero_image: '',

    location: {
      street: scraped.address || scraped.Address || '',
      city: 'San Francisco',
      state: 'CA',
      zip: scraped.zip || scraped.ZipCode || '',
      neighborhood: scraped.neighborhood || '',
      latitude: scraped.latitude || scraped.Latitude || 37.7749,
      longitude: scraped.longitude || scraped.Longitude || -122.4194,
      public_transit: []
    },

    contact: {
      phone: scraped.phone || scraped.Phone || '',
      email: scraped.email || '',
      website: scraped.website || ''
    },

    hours: scraped.hours || {
      monday: { open: '7:00 AM', close: '6:00 PM' },
      tuesday: { open: '7:00 AM', close: '6:00 PM' },
      wednesday: { open: '7:00 AM', close: '6:00 PM' },
      thursday: { open: '7:00 AM', close: '6:00 PM' },
      friday: { open: '7:00 AM', close: '6:00 PM' },
      saturday: { open: 'Closed', close: 'Closed' },
      sunday: { open: 'Closed', close: 'Closed' }
    },

    licensing: {
      license_number: scraped.license_number || scraped['License Number'] || '',
      status: scraped.license_status || scraped['License Status'] || 'Licensed',
      type: scraped.license_type || scraped['License Type'] || 'Child Care Center',
      capacity: parseInt(scraped.capacity || scraped.Capacity || 0),
      issued_date: scraped.issued_date || null,
      expiration_date: scraped.expiration_date || null,
      last_inspection: scraped.last_inspection || null,
      data_source: 'CA Department of Social Services'
    },

    program: {
      age_groups: scraped.age_groups || ['Infants', 'Toddlers', 'Preschool'],
      ages_min_months: parseInt(scraped.ages_min_months || 0),
      ages_max_years: parseInt(scraped.ages_max_years || 5),
      languages: scraped.languages || ['English'],
      curriculum: scraped.curriculum || '',
      schedule_types: scraped.schedule_types || ['Full-time'],
      special_programs: scraped.special_programs || []
    },

    availability: {
      accepting_enrollment: scraped.accepting_enrollment || null,
      infant_spots: scraped.infant_spots || null,
      toddler_spots: scraped.toddler_spots || null,
      preschool_spots: scraped.preschool_spots || null,
      waitlist_available: scraped.waitlist_available || null,
      last_updated: new Date().toISOString().split('T')[0]
    },

    pricing: {
      infant_monthly: scraped.pricing?.infant_monthly || null,
      toddler_monthly: scraped.pricing?.toddler_monthly || null,
      preschool_monthly: scraped.pricing?.preschool_monthly || null,
      currency: 'USD',
      financial_assistance: scraped.pricing?.financial_assistance || false,
      subsidy_accepted: scraped.pricing?.subsidy_accepted || false
    },

    ratings: {
      overall: scraped.rating || 0,
      google_rating: 0,
      yelp_rating: 0,
      review_count: scraped.review_count || 0
    },

    reviews: scraped.reviews || [],
    photos: scraped.photos || [],
    verified: false,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function mergeAndEnrich() {
  console.log('🔄 Merge & Enrich Daycare Data\n');
  console.log('════════════════════════════════════════\n');

  // 1. Load existing daycares
  console.log('📂 Step 1: Loading existing daycares...');
  let existing = [];
  if (fs.existsSync(EXISTING_FILE)) {
    existing = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
    console.log(`✅ Loaded ${existing.length} existing daycares\n`);
  } else {
    console.log('⚠️  No existing daycares file found\n');
  }

  // 2. Load scraped data from Claude browser extension
  console.log('📥 Step 2: Loading scraped data from Claude extension...');
  let scraped = [];
  if (fs.existsSync(SCRAPED_FILE)) {
    const scrapedRaw = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));

    // Transform to our schema
    scraped = Array.isArray(scrapedRaw)
      ? scrapedRaw.map(transformScrapedData)
      : [transformScrapedData(scrapedRaw)];

    console.log(`✅ Loaded ${scraped.length} scraped daycares`);
    console.log(`   First: ${scraped[0]?.name || 'N/A'}\n`);
  } else {
    console.log('⚠️  No scraped data found at: src/data/daycares-scraped.json');
    console.log('💡 Use Claude browser extension to scrape CA CDSS database');
    console.log('   Then save the JSON as: src/data/daycares-scraped.json\n');

    // If no scraped data, just enrich existing
    if (existing.length === 0) {
      console.error('❌ No data to process!');
      process.exit(1);
    }
    console.log('📍 Continuing with existing daycares only...\n');
  }

  // 3. Merge and deduplicate
  console.log('🔀 Step 3: Merging and deduplicating...');
  const merged = [...existing];
  let addedCount = 0;
  let duplicateCount = 0;

  for (const scrapedDaycare of scraped) {
    // Check if this is a duplicate
    const duplicate = merged.find(existing => isDuplicate(existing, scrapedDaycare));

    if (duplicate) {
      duplicateCount++;
      console.log(`  ⏭️  Skip duplicate: ${scrapedDaycare.name}`);

      // Merge licensing data if better
      if (scrapedDaycare.licensing.license_number && !duplicate.licensing.license_number) {
        duplicate.licensing = { ...duplicate.licensing, ...scrapedDaycare.licensing };
      }
    } else {
      merged.push(scrapedDaycare);
      addedCount++;
      console.log(`  ✅ Added: ${scrapedDaycare.name}`);
    }
  }

  console.log(`\n📊 Merge Results:`);
  console.log(`   Total: ${merged.length} daycares`);
  console.log(`   Added: ${addedCount} new`);
  console.log(`   Skipped: ${duplicateCount} duplicates\n`);

  // 4. Enrich with Google Places
  console.log('════════════════════════════════════════');
  console.log('📍 Step 4: GOOGLE PLACES ENRICHMENT');
  console.log('════════════════════════════════════════\n');

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.log('⚠️  GOOGLE_PLACES_API_KEY not found');
    console.log('⏭️  Skipping Google enrichment\n');
  } else {
    console.log(`🔍 Enriching ${merged.length} daycares with Google Places...\n`);

    const googleData = await scrapeGooglePlaces(merged);
    console.log(`\n✅ Found ${googleData.length} matches on Google\n`);

    // Merge Google data
    console.log('🔄 Step 5: Merging Google data...\n');
    for (let i = 0; i < merged.length; i++) {
      const daycare = merged[i];
      const googleMatch = googleData.find(g => g.original_id === daycare.id);

      if (googleMatch) {
        console.log(`  ✅ ${daycare.name}`);
        console.log(`     Rating: ${googleMatch.ratings.overall}★ (${googleMatch.ratings.review_count} reviews)`);

        merged[i] = {
          ...daycare,
          contact: {
            ...daycare.contact,
            phone: googleMatch.contact.phone || daycare.contact.phone,
            website: googleMatch.contact.website || daycare.contact.website
          },
          hours: googleMatch.hours || daycare.hours,
          ratings: {
            ...daycare.ratings,
            google_rating: googleMatch.ratings.overall,
            google_review_count: googleMatch.ratings.review_count,
            overall: googleMatch.ratings.overall || daycare.ratings.overall
          },
          reviews: [
            ...(daycare.reviews || []),
            ...googleMatch.reviews
          ],
          photos: [
            ...(daycare.photos || []),
            ...googleMatch.photos
          ],
          google_place_id: googleMatch.google_place_id,
          verified: true,
          updated_at: new Date().toISOString()
        };
      } else {
        console.log(`  ⚠️  ${daycare.name} - No Google match`);
      }
    }
  }

  // 6. Save final merged data
  console.log('\n════════════════════════════════════════');
  console.log('💾 Step 6: Saving final dataset...');
  console.log('════════════════════════════════════════\n');

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));
  console.log(`✅ Saved to: ${OUTPUT_FILE}`);

  // 7. Summary
  console.log('\n════════════════════════════════════════');
  console.log('📊 FINAL SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`Total daycares: ${merged.length}`);
  console.log(`With licensing data: ${merged.filter(d => d.licensing.license_number).length}`);
  console.log(`With Google data: ${merged.filter(d => d.google_place_id).length}`);
  console.log(`With reviews: ${merged.filter(d => d.reviews?.length > 0).length}`);
  console.log(`With photos: ${merged.filter(d => d.photos?.length > 0).length}`);
  console.log(`Verified: ${merged.filter(d => d.verified).length}`);

  console.log('\n✨ Merge & enrichment complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Review: src/data/daycares-merged.json');
  console.log('   2. If looks good, copy to production:');
  console.log(`      cp "${OUTPUT_FILE}" "${EXISTING_FILE}"`);
  console.log('   3. Deploy:');
  console.log('      git add -A && git commit -m "Update daycare dataset" && railway up --detach');

  return merged;
}

mergeAndEnrich()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Merge failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
