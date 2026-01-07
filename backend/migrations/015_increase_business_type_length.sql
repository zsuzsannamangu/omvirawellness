-- Increase business_type column length to accommodate multiple categories
-- Multiple category IDs joined with commas can exceed 50 characters
ALTER TABLE provider_profiles 
  ALTER COLUMN business_type TYPE TEXT;
