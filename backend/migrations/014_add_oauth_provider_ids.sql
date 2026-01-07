-- Add OAuth provider ID columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255) UNIQUE;

-- Create indexes for OAuth provider lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_facebook_id ON users(facebook_id);

-- Make password_hash nullable for OAuth users (they don't have passwords)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
