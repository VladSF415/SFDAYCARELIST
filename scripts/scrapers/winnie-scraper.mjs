#!/usr/bin/env node
// Scrape Winnie.com for San Francisco daycare listings
// Uses their public API endpoints

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../../src/data/daycares-scraped.json');
const DELAY_MS = 1000; // 1 second between requests

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Winnie's search API endpoint (discovered from network tab)
const WINNIE_API = 'https://api.winnie.com/api/v4/search';

async function scrapeWinnie() {
  console.log('🍼 Scraping Winnie.com for San Francisco Daycares\n');
  console.log('════════════════════════════════════════\n');

  const allDaycares = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      console.log(`📄 Fetching page ${page}...`);

      const response = await fetch(WINNIE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          location: {
            city: 'San Francisco',
            state: 'CA',
            lat: 37.7749,
            lng: -122.4194
          },
          filters: {
            types: ['daycare', 'preschool', 'family_daycare'],
            licensed: true
          },
          page: page,
          per_page: 50
        })
      });

      if (!response.ok) {
        console.log(`⚠️  API returned status ${response.status}`);
        console.log('💡 Winnie may have changed their API or requires authentication');
        console.log('\n🔄 Falling back to manual scraping instructions...\n');
        printManualInstructions();
        process.exit(1);
      }

      const data = await response.json();
      const results = data.results || data.providers || [];

      if (results.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`✅ Found ${results.length} daycares on page ${page}`);

      // Transform each result
      for (const provider of results) {
        const daycare = {
          name: provider.name || provider.title,
          address: provider.address?.full || provider.street_address,
          city: provider.address?.city || 'San Francisco',
          state: provider.address?.state || 'CA',
          zip: provider.address?.zip || provider.zipcode,
          phone: provider.phone || provider.contact_phone,
          website: provider.website,
          description: provider.description || provider.bio,
          rating: provider.rating || provider.average_rating,
          review_count: provider.review_count || provider.reviews_count || 0,
          photos: provider.photos?.map(p => p.url || p) || [],
          reviews: (provider.reviews || []).map(r => ({
            author: r.author_name || r.user_name || 'Anonymous',
            text: r.text || r.review,
            rating: r.rating,
            date: r.created_at || r.date
          })),
          languages: provider.languages || [],
          age_groups: provider.age_groups || provider.ages_served || [],
          license_number: provider.license_number,
          capacity: provider.capacity
        };

        allDaycares.push(daycare);
        console.log(`  📍 ${daycare.name}`);
      }

      page++;
      await sleep(DELAY_MS);

      // Safety limit
      if (page > 20) {
        console.log('\n⚠️  Reached page limit (20 pages)');
        hasMore = false;
      }
    }

    if (allDaycares.length === 0) {
      console.log('❌ No daycares found. API may require authentication.');
      printManualInstructions();
      process.exit(1);
    }

    // Save results
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allDaycares, null, 2));

    console.log('\n════════════════════════════════════════');
    console.log('📊 RESULTS');
    console.log('════════════════════════════════════════');
    console.log(`Total daycares scraped: ${allDaycares.length}`);
    console.log(`With reviews: ${allDaycares.filter(d => d.reviews?.length > 0).length}`);
    console.log(`With photos: ${allDaycares.filter(d => d.photos?.length > 0).length}`);
    console.log(`\n💾 Saved to: ${OUTPUT_FILE}`);

    console.log('\n✨ Winnie scraping complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run merge script: npm run scrape:merge');
    console.log('   2. Or run CSV import if you have CDSS data: npm run import:csv');

  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    printManualInstructions();
    process.exit(1);
  }
}

function printManualInstructions() {
  console.log('\n════════════════════════════════════════');
  console.log('🤖 USE CLAUDE BROWSER EXTENSION INSTEAD');
  console.log('════════════════════════════════════════\n');

  console.log('Since Winnie\'s API requires authentication, use your Claude browser extension:\n');

  console.log('1. Open: https://winnie.com/search?location=San%20Francisco%2C%20CA\n');

  console.log('2. Paste this prompt into Claude extension:\n');
  console.log('─────────────────────────────────────────');
  console.log('Extract ALL daycares from San Francisco (paginate through all pages).');
  console.log('');
  console.log('For each daycare, extract:');
  console.log('- name');
  console.log('- address (full street address)');
  console.log('- phone');
  console.log('- website');
  console.log('- description');
  console.log('- rating (number)');
  console.log('- review_count (number)');
  console.log('- photos (array of image URLs)');
  console.log('- reviews (array with: author, text, rating, date)');
  console.log('');
  console.log('Save as JSON array to file.');
  console.log('─────────────────────────────────────────\n');

  console.log('3. Save the JSON file as: src/data/daycares-scraped.json\n');
  console.log('4. Run: npm run scrape:merge\n');
}

scrapeWinnie()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
