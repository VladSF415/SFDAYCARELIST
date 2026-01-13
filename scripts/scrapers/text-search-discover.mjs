#!/usr/bin/env node
// Use Google Places Text Search to find all daycares
// Text search works better than nearby search for this use case

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-list-generated.txt');
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const DELAY_MS = 500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function textSearch(query, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;

  if (pageToken) {
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pageToken}&key=${API_KEY}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error(`API Error: ${data.status}`);
  }

  return data;
}

async function discoverWithTextSearch() {
  console.log('🔍 Discovering Daycares using Text Search\n');
  console.log('════════════════════════════════════════\n');

  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in .env');
    process.exit(1);
  }

  const allPlaces = new Map();

  const searchQueries = [
    'daycare San Francisco CA',
    'preschool San Francisco CA',
    'child care center San Francisco CA',
    'family daycare San Francisco CA',
    'nursery school San Francisco CA',
    'infant care San Francisco CA',
    'toddler care San Francisco CA',
    'montessori school San Francisco CA'
  ];

  for (const query of searchQueries) {
    console.log(`\n🔍 Searching: "${query}"`);
    console.log('─────────────────────────────────────────\n');

    let pageToken = null;
    let pageNum = 1;

    do {
      if (pageToken) {
        console.log(`   ⏳ Waiting for next page...`);
        await sleep(2000);
      }

      const data = await textSearch(query, pageToken);

      if (data.results && data.results.length > 0) {
        console.log(`   Page ${pageNum}: Found ${data.results.length} results`);

        for (const place of data.results) {
          if (!allPlaces.has(place.place_id)) {
            allPlaces.set(place.place_id, place);
            console.log(`      ✅ ${place.name}`);
          } else {
            console.log(`      ⏭️  ${place.name} (duplicate)`);
          }
        }
      }

      pageToken = data.next_page_token;
      pageNum++;

      if (pageToken) {
        await sleep(DELAY_MS);
      }

    } while (pageToken && pageNum <= 3); // Limit to 3 pages per query
  }

  console.log(`\n\n📊 Discovery Complete: ${allPlaces.size} unique daycares found\n`);

  // Generate text list file
  console.log('📝 Generating list file...\n');

  const lines = ['# San Francisco Daycares - Auto-discovered via Google Places'];
  lines.push('# Format: Name | Address');
  lines.push('# Generated on: ' + new Date().toISOString());
  lines.push('');

  for (const [_, place] of allPlaces.entries()) {
    const address = place.formatted_address || place.vicinity || '';
    lines.push(`${place.name} | ${address}`);
  }

  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'));

  console.log(`✅ Generated list with ${allPlaces.size} daycares`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);

  console.log('\n✨ Discovery complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Review: src/data/daycares-list-generated.txt');
  console.log('   2. Copy or append to: src/data/daycares-list.txt');
  console.log('   3. Run: npm run import:list');
  console.log('   4. Deploy!');

  return allPlaces;
}

discoverWithTextSearch()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Discovery failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
