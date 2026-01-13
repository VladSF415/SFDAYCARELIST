#!/usr/bin/env node
// Simple scraper to enrich existing daycares with Google Places data

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import scrapeGooglePlaces from './google-places-scraper.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXISTING_FILE = path.join(__dirname, '../../src/data/daycares.json');
const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-enriched.json');

async function enrichExistingDaycares() {
  console.log('🚀 Enriching Existing Daycares with Google Places Data\n');
  console.log('════════════════════════════════════════\n');

  // Load existing daycares
  console.log('📂 Loading existing daycares...');
  if (!fs.existsSync(EXISTING_FILE)) {
    console.error(`❌ File not found: ${EXISTING_FILE}`);
    process.exit(1);
  }

  const daycares = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
  console.log(`✅ Loaded ${daycares.length} daycares\n`);

  // Run Google Places scraper
  console.log('════════════════════════════════════════');
  console.log('📍 GOOGLE PLACES API');
  console.log('════════════════════════════════════════\n');

  const googleData = await scrapeGooglePlaces(daycares);
  console.log(`\n✅ Found ${googleData.length} matches on Google\n`);

  // Merge Google data back into daycares
  console.log('════════════════════════════════════════');
  console.log('🔄 MERGING DATA');
  console.log('════════════════════════════════════════\n');

  const enriched = daycares.map(daycare => {
    // Find matching Google data by ID (the scraper stores original_id)
    const googleMatch = googleData.find(g => g.original_id === daycare.id);

    if (!googleMatch) {
      console.log(`⚠️  No Google data for: ${daycare.name}`);
      return daycare;
    }

    console.log(`✅ Enriched: ${daycare.name}`);

    return {
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
      reviews: [...(daycare.reviews || []), ...googleMatch.reviews],
      photos: [...(daycare.photos || []), ...googleMatch.photos],
      google_place_id: googleMatch.google_place_id,
      updated_at: new Date().toISOString()
    };
  });

  // Save enriched data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log(`\n════════════════════════════════════════`);
  console.log('📊 SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`Total daycares: ${enriched.length}`);
  console.log(`With Google data: ${enriched.filter(d => d.google_place_id).length}`);
  console.log(`With reviews: ${enriched.filter(d => d.reviews?.length > 0).length}`);
  console.log(`With photos: ${enriched.filter(d => d.photos?.length > 0).length}`);
  console.log(`\n💾 Saved to: ${OUTPUT_FILE}`);
  console.log('\n✨ Enrichment complete!');
  console.log('\n💡 Next step: Copy enriched data to main file:');
  console.log(`   cp "${OUTPUT_FILE}" "${EXISTING_FILE}"`);
}

enrichExistingDaycares()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Enrichment failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
