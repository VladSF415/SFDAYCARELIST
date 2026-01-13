#!/usr/bin/env node
// Reseed production database with all daycares from data/daycares.json
// Run this with: railway run node scripts/reseed-production.mjs

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function reseedProduction() {
  console.log('🌱 Reseeding production database...\n');

  const client = await pool.connect();

  try {
    // Load JSON data
    const daycaresPath = join(__dirname, '..', 'data', 'daycares.json');
    console.log(`📂 Loading daycares from: ${daycaresPath}`);

    const daycaresData = JSON.parse(readFileSync(daycaresPath, 'utf-8'));
    console.log(`✅ Loaded ${daycaresData.length} daycares\n`);

    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    console.log('💾 Inserting/updating daycares...\n');

    for (const d of daycaresData) {
      try {
        // Check if daycare exists
        const existingResult = await client.query(
          'SELECT id FROM daycares WHERE slug = $1',
          [d.slug || d.id]
        );

        const isUpdate = existingResult.rows.length > 0;

        // Insert or update
        await client.query(
          `INSERT INTO daycares (
            slug, name, description,
            contact_phone, contact_email, contact_website,
            location_address, location_city, location_state, location_zip,
            location_neighborhood, location_latitude, location_longitude,
            location_public_transit,
            license_number, license_status, license_type, license_capacity,
            license_data_source,
            program_age_groups, program_ages_min_months, program_ages_max_years,
            program_languages, program_curriculum,
            hours,
            pricing_infant_monthly, pricing_toddler_monthly, pricing_preschool_monthly,
            ratings_overall, ratings_review_count,
            verified, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            contact_phone = EXCLUDED.contact_phone,
            contact_email = EXCLUDED.contact_email,
            contact_website = EXCLUDED.contact_website,
            location_address = EXCLUDED.location_address,
            location_city = EXCLUDED.location_city,
            location_state = EXCLUDED.location_state,
            location_zip = EXCLUDED.location_zip,
            location_neighborhood = EXCLUDED.location_neighborhood,
            location_latitude = EXCLUDED.location_latitude,
            location_longitude = EXCLUDED.location_longitude,
            ratings_overall = EXCLUDED.ratings_overall,
            ratings_review_count = EXCLUDED.ratings_review_count,
            updated_at = EXCLUDED.updated_at`,
          [
            d.slug || d.id,
            d.name,
            d.description || '',
            d.contact?.phone || '',
            d.contact?.email || '',
            d.contact?.website || '',
            d.location?.street || d.location?.address || '',
            d.location?.city || 'San Francisco',
            d.location?.state || 'CA',
            d.location?.zip || '',
            d.location?.neighborhood || '',
            d.location?.latitude || 37.7749,
            d.location?.longitude || -122.4194,
            JSON.stringify(d.location?.public_transit || []),
            d.licensing?.license_number || '',
            d.licensing?.status || 'Licensed',
            d.licensing?.type || 'Child Care Center',
            d.licensing?.capacity || 0,
            d.licensing?.data_source || 'Google Places',
            d.program?.age_groups || ['infant', 'toddler', 'preschool'],
            d.program?.ages_min_months || 0,
            d.program?.ages_max_years || 5,
            d.program?.languages || ['English'],
            d.program?.curriculum || '',
            JSON.stringify(d.hours || {}),
            d.pricing?.infant_monthly || null,
            d.pricing?.toddler_monthly || null,
            d.pricing?.preschool_monthly || null,
            d.ratings?.overall || d.ratings?.google_rating || 0,
            d.ratings?.review_count || d.ratings?.google_review_count || 0,
            d.verified || false,
            d.created_at || new Date().toISOString(),
            new Date().toISOString()
          ]
        );

        if (isUpdate) {
          updatedCount++;
        } else {
          insertedCount++;
        }

        // Progress indicator
        if ((insertedCount + updatedCount) % 50 === 0) {
          console.log(`   Progress: ${insertedCount + updatedCount}/${daycaresData.length}`);
        }

      } catch (error) {
        errorCount++;
        console.error(`   ❌ Error with ${d.name}:`, error.message);
      }
    }

    console.log('\n════════════════════════════════════════');
    console.log('✅ Database reseed complete!');
    console.log('════════════════════════════════════════');
    console.log(`   Inserted: ${insertedCount}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${daycaresData.length}`);
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Fatal error during reseed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

reseedProduction()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
