-- Add travel-related fields to provider_profiles table
-- These fields should have been added in migration 003, but adding them here
-- to ensure they exist (idempotent migration)
ALTER TABLE provider_profiles
  ADD COLUMN IF NOT EXISTS travel_policy TEXT,
  ADD COLUMN IF NOT EXISTS travel_fee DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_distance INTEGER DEFAULT 15;
