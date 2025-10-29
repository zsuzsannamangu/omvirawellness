-- Add availability JSONB column to provider_profiles
ALTER TABLE provider_profiles
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '[]'::JSONB;

