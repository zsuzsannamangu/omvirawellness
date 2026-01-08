-- Add missing columns to provider_profiles table
-- This migration combines migrations 006 and 007 which may not have been run
ALTER TABLE provider_profiles
  ADD COLUMN IF NOT EXISTS add_ons JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::JSONB;
