-- Migration 014: Add subscription_data column to provider_profiles
-- This stores subscription plan, billing cycle, price, and next payment date

ALTER TABLE provider_profiles 
ADD COLUMN IF NOT EXISTS subscription_data JSONB;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_provider_profiles_subscription_data 
ON provider_profiles USING GIN (subscription_data);

-- Add comment
COMMENT ON COLUMN provider_profiles.subscription_data IS 'Stores subscription information: plan, billingCycle, price, nextPaymentDate';

