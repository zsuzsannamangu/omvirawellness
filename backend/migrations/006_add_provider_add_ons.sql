-- Add add_ons JSONB column to provider_profiles table
ALTER TABLE provider_profiles
ADD COLUMN IF NOT EXISTS add_ons JSONB DEFAULT '[]'::JSONB;

