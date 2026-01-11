// Seed Database with Initial Data
// Migrates data from JSON files to Postgres

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

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seed...');

    // Load JSON data
    const neighborhoodsData = JSON.parse(
      readFileSync(join(__dirname, '..', 'data', 'neighborhoods.json'), 'utf-8')
    );
    const daycaresData = JSON.parse(
      readFileSync(join(__dirname, '..', 'data', 'daycares.json'), 'utf-8')
    );

    // Insert neighborhoods first (referenced by daycares)
    console.log(`\n📍 Inserting ${neighborhoodsData.length} neighborhoods...`);

    for (const n of neighborhoodsData) {
      await client.query(
        `INSERT INTO neighborhoods (
          slug, name, description, daycare_count,
          center_lat, center_lng, zip_codes, nearby_neighborhoods,
          bart_stations, parks, meta_title, meta_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          daycare_count = EXCLUDED.daycare_count,
          center_lat = EXCLUDED.center_lat,
          center_lng = EXCLUDED.center_lng,
          zip_codes = EXCLUDED.zip_codes,
          nearby_neighborhoods = EXCLUDED.nearby_neighborhoods,
          bart_stations = EXCLUDED.bart_stations,
          parks = EXCLUDED.parks,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description`,
        [
          n.slug,
          n.name,
          n.description,
          n.daycare_count || 0,
          n.center_lat,
          n.center_lng,
          n.zip_codes || [],
          n.nearby_neighborhoods || [],
          n.bart_stations || [],
          n.parks || [],
          n.seo?.meta_title || n.name,
          n.seo?.meta_description || n.description
        ]
      );
    }

    console.log('✅ Neighborhoods inserted');

    // Insert daycares
    console.log(`\n🏫 Inserting ${daycaresData.length} daycares...`);

    for (const d of daycaresData) {
      await client.query(
        `INSERT INTO daycares (
          slug, name, description,
          contact_phone, contact_email, contact_website,
          location_address, location_city, location_state, location_zip,
          location_neighborhood, location_latitude, location_longitude,
          location_public_transit,
          license_number, license_status, license_type, license_capacity,
          license_issued_date, license_expiration_date, license_last_inspection,
          license_inspection_score, license_violations, license_data_source,
          program_age_groups, program_ages_min_months, program_ages_max_years,
          program_languages, program_curriculum, program_special_programs,
          availability_accepting_enrollment, availability_infant_spots,
          availability_toddler_spots, availability_preschool_spots,
          availability_waitlist_available, availability_last_updated,
          hours,
          pricing_infant_monthly, pricing_toddler_monthly, pricing_preschool_monthly,
          pricing_part_time_available, pricing_financial_aid, pricing_accepts_subsidy,
          features,
          ratings_overall, ratings_safety, ratings_education, ratings_staff,
          ratings_facilities, ratings_nutrition, ratings_review_count,
          ratings_verified_reviews,
          premium_is_premium, premium_tier, premium_featured_until,
          verified, claimed_by_owner, owner_email,
          meta_title, meta_description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
          $51, $52, $53, $54, $55, $56, $57, $58
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          contact_phone = EXCLUDED.contact_phone,
          contact_email = EXCLUDED.contact_email,
          contact_website = EXCLUDED.contact_website,
          location_address = EXCLUDED.location_address,
          availability_accepting_enrollment = EXCLUDED.availability_accepting_enrollment,
          availability_infant_spots = EXCLUDED.availability_infant_spots,
          availability_toddler_spots = EXCLUDED.availability_toddler_spots,
          availability_preschool_spots = EXCLUDED.availability_preschool_spots,
          availability_last_updated = EXCLUDED.availability_last_updated`,
        [
          d.slug,
          d.name,
          d.description,
          d.contact.phone,
          d.contact.email,
          d.contact.website,
          d.location.address,
          d.location.city,
          d.location.state,
          d.location.zip,
          d.location.neighborhood,
          d.location.latitude,
          d.location.longitude,
          d.location.public_transit || [],
          d.licensing.license_number,
          d.licensing.status,
          d.licensing.type,
          d.licensing.capacity,
          d.licensing.issued_date,
          d.licensing.expiration_date,
          d.licensing.last_inspection,
          d.licensing.inspection_score,
          d.licensing.violations || [],
          d.licensing.data_source,
          d.program.age_groups || [],
          d.program.ages_min_months,
          d.program.ages_max_years,
          d.program.languages || ['English'],
          d.program.curriculum,
          d.program.special_programs || [],
          d.availability.accepting_enrollment,
          d.availability.infant_spots || 0,
          d.availability.toddler_spots || 0,
          d.availability.preschool_spots || 0,
          d.availability.waitlist_available,
          d.availability.last_updated,
          JSON.stringify(d.hours),
          d.pricing.infant_monthly || null,
          d.pricing.toddler_monthly || null,
          d.pricing.preschool_monthly || null,
          d.pricing.part_time_available || false,
          d.pricing.financial_aid || false,
          d.pricing.accepts_subsidy || [],
          d.features || [],
          d.ratings.overall,
          d.ratings.safety,
          d.ratings.education,
          d.ratings.staff,
          d.ratings.facilities,
          d.ratings.nutrition,
          d.ratings.review_count,
          d.ratings.verified_reviews,
          d.premium?.is_premium || false,
          d.premium?.tier || null,
          d.premium?.featured_until || null,
          d.verified || false,
          d.claimed_by_owner || false,
          d.owner_email || null,
          d.seo?.meta_title || `${d.name} - SF Daycare List`,
          d.seo?.meta_description || d.description.substring(0, 160)
        ]
      );
    }

    console.log('✅ Daycares inserted');

    // Get final counts
    const neighborhoodCount = await client.query('SELECT COUNT(*) FROM neighborhoods');
    const daycareCount = await client.query('SELECT COUNT(*) FROM daycares');

    console.log('\n📊 Database Summary:');
    console.log(`  Neighborhoods: ${neighborhoodCount.rows[0].count}`);
    console.log(`  Daycares: ${daycareCount.rows[0].count}`);
    console.log('\n✅ Seed completed successfully!');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seed
seed().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
