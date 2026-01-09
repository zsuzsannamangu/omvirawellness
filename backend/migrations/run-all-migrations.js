#!/usr/bin/env node
/**
 * Run all database migrations in order
 * This script will run all migrations from 001 to the latest
 * It handles errors gracefully and continues even if some migrations fail
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// List of migrations in order (excluding seed data and scripts)
const migrations = [
  '001_initial_schema.sql',
  '002_add_client_profile_fields.sql',
  '003_add_provider_profile_fields.sql',
  '004_fix_provider_profile_fields.sql',
  '005_add_provider_availability_jsonb.sql',
  '006_add_provider_add_ons.sql',
  '007_add_provider_certifications.sql',
  '008_make_service_id_nullable.sql',
  '009_add_provider_client_notes.sql',
  '010_add_space_owner_profile_fields.sql',
  '011_add_messages_table.sql',
  '012_add_message_user_metadata.sql',
  '013_add_profile_visits_table.sql',
  '014_add_oauth_provider_ids.sql',
  '014_add_subscription_data.sql',
  '014_add_two_factor_auth.sql',
  '015_increase_business_type_length.sql',
  '016_add_travel_fields.sql',
  '017_add_missing_provider_columns.sql'
];

async function runAllMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migrations...\n');
    console.log(`📊 Found ${migrations.length} migrations to run\n`);
    
    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    for (let i = 0; i < migrations.length; i++) {
      const migrationFile = migrations[i];
      const migrationPath = path.join(__dirname, migrationFile);
      
      // Check if file exists
      if (!fs.existsSync(migrationPath)) {
        console.log(`⏭️  [${i + 1}/${migrations.length}] ${migrationFile} - File not found, skipping`);
        results.skipped.push(migrationFile);
        continue;
      }

      try {
        console.log(`🔄 [${i + 1}/${migrations.length}] Running ${migrationFile}...`);
        
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Run the migration
        await client.query(migrationSQL);
        
        console.log(`✅ [${i + 1}/${migrations.length}] ${migrationFile} - Success\n`);
        results.success.push(migrationFile);
        
      } catch (error) {
        // Check if it's a "already exists" type error (which is usually fine)
        const errorMessage = error.message.toLowerCase();
        const isAlreadyExists = 
          errorMessage.includes('already exists') ||
          errorMessage.includes('duplicate') ||
          error.code === '42P07' || // duplicate_table
          error.code === '42710';   // duplicate_object
        
        if (isAlreadyExists) {
          console.log(`⚠️  [${i + 1}/${migrations.length}] ${migrationFile} - Already applied (skipping)\n`);
          results.skipped.push(migrationFile);
        } else {
          console.error(`❌ [${i + 1}/${migrations.length}] ${migrationFile} - Failed`);
          console.error(`   Error: ${error.message}`);
          console.error(`   Code: ${error.code || 'N/A'}\n`);
          results.failed.push({ file: migrationFile, error: error.message });
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${results.success.length}`);
    console.log(`⚠️  Skipped (already applied): ${results.skipped.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    
    if (results.success.length > 0) {
      console.log('\n✅ Successfully applied migrations:');
      results.success.forEach(file => console.log(`   - ${file}`));
    }
    
    if (results.skipped.length > 0) {
      console.log('\n⚠️  Skipped migrations (already exist):');
      results.skipped.forEach(file => console.log(`   - ${file}`));
    }
    
    if (results.failed.length > 0) {
      console.log('\n❌ Failed migrations:');
      results.failed.forEach(({ file, error }) => {
        console.log(`   - ${file}`);
        console.log(`     Error: ${error}`);
      });
      console.log('\n⚠️  Some migrations failed. Please review the errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All migrations completed successfully!');
    }

  } catch (error) {
    console.error('❌ Fatal error running migrations:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations
runAllMigrations().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
