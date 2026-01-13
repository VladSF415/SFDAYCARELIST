import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing scraper setup...\n');

// Test 1: Check API key
console.log('1️⃣  Checking Google Places API key...');
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (apiKey) {
  console.log(`✅ API key found: ${apiKey.substring(0, 20)}...`);
} else {
  console.log('❌ API key not found');
}

// Test 2: Check existing daycares file
console.log('\n2️⃣  Checking existing daycares file...');
const EXISTING_FILE = path.join(__dirname, '../../src/data/daycares.json');
console.log(`   Path: ${EXISTING_FILE}`);

if (fs.existsSync(EXISTING_FILE)) {
  const data = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
  console.log(`✅ Found ${data.length} existing daycares`);
  console.log(`   First daycare: ${data[0]?.name}`);
} else {
  console.log('❌ File not found');
}

// Test 3: Simple API test
console.log('\n3️⃣  Testing Google Places API...');
const testQuery = 'Little Flower Montessori San Francisco';
const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(testQuery)}&inputtype=textquery&fields=place_id,name&key=${apiKey}`;

try {
  const response = await fetch(url);
  const result = await response.json();

  if (result.status === 'OK') {
    console.log(`✅ API working! Found: ${result.candidates[0]?.name}`);
  } else {
    console.log(`⚠️  API returned status: ${result.status}`);
    console.log(`   Message: ${result.error_message || 'No error message'}`);
  }
} catch (error) {
  console.log(`❌ API error: ${error.message}`);
}

console.log('\n✨ Test complete!');
