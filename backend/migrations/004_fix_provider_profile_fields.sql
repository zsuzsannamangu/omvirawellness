-- Fix provider_profile fields - change work_location and services from TEXT to JSONB
ALTER TABLE provider_profiles
  DROP COLUMN IF EXISTS work_location,
  DROP COLUMN IF EXISTS services;

ALTER TABLE provider_profiles
  ADD COLUMN IF NOT EXISTS work_location JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS specialties TEXT,
  ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::JSONB;

