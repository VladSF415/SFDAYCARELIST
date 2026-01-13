#!/usr/bin/env node
// Quick import - Create basic daycare records from discovered list
// Google enrichment can be added later in batches

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../../src/data/daycares-list-expanded.txt');
const EXISTING_FILE = path.join(__dirname, '../../src/data/daycares.json');
const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares.json');

function generateId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function parseAddress(addressLine) {
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

function createBasicDaycare(name, address) {
  return {
    id: generateId(name),
    name: name.trim(),
    slug: generateId(name),
    tagline: '',
    description: `Licensed daycare facility in San Francisco. ${name} provides quality childcare services.`,
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
      data_source: 'Google Places Discovery'
    },
    program: {
      age_groups: ['infant', 'toddler', 'preschool'],
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
      google_review_count: 0,
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

function quickImport() {
  console.log('⚡ Quick Import - Basic Records\n');
  console.log('════════════════════════════════════════\n');

  // Load existing daycares
  console.log('📂 Loading existing daycares...');
  let existing = [];
  if (fs.existsSync(EXISTING_FILE)) {
    existing = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
    console.log(`✅ Loaded ${existing.length} existing daycares\n`);
  }

  // Parse the expanded list file
  console.log('📥 Parsing expanded list...');
  const content = fs.readFileSync(INPUT_FILE, 'utf8');
  const lines = content.split('\n');

  const newDaycares = [];
  let lineNum = 0;

  for (const line of lines) {
    lineNum++;

    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    const parts = line.split('|');
    if (parts.length !== 2) {
      console.log(`⚠️  Line ${lineNum}: Invalid format`);
      continue;
    }

    const name = parts[0].trim();
    const address = parts[1].trim();

    if (!name || !address) {
      continue;
    }

    const daycare = createBasicDaycare(name, address);
    newDaycares.push(daycare);
  }

  console.log(`✅ Parsed ${newDaycares.length} daycares\n`);

  // Merge with existing (remove duplicates)
  console.log('🔀 Merging with existing...');
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
    } else {
      merged.push(daycare);
      addedCount++;
    }
  }

  console.log(`\n   Added: ${addedCount} new daycares`);
  console.log(`   Skipped: ${duplicateCount} duplicates`);
  console.log(`   Total: ${merged.length} daycares\n`);

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));

  console.log('════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`Total daycares: ${merged.length}`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);

  console.log('\n✅ Quick import complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Deploy: npm run build && railway up --detach');
  console.log('   2. Enrich data later: npm run scrape:enrich');

  return merged;
}

quickImport();
