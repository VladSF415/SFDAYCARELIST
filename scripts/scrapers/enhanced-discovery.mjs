#!/usr/bin/env node
// Enhanced discovery with neighborhood-specific and program-specific searches
// Goal: Find ALL 1450+ licensed daycares in San Francisco

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-list-expanded.txt');
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

async function enhancedDiscovery() {
  console.log('🔍 ENHANCED DISCOVERY - Finding ALL SF Daycares\n');
  console.log('════════════════════════════════════════\n');

  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in .env');
    process.exit(1);
  }

  const allPlaces = new Map();

  // Comprehensive search queries (50+ queries for maximum coverage)
  const searchQueries = [
    // General searches
    'daycare San Francisco CA',
    'preschool San Francisco CA',
    'child care center San Francisco CA',
    'family daycare San Francisco CA',
    'nursery school San Francisco CA',
    'infant care San Francisco CA',
    'toddler care San Francisco CA',
    'kindergarten San Francisco CA',

    // Program-specific searches
    'montessori school San Francisco CA',
    'waldorf school San Francisco CA',
    'reggio emilia San Francisco CA',
    'play-based preschool San Francisco CA',
    'bilingual daycare San Francisco CA',
    'spanish immersion preschool San Francisco CA',
    'mandarin preschool San Francisco CA',
    'french preschool San Francisco CA',
    'language immersion daycare San Francisco CA',

    // Neighborhood-specific searches (major SF neighborhoods)
    'daycare Mission District San Francisco',
    'daycare Castro San Francisco',
    'daycare Noe Valley San Francisco',
    'daycare Marina San Francisco',
    'daycare Pacific Heights San Francisco',
    'daycare Richmond San Francisco',
    'daycare Sunset San Francisco',
    'daycare SOMA San Francisco',
    'daycare Financial District San Francisco',
    'daycare North Beach San Francisco',
    'daycare Chinatown San Francisco',
    'daycare Potrero Hill San Francisco',
    'daycare Haight Ashbury San Francisco',
    'daycare Bernal Heights San Francisco',
    'daycare Presidio San Francisco',
    'daycare Glen Park San Francisco',
    'daycare Excelsior San Francisco',
    'daycare Bayview San Francisco',
    'daycare Visitacion Valley San Francisco',

    // Additional type variations
    'early childhood education San Francisco CA',
    'early learning center San Francisco CA',
    'child development center San Francisco CA',
    'children learning center San Francisco CA',
    'kids academy San Francisco CA',
    'little learners San Francisco CA',
    'childcare facility San Francisco CA',
    'after school care San Francisco CA',
    'before school care San Francisco CA',

    // Religious/cultural searches
    'catholic preschool San Francisco CA',
    'jewish preschool San Francisco CA',
    'christian daycare San Francisco CA',
    'church daycare San Francisco CA',

    // Special needs
    'special needs daycare San Francisco CA',
    'inclusive preschool San Francisco CA',

    // Corporate/employer-sponsored
    'employer daycare San Francisco CA',
    'workplace childcare San Francisco CA'
  ];

  console.log(`📋 Running ${searchQueries.length} comprehensive searches\n`);

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

    console.log(`   Unique daycares so far: ${allPlaces.size}`);
    await sleep(DELAY_MS);
  }

  console.log(`\n\n📊 Discovery Complete: ${allPlaces.size} unique daycares found\n`);

  // Generate text list file
  console.log('📝 Generating expanded list file...\n');

  const lines = ['# San Francisco Daycares - Enhanced Auto-discovery via Google Places'];
  lines.push('# Format: Name | Address');
  lines.push('# Generated on: ' + new Date().toISOString());
  lines.push(`# Total discovered: ${allPlaces.size}`);
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
  console.log('   1. Review: src/data/daycares-list-expanded.txt');
  console.log('   2. Append to existing: cat src/data/daycares-list-expanded.txt >> src/data/daycares-list.txt');
  console.log('   3. Run: npm run import:list');
  console.log('   4. Deploy!');

  return allPlaces;
}

enhancedDiscovery()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Discovery failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
