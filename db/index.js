// Database Connection Pool for SF Daycare List
import pg from 'pg';

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log connection status
pool.on('connect', () => {
  console.log('✅ New database client connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Query helper with error handling
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`⚠️  Slow query (${duration}ms):`, text.substring(0, 100));
    }

    return res;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
}

// Get a client from the pool for transactions
export async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Add query tracking
  const timeout = setTimeout(() => {
    console.error('⚠️  Client has been checked out for more than 5 seconds!');
  }, 5000);

  // Override release to clear timeout
  client.release = () => {
    clearTimeout(timeout);
    client.query = originalQuery;
    client.release = originalRelease;
    return client.release();
  };

  return client;
}

// Health check
export async function healthCheck() {
  try {
    const result = await query('SELECT NOW()');
    return { healthy: true, timestamp: result.rows[0].now };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
}

// Graceful shutdown
export async function close() {
  await pool.end();
  console.log('🔌 Database pool closed');
}

// Export pool for direct access if needed
export { pool };

export default {
  query,
  getClient,
  healthCheck,
  close,
  pool
};
