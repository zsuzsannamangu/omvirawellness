-- Add client_notes JSONB column to provider_profiles
-- This will store notes about clients in the format: { client_profile_id: { note: "text", created_at: "timestamp", updated_at: "timestamp" } }
ALTER TABLE provider_profiles
ADD COLUMN IF NOT EXISTS client_notes JSONB DEFAULT '{}'::JSONB;

