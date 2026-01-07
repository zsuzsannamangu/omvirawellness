// src/db.ts
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // still encrypted, but skips cert chain validation
  },
});

// Handle connection errors gracefully
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Don't crash the server, just log the error
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your DATABASE_URL in .env file');
  }
});

module.exports = pool;

//Supabase enforces SSL in production.
//Their certs are self-signed, which throws errors locally.
//rejectUnauthorized: false is the recommended workaround, even for production (per Supabase docs).
//for stricter security in production, upgrade, ssl:true