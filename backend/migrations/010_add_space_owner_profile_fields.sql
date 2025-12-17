-- Migration: Add missing fields to space_owner_profiles table
-- This adds fields that are needed for the space owner dashboard profile editing

ALTER TABLE space_owner_profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255),
ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(50),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Add index for city/state lookups if needed
CREATE INDEX IF NOT EXISTS idx_space_owner_profiles_city_state ON space_owner_profiles(city, state);
