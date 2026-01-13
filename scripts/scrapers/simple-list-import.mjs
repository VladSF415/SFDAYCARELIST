#!/usr/bin/env node
// Import daycares from a simple text list and enrich with Google Places
// Just paste names and addresses - we'll do the rest!

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import scrapeGooglePlaces from './google-places-scraper.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../../src/data/daycares-list.txt');
const EXISTING_FILE = path.join(__dirname, '../../src/data/daycares.json');
const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-final.json');

function generateId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function parseAddress(addressLine) {
  // Try to extract zip code
  const zipMatch = addressLine.match(/\b\d{5}\b/);
  const zip = zipMatch ? zipMatch[0] : '';

  return {
    street: addressLine.replace(/,?\s*San Francisco.*$/i, '').trim(),
    city: 'San Francisco',
    state: 'CA',
    zip: zip,
    neighborhood: '',
    latitude: 37.7749,
    longitude: -122.4194,
    public_transit: []
  };
}

function createDaycare(name, address) {
  return {
    id: generateId(name),
    name: name.trim(),
    tagline: '',
    description: '',
    hero_image: '',
    location: parseAddress(address),
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    hours: {
      monday: { open: '7:00 AM', close: '6:00 PM' },
      tuesday: { open: '7:00 AM', close: '6:00 PM' },
      wednesday: { open: '7:00 AM', close: '6:00 PM' },
      thursday: { open: '7:00 AM', close: '6:00 PM' },
      friday: { open: '7:00 AM', close: '6:00 PM' },
      saturday: { open: 'Closed', close: 'Closed' },
      sunday: { open: 'Closed', close: 'Closed' }
    },
    licensing: {
      license_number: '',
      status: 'Licensed',
      type: 'Child Care Center',
      capacity: 0,
      issued_date: null,
      expiration_date: null,
      last_inspection: null,
      data_source: 'Manual Entry'
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
      accepting_enrollment: null,
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
      overall: 0,
      google_rating: 0,
      yelp_rating: 0,
      review_count: 0
    },
    reviews: [],
    photos: [],
    verified: false,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function importSimpleList() {
  console.log('📝 Simple List Import + Google Enrichment\n');
  console.log('════════════════════════════════════════\n');

  // Check if list file exists
  if (!fs.existsSync(INPUT_FILE)) {
    console.log('❌ List file not found: src/data/daycares-list.txt\n');
    console.log('📝 Creating example file...\n');

    const exampleContent = `# San Francisco Daycares
# Format: Name | Address
# One daycare per line
# Lines starting with # are ignored

Bright Horizons at UCSF | 2130 Folsom St, San Francisco, CA 94110
Little Bee Preschool | 95 Presidio Ave, San Francisco, CA 94115
Building Kidz School | 1655 Market St, San Francisco, CA 94103
Kids Kingdom | 1234 Valencia St, San Francisco, CA 94110
Blue Side Preschool | 567 Mission St, San Francisco, CA 94105

# Add more daycares below (one per line):
# Name | Address
`;

    fs.writeFileSync(INPUT_FILE, exampleContent);
    console.log('✅ Created: src/data/daycares-list.txt');
    console.log('\n💡 INSTRUCTIONS:');
    console.log('   1. Open src/data/daycares-list.txt');
    console.log('   2. Add daycares in this format:');
    console.log('      Name | Address');
    console.log('   3. One daycare per line');
    console.log('   4. Run this script again: npm run import:list');
    console.log('\n📋 Example:');
    console.log('   Sunshine Academy | 123 Market St, San Francisco, CA 94102');
    console.log('   Rainbow Kids | 456 Valencia St, San Francisco, CA 94110\n');
    process.exit(0);
  }

  // Load existing daycares
  console.log('📂 Loading existing daycares...');
  let existing = [];
  if (fs.existsSync(EXISTING_FILE)) {
    existing = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
    console.log(`✅ Loaded ${existing.length} existing daycares\n`);
  }

  // Parse the list file
  console.log('📥 Parsing list file...');
  const content = fs.readFileSync(INPUT_FILE, 'utf8');
  const lines = content.split('\n');

  const newDaycares = [];
  let lineNum = 0;

  for (const line of lines) {
    lineNum++;

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    // Parse "Name | Address" format
    const parts = line.split('|');
    if (parts.length !== 2) {
      console.log(`⚠️  Line ${lineNum}: Invalid format (need "Name | Address")`);
      console.log(`   ${line}`);
      continue;
    }

    const name = parts[0].trim();
    const address = parts[1].trim();

    if (!name || !address) {
      console.log(`⚠️  Line ${lineNum}: Missing name or address`);
      continue;
    }

    const daycare = createDaycare(name, address);
    newDaycares.push(daycare);
    console.log(`  ✅ ${name}`);
  }

  console.log(`\n📊 Parsed ${newDaycares.length} daycares from list\n`);

  if (newDaycares.length === 0) {
    console.log('❌ No valid daycares found in list file');
    console.log('💡 Check the format: Name | Address (one per line)');
    process.exit(1);
  }

  // Merge with existing (remove duplicates)
  console.log('🔀 Merging with existing daycares...');
  const merged = [...existing];
  let addedCount = 0;
  let duplicateCount = 0;

  for (const daycare of newDaycares) {
    const isDuplicate = merged.some(existing =>
      existing.name.toLowerCase() === daycare.name.toLowerCase() ||
      existing.id === daycare.id
    );

    if (isDuplicate) {
      duplicateCount++;
      console.log(`  ⏭️  Skip duplicate: ${daycare.name}`);
    } else {
      merged.push(daycare);
      addedCount++;
      console.log(`  ✅ Added: ${daycare.name}`);
    }
  }

  console.log(`\n   Added: ${addedCount} new daycares`);
  console.log(`   Skipped: ${duplicateCount} duplicates`);
  console.log(`   Total: ${merged.length} daycares\n`);

  // Enrich with Google Places
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.log('⚠️  GOOGLE_PLACES_API_KEY not set');
    console.log('⏭️  Skipping Google enrichment\n');
  } else {
    console.log('════════════════════════════════════════');
    console.log('📍 GOOGLE PLACES ENRICHMENT');
    console.log('════════════════════════════════════════\n');
    console.log(`🔍 Enriching ${merged.length} daycares with Google Places...\n`);

    const googleData = await scrapeGooglePlaces(merged);
    console.log(`\n✅ Found ${googleData.length} matches on Google\n`);

    // Merge Google data
    console.log('🔄 Merging Google data...\n');
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
          reviews: [...(daycare.reviews || []), ...googleMatch.reviews],
          photos: [...(daycare.photos || []), ...googleMatch.photos],
          google_place_id: googleMatch.google_place_id,
          verified: true,
          updated_at: new Date().toISOString()
        };
      } else {
        console.log(`  ⚠️  ${daycare.name} - No Google match`);
      }
    }
  }

  // Save final dataset
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));

  console.log('\n════════════════════════════════════════');
  console.log('📊 FINAL SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`Total daycares: ${merged.length}`);
  console.log(`With Google data: ${merged.filter(d => d.google_place_id).length}`);
  console.log(`With reviews: ${merged.filter(d => d.reviews?.length > 0).length}`);
  console.log(`With photos: ${merged.filter(d => d.photos?.length > 0).length}`);
  console.log(`Verified: ${merged.filter(d => d.verified).length}`);
  console.log(`\n💾 Saved to: ${OUTPUT_FILE}`);

  console.log('\n✨ Import complete!');
  console.log('\n📋 Next steps:');
  console.log(`   1. Review: ${OUTPUT_FILE}`);
  console.log(`   2. Copy to production: cp "${OUTPUT_FILE}" "${EXISTING_FILE}"`);
  console.log('   3. Deploy: git add -A && git commit -m "Update dataset" && railway up --detach');

  return merged;
}

importSimpleList()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Import failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
