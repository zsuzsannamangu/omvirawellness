-- Add additional fields to provider_profiles table
ALTER TABLE provider_profiles
  ADD COLUMN IF NOT EXISTS work_location TEXT,
  ADD COLUMN IF NOT EXISTS services TEXT,
  ADD COLUMN IF NOT EXISTS travel_policy TEXT,
  ADD COLUMN IF NOT EXISTS travel_fee DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_distance INTEGER DEFAULT 15;
