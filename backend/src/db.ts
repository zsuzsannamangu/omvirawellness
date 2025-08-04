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

module.exports = pool;

//Supabase enforces SSL in production.
//Their certs are self-signed, which throws errors locally.
//rejectUnauthorized: false is the recommended workaround, even for production (per Supabase docs).
//for stricter security in production, upgrade, ssl:true