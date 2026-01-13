#!/usr/bin/env node
// Import daycare data from CSV files (CDSS, DataSF, Children's Council, etc.)
// Then enrich with Google Places

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import scrapeGooglePlaces from './google-places-scraper.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_INPUT = path.join(__dirname, '../../src/data/daycares.csv');
const EXISTING_FILE = path.join(__dirname, '../../src/data/daycares.json');
const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-imported.json');

// Field mapping for different CSV formats
const FIELD_MAPPINGS = {
  // CDSS Format
  cdss: {
    name: ['Facility Name', 'FacilityName', 'Name'],
    address: ['Facility Address', 'FacilityAddress', 'Address', 'Street'],
    city: ['Facility City', 'City'],
    state: ['Facility State', 'State'],
    zip: ['Facility Zip', 'ZIP', 'ZipCode', 'Zip Code'],
    phone: ['Facility Telephone Number', 'Phone', 'Telephone'],
    license_number: ['Facility Number', 'License Number', 'LicenseNumber'],
    license_type: ['Facility Type', 'Type', 'License Type'],
    license_status: ['Facility Status', 'Status'],
    capacity: ['Facility Capacity', 'Capacity', 'Licensed Capacity'],
    county: ['County']
  },
  // Children's Council Format
  childrens_council: {
    name: ['Provider Name', 'Name', 'Facility'],
    address: ['Address', 'Street Address'],
    phone: ['Phone Number', 'Contact Phone'],
    description: ['Description', 'About'],
    languages: ['Languages Spoken', 'Languages'],
    ages: ['Ages Served', 'Age Range']
  },
  // DataSF Format
  datasf: {
    name: ['site_name', 'name'],
    address: ['site_address', 'address'],
    phone: ['phone_number', 'phone'],
    city: ['city'],
    zip: ['zip_code', 'zipcode']
  }
};

function findFieldValue(row, possibleFields) {
  for (const field of possibleFields) {
    if (row[field] !== undefined && row[field] !== null && row[field] !== '') {
      return row[field];
    }
  }
  return null;
}

function detectCSVFormat(headers) {
  // Try to detect which format based on headers
  if (headers.some(h => h.includes('Facility Number') || h.includes('FacilityNumber'))) {
    return 'cdss';
  }
  if (headers.some(h => h.includes('Provider Name'))) {
    return 'childrens_council';
  }
  if (headers.some(h => h.includes('site_name') || h.includes('site_address'))) {
    return 'datasf';
  }
  return 'cdss'; // default
}

function generateId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function inferNeighborhood(address, zip) {
  const neighborhoodMap = {
    '94102': 'Civic Center / Tenderloin',
    '94103': 'South of Market (SOMA)',
    '94104': 'Financial District',
    '94105': 'South Beach / Mission Bay',
    '94107': 'Potrero Hill',
    '94108': 'Chinatown / North Beach',
    '94109': 'Nob Hill / Russian Hill',
    '94110': 'Mission District',
    '94111': 'Chinatown',
    '94112': 'Excelsior / Outer Mission',
    '94114': 'Castro / Noe Valley',
    '94115': 'Western Addition / Pacific Heights',
    '94116': 'Parkside / Sunset',
    '94117': 'Haight-Ashbury',
    '94118': 'Inner Richmond',
    '94121': 'Outer Richmond',
    '94122': 'Outer Sunset',
    '94123': 'Marina / Cow Hollow',
    '94124': 'Bayview / Hunters Point',
    '94127': 'West Portal / St. Francis Wood',
    '94129': 'Presidio',
    '94131': 'Glen Park / Diamond Heights',
    '94132': 'Lake Merced',
    '94133': 'North Beach / Telegraph Hill',
    '94134': 'Visitacion Valley',
    '94158': 'Mission Bay'
  };

  return neighborhoodMap[zip] || 'San Francisco';
}

