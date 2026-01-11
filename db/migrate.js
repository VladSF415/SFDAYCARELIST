// Database Migration Script for SF Daycare List
// Run this to create all tables and functions

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

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting database migration...');

    // Read schema file
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

    // Execute schema
    await client.query(schema);

    console.log('✅ Database migration completed successfully!');
    console.log('');
    console.log('Tables created:');
    console.log('  - neighborhoods');
    console.log('  - daycares');
    console.log('  - reviews');
    console.log('  - analytics');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Run seed script: node db/seed.js');
    console.log('  2. Start the server: npm start');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrate().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
