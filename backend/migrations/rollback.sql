-- ============================================
-- ROLLBACK SCRIPT
-- ============================================
-- This script drops all tables created by 001_initial_schema.sql
-- WARNING: This will delete ALL data! Use with caution!
-- ============================================

-- Drop tables in reverse order of dependencies

DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS provider_space_bookings CASCADE;
DROP TABLE IF EXISTS client_provider_bookings CASCADE;
DROP TABLE IF EXISTS space_photos CASCADE;
DROP TABLE IF EXISTS space_availability CASCADE;
DROP TABLE IF EXISTS space_amenities CASCADE;
DROP TABLE IF EXISTS spaces CASCADE;
DROP TABLE IF EXISTS space_owner_profiles CASCADE;
DROP TABLE IF EXISTS provider_photos CASCADE;
DROP TABLE IF EXISTS provider_availability CASCADE;
DROP TABLE IF EXISTS provider_services CASCADE;
DROP TABLE IF EXISTS provider_profiles CASCADE;
DROP TABLE IF EXISTS client_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop extensions (optional - comment out if other apps use it)
-- DROP EXTENSION IF EXISTS "uuid-ossp";

SELECT 'Rollback completed - all tables dropped' AS status;

