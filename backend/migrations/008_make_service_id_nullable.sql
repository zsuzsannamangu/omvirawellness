-- Make service_id nullable in client_provider_bookings
-- Services are stored as JSONB in provider_profiles.services, not in provider_services table
-- First drop the foreign key constraint, then make it nullable
ALTER TABLE client_provider_bookings
DROP CONSTRAINT IF EXISTS client_provider_bookings_service_id_fkey;

ALTER TABLE client_provider_bookings
ALTER COLUMN service_id DROP NOT NULL;

