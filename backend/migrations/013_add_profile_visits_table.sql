-- Migration 013: Add profile visits tracking table

-- Create profile_visits table to track when users view provider profiles
CREATE TABLE IF NOT EXISTS profile_visits (
  id SERIAL PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for anonymous visitors
  visitor_ip VARCHAR(45), -- Store IP for anonymous tracking
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT, -- Optional: store user agent for analytics
  referrer TEXT, -- Optional: where did they come from
  CONSTRAINT fk_provider_visits FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- Create indexes for faster queries
CREATE INDEX idx_profile_visits_provider_id ON profile_visits(provider_id);
CREATE INDEX idx_profile_visits_visited_at ON profile_visits(visited_at);
CREATE INDEX idx_profile_visits_provider_date ON profile_visits(provider_id, visited_at);

-- Add comment
COMMENT ON TABLE profile_visits IS 'Tracks profile visits for providers to show traffic statistics';
