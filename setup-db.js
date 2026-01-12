// Complete Database Setup Script
// Runs migrations and seeding in one go

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('');
  console.log('To run this script:');
  console.log('1. Copy DATABASE_URL from Railway Postgres service');
  console.log('2. Run: DATABASE_URL="your-url-here" node setup-db.js');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting database setup...\n');

    // Step 1: Run migrations
    console.log('📋 Step 1: Creating database schema...');
    const schema = readFileSync(join(__dirname, 'db', 'schema.sql'), 'utf-8');
    await client.query(schema);
    console.log('✅ Schema created successfully!\n');

    // Step 2: Load and insert neighborhoods
    console.log('📋 Step 2: Seeding neighborhoods...');
    const neighborhoodsData = JSON.parse(
      readFileSync(join(__dirname, 'data', 'neighborhoods.json'), 'utf-8')
    );

    for (const neighborhood of neighborhoodsData) {
      await client.query(`
        INSERT INTO neighborhoods (slug, name, description, center_lat, center_lng, zip_codes, nearby_neighborhoods, bart_stations, parks, meta_title, meta_description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          center_lat = EXCLUDED.center_lat,
          center_lng = EXCLUDED.center_lng
      `, [
        neighborhood.slug,
        neighborhood.name,
        neighborhood.description || '',
        neighborhood.center?.lat || null,
        neighborhood.center?.lng || null,
        neighborhood.zipCodes || [],
        neighborhood.nearbyNeighborhoods || [],
        neighborhood.bartStations || [],
        neighborhood.parks || [],
        neighborhood.metaTitle || `${neighborhood.name} Daycares - San Francisco`,
        neighborhood.metaDescription || `Find trusted daycares in ${neighborhood.name}, San Francisco.`
      ]);
    }
    console.log(`✅ Inserted ${neighborhoodsData.length} neighborhoods\n`);

    // Step 3: Load and insert daycares
    console.log('📋 Step 3: Seeding daycares...');
    const daycaresData = JSON.parse(
      readFileSync(join(__dirname, 'data', 'daycares.json'), 'utf-8')
    );

    for (const daycare of daycaresData) {
      await client.query(`
        INSERT INTO daycares (
          slug, name, description,
          contact_phone, contact_email, contact_website,
          location_address, location_city, location_state, location_zip, location_neighborhood,
          location_latitude, location_longitude,
          license_number, license_status, license_type, license_capacity,
          program_age_groups, program_languages,
          pricing_infant_monthly, pricing_toddler_monthly, pricing_preschool_monthly,
          features, verified
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description
      `, [
        daycare.slug,
        daycare.name,
        daycare.description,
        daycare.contact?.phone || null,
        daycare.contact?.email || null,
        daycare.contact?.website || null,
        daycare.location?.address || '',
        daycare.location?.city || 'San Francisco',
        daycare.location?.state || 'CA',
        daycare.location?.zip || '',
        daycare.location?.neighborhood || 'mission',
        daycare.location?.latitude || null,
        daycare.location?.longitude || null,
        daycare.license?.number || null,
        daycare.license?.status || 'active',
        daycare.license?.type || null,
        daycare.license?.capacity || null,
        daycare.program?.ageGroups || ['infant', 'toddler', 'preschool'],
        daycare.program?.languages || ['English'],
        daycare.pricing?.infantMonthly || null,
        daycare.pricing?.toddlerMonthly || null,
        daycare.pricing?.preschoolMonthly || null,
        daycare.features || [],
        daycare.verified || false
      ]);
    }
    console.log(`✅ Inserted ${daycaresData.length} daycares\n`);

    // Step 4: Verify
    console.log('📋 Step 4: Verifying setup...');
    const neighborhoodCount = await client.query('SELECT COUNT(*) FROM neighborhoods');
    const daycareCount = await client.query('SELECT COUNT(*) FROM daycares');
    const reviewCount = await client.query('SELECT COUNT(*) FROM reviews');

    console.log('✅ Database setup complete!\n');
    console.log('📊 Final counts:');
    console.log(`   - Neighborhoods: ${neighborhoodCount.rows[0].count}`);
    console.log(`   - Daycares: ${daycareCount.rows[0].count}`);
    console.log(`   - Reviews: ${reviewCount.rows[0].count}`);
    console.log('');
    console.log('🎉 Your database is ready to use!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setup().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
