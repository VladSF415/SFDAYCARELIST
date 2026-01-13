// ==============================================================================
// CA CHILDCARE LICENSING DATABASE SCRAPER
// ==============================================================================
// Scrapes official California Department of Social Services (CDSS) licensing database
// Source: https://secure.dss.ca.gov/CareFacilitySearch/

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../../data/scraped/ca-licensing-facilities.json');
const DELAY_MS = 1000; // 1 second delay between requests to be respectful

// CA CDSS Facility Search API endpoint
const CA_API_BASE = 'https://secure.dss.ca.gov/CareFacilitySearch';

/**
 * Sleep utility for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search for childcare facilities in San Francisco
 */
async function searchFacilities() {
  console.log('🔍 Searching CA licensing database for SF childcare facilities...');

  try {
    // Search parameters for San Francisco child care centers
    const searchParams = {
      FacilityType: '801', // Child Care Center
      City: 'San Francisco',
      County: 'San Francisco',
      FacilityStatus: 'Licensed',
      PageSize: 1000
    };

    const response = await fetch(`${CA_API_BASE}/Search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; SFDaycareList/1.0; +https://sfdaycarelist.com)'
      },
      body: JSON.stringify(searchParams)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.facilities?.length || 0} licensed facilities`);

    return data.facilities || [];
  } catch (error) {
    console.error('❌ Error searching facilities:', error.message);

    // Fallback: Try scraping HTML if API fails
    return scrapeFacilitiesHTML();
  }
}

/**
 * Fallback: Scrape facilities from HTML (if API unavailable)
 */
async function scrapeFacilitiesHTML() {
  console.log('⚠️  API unavailable, attempting HTML scraping...');

  // Note: This would require additional libraries like cheerio or jsdom
  // For now, return empty array and log instructions
  console.log(`
📋 Manual Steps to Get CA Licensing Data:
1. Visit: https://secure.dss.ca.gov/CareFacilitySearch/
2. Search for: City = "San Francisco", Type = "Child Care Center"
3. Export results as CSV/Excel
4. Place file in data/scraped/ca-licensing-manual.csv
5. Run: npm run scrapers:process
  `);

  return [];
}

/**
 * Get detailed facility information
 */
async function getFacilityDetails(facilityNumber) {
  console.log(`  Fetching details for facility ${facilityNumber}...`);

  await sleep(DELAY_MS); // Rate limiting

  try {
    const response = await fetch(`${CA_API_BASE}/FacilityDetails/${facilityNumber}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SFDaycareList/1.0; +https://sfdaycarelist.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const details = await response.json();
    return details;
  } catch (error) {
    console.error(`  ❌ Error fetching details for ${facilityNumber}:`, error.message);
    return null;
  }
}

/**
 * Get inspection history
 */
async function getInspectionHistory(facilityNumber) {
  await sleep(DELAY_MS);

  try {
    const response = await fetch(`${CA_API_BASE}/Inspections/${facilityNumber}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SFDaycareList/1.0)'
      }
    });

    if (!response.ok) return [];

    const inspections = await response.json();
    return inspections || [];
  } catch (error) {
    console.error(`  ⚠️  Could not fetch inspections for ${facilityNumber}`);
    return [];
  }
}

/**
 * Transform CA licensing data to our format
 */
function transformToOurFormat(facility, details, inspections) {
  const latestInspection = inspections[0] || {};

  return {
    id: `${facility.FacilityName.toLowerCase().replace(/\s+/g, '-')}-${facility.FacilityNumber}`,
    name: facility.FacilityName,
    slug: facility.FacilityName.toLowerCase().replace(/\s+/g, '-'),

    contact: {
      phone: facility.FacilityPhone || '',
      email: details?.ContactEmail || '',
      website: details?.Website || ''
    },

    location: {
      address: facility.FacilityAddress,
      city: facility.City,
      state: 'CA',
      zip: facility.ZipCode,
      neighborhood: inferNeighborhood(facility.FacilityAddress),
      latitude: facility.Latitude,
      longitude: facility.Longitude,
      public_transit: []
    },

    licensing: {
      license_number: facility.FacilityNumber,
      status: facility.FacilityStatus,
      type: facility.FacilityType,
      capacity: facility.LicensedCapacity || 0,
      issued_date: facility.OriginalLicenseDate,
      expiration_date: facility.ExpirationDate,
      last_inspection: latestInspection.InspectionDate || null,
      inspection_score: latestInspection.OverallScore || null,
      violations: inspections.filter(i => i.ViolationCount > 0).map(i => ({
        date: i.InspectionDate,
        type: i.ViolationType,
        description: i.ViolationDescription
      })),
      data_source: 'CA Department of Social Services'
    },

    program: {
      age_groups: inferAgeGroups(details),
      ages_min_months: details?.MinimumAge || 0,
      ages_max_years: details?.MaximumAge || 12,
      languages: ['English'],
      curriculum: '',
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

    source: 'ca-licensing',
    scraped_at: new Date().toISOString()
  };
}

/**
 * Infer SF neighborhood from address
 */
function inferNeighborhood(address) {
  const neighborhoodKeywords = {
    'mission': 'mission-district',
    'castro': 'castro',
    'noe valley': 'noe-valley',
    'pacific heights': 'pacific-heights',
    'richmond': 'richmond',
    'sunset': 'sunset',
    'haight': 'haight-ashbury',
    'marina': 'marina',
    'north beach': 'north-beach',
    'financial district': 'financial-district',
    'soma': 'soma',
    'potrero': 'potrero-hill'
  };

  const lowerAddress = address.toLowerCase();
  for (const [keyword, slug] of Object.entries(neighborhoodKeywords)) {
    if (lowerAddress.includes(keyword)) {
      return slug;
    }
  }

  return 'unknown';
}

/**
 * Infer age groups from facility details
 */
function inferAgeGroups(details) {
  const groups = [];
  const minMonths = details?.MinimumAge || 0;
  const maxYears = details?.MaximumAge || 12;

  if (minMonths <= 12) groups.push('infant');
  if (minMonths <= 36 && maxYears >= 1) groups.push('toddler');
  if (maxYears >= 3) groups.push('preschool');

  return groups;
}

/**
 * Main scraper function
 */
async function scrapeCALicensing() {
  console.log('🚀 Starting CA Licensing Database Scraper\n');

  // Create output directory
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Step 1: Search for facilities
  const facilities = await searchFacilities();

  if (facilities.length === 0) {
    console.log('❌ No facilities found or API unavailable');
    return;
  }

  // Step 2: Get details for each facility
  const results = [];
  console.log(`\n📊 Fetching details for ${facilities.length} facilities...`);

  for (let i = 0; i < facilities.length; i++) {
    const facility = facilities[i];
    console.log(`\n[${i + 1}/${facilities.length}] ${facility.FacilityName}`);

    const details = await getFacilityDetails(facility.FacilityNumber);
    const inspections = await getInspectionHistory(facility.FacilityNumber);

    const transformed = transformToOurFormat(facility, details, inspections);
    results.push(transformed);
  }

  // Step 3: Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n✅ Saved ${results.length} facilities to ${OUTPUT_FILE}`);

  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeCALicensing()
    .then(() => {
      console.log('\n✨ CA Licensing scraper completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Scraper failed:', error);
      process.exit(1);
    });
}

export default scrapeCALicensing;