function transformCSVRow(row, format) {
  const mapping = FIELD_MAPPINGS[format];

  const name = findFieldValue(row, mapping.name) || 'Unknown Daycare';
  const address = findFieldValue(row, mapping.address) || '';
  const zip = findFieldValue(row, mapping.zip) || '';
  const phone = findFieldValue(row, mapping.phone) || '';

  return {
    id: generateId(name),
    name: name,
    tagline: '',
    description: findFieldValue(row, mapping.description || []) || '',
    hero_image: '',

    location: {
      street: address,
      city: findFieldValue(row, mapping.city) || 'San Francisco',
      state: findFieldValue(row, mapping.state) || 'CA',
      zip: zip,
      neighborhood: inferNeighborhood(address, zip),
      latitude: 37.7749,
      longitude: -122.4194,
      public_transit: []
    },

    contact: {
      phone: phone,
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
      license_number: findFieldValue(row, mapping.license_number || []) || '',
      status: findFieldValue(row, mapping.license_status || []) || 'Licensed',
      type: findFieldValue(row, mapping.license_type || []) || 'Child Care Center',
      capacity: parseInt(findFieldValue(row, mapping.capacity || []) || 0),
      issued_date: null,
      expiration_date: null,
      last_inspection: null,
      data_source: format === 'cdss' ? 'CA Department of Social Services' : 'Local Directory'
    },

    program: {
      age_groups: ['Infants', 'Toddlers', 'Preschool'],
      ages_min_months: 0,
      ages_max_years: 5,
      languages: findFieldValue(row, mapping.languages || [])?.split(',').map(l => l.trim()) || ['English'],
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

function isDuplicate(daycare1, daycare2) {
  const normalizeString = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const name1 = normalizeString(daycare1.name);
  const name2 = normalizeString(daycare2.name);

  const addr1 = normalizeString(daycare1.location?.street || '');
  const addr2 = normalizeString(daycare2.location?.street || '');

  // Same name and similar address
  if (name1 === name2) return true;
  if (name1.includes(name2) || name2.includes(name1)) {
    if (addr1.includes(addr2) || addr2.includes(addr1)) {
      return true;
    }
  }

  return false;
}

async function importCSV() {
  console.log('📊 Import Daycare Data from CSV\n');
  console.log('════════════════════════════════════════\n');

  // Check if CSV exists
  if (!fs.existsSync(CSV_INPUT)) {
    console.error('❌ CSV file not found at:', CSV_INPUT);
    console.log('\n💡 Download CSV from one of these sources:');
    console.log('   1. CDSS: https://www.cdss.ca.gov/inforesources/data-portal');
    console.log('   2. DataSF: https://data.sfgov.org (search "child care")');
    console.log('   3. Children\'s Council: Contact for data export');
    console.log('\n   Save as: src/data/daycares.csv');
    process.exit(1);
  }

  // Load existing daycares
  console.log('📂 Loading existing daycares...');
  let existing = [];
  if (fs.existsSync(EXISTING_FILE)) {
    existing = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
    console.log(`✅ Loaded ${existing.length} existing daycares\n`);
  }

  // Parse CSV
  console.log('📥 Parsing CSV file...');
  const csvContent = fs.readFileSync(CSV_INPUT, 'utf8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  console.log(`✅ Found ${records.length} rows in CSV\n`);

  // Detect format
  const headers = Object.keys(records[0]);
  const format = detectCSVFormat(headers);
  console.log(`🔍 Detected format: ${format.toUpperCase()}\n`);

  // Transform rows
  console.log('🔄 Transforming CSV to JSON...');
  const imported = [];
  let duplicateCount = 0;
  let addedCount = 0;

  for (const row of records) {
    const daycare = transformCSVRow(row, format);

    // Skip if invalid
    if (!daycare.name || daycare.name === 'Unknown Daycare') {
      continue;
    }

    // Check for duplicates with existing
    const isDupe = [...existing, ...imported].some(existing =>
      isDuplicate(existing, daycare)
    );

    if (isDupe) {
      duplicateCount++;
      console.log(`  ⏭️  Skip duplicate: ${daycare.name}`);
    } else {
      imported.push(daycare);
      addedCount++;
      console.log(`  ✅ Added: ${daycare.name}`);
    }
  }

  console.log(`\n📊 Import Results:`);
  console.log(`   Total CSV rows: ${records.length}`);
  console.log(`   Valid daycares: ${addedCount}`);
  console.log(`   Duplicates skipped: ${duplicateCount}`);
  console.log(`   Final count: ${existing.length + addedCount}\n`);

  // Merge with existing
  const merged = [...existing, ...imported];

  // Enrich with Google Places
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (apiKey && merged.length > 0) {
    console.log('════════════════════════════════════════');
    console.log('📍 GOOGLE PLACES ENRICHMENT');
    console.log('════════════════════════════════════════\n');
    console.log(`🔍 Enriching ${merged.length} daycares...\n`);

    const googleData = await scrapeGooglePlaces(merged);
    console.log(`\n✅ Found ${googleData.length} matches on Google\n`);

    // Merge Google data
    for (let i = 0; i < merged.length; i++) {
      const daycare = merged[i];
      const googleMatch = googleData.find(g => g.original_id === daycare.id);

      if (googleMatch) {
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
      }
    }
  }

  // Save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));

  console.log('════════════════════════════════════════');
  console.log('📊 FINAL SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`Total daycares: ${merged.length}`);
  console.log(`With licensing data: ${merged.filter(d => d.licensing.license_number).length}`);
  console.log(`With Google data: ${merged.filter(d => d.google_place_id).length}`);
  console.log(`With reviews: ${merged.filter(d => d.reviews?.length > 0).length}`);
  console.log(`With photos: ${merged.filter(d => d.photos?.length > 0).length}`);
  console.log(`\n💾 Saved to: ${OUTPUT_FILE}`);

  console.log('\n✨ Import complete!');
  console.log('\n📋 Next steps:');
  console.log(`   1. Review: ${OUTPUT_FILE}`);
  console.log(`   2. Copy to production: cp "${OUTPUT_FILE}" "${EXISTING_FILE}"`);
  console.log('   3. Deploy: git add -A && git commit -m "Update dataset" && railway up --detach');

  return merged;
}

importCSV()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Import failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
