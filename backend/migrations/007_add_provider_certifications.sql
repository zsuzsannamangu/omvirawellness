-- Add certifications JSONB column to provider_profiles table
ALTER TABLE provider_profiles
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::JSONB;

