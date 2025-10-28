-- Add missing fields to client_profiles table

ALTER TABLE client_profiles
ADD COLUMN IF NOT EXISTS pronoun VARCHAR(20),
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(50),
ADD COLUMN IF NOT EXISTS wellness_goals TEXT[],
ADD COLUMN IF NOT EXISTS other_goals TEXT,
ADD COLUMN IF NOT EXISTS preferred_session_length VARCHAR(50),
ADD COLUMN IF NOT EXISTS preferred_frequency VARCHAR(50),
ADD COLUMN IF NOT EXISTS budget_per_session VARCHAR(50),
ADD COLUMN IF NOT EXISTS location_preference VARCHAR(50),
ADD COLUMN IF NOT EXISTS time_preference VARCHAR(50),
ADD COLUMN IF NOT EXISTS special_requirements TEXT,
ADD COLUMN IF NOT EXISTS travel_willingness BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS max_travel_distance INTEGER;

