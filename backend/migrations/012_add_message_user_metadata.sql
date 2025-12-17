-- Migration 012: Add per-user message metadata table
-- This allows each user to have their own starred/deleted/read status for messages

CREATE TABLE IF NOT EXISTS message_user_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Per-user message status
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one metadata record per user per message
  UNIQUE(message_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_message_user_metadata_message_id ON message_user_metadata(message_id);
CREATE INDEX idx_message_user_metadata_user_id ON message_user_metadata(user_id);
CREATE INDEX idx_message_user_metadata_is_read ON message_user_metadata(user_id, is_read);
CREATE INDEX idx_message_user_metadata_is_starred ON message_user_metadata(user_id, is_starred);
CREATE INDEX idx_message_user_metadata_is_deleted ON message_user_metadata(user_id, is_deleted);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_message_user_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_user_metadata_updated_at
  BEFORE UPDATE ON message_user_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_message_user_metadata_updated_at();

-- Migrate existing data: Create metadata records for existing messages
-- For each message, create metadata for both sender and recipient
INSERT INTO message_user_metadata (message_id, user_id, is_read, is_starred, is_deleted)
SELECT 
  m.id as message_id,
  m.sender_id as user_id,
  COALESCE(m.is_read, false) as is_read,
  COALESCE(m.is_starred, false) as is_starred,
  false as is_deleted  -- Don't migrate deleted status, start fresh
FROM messages m
WHERE NOT EXISTS (
  SELECT 1 FROM message_user_metadata mum 
  WHERE mum.message_id = m.id AND mum.user_id = m.sender_id
)
ON CONFLICT (message_id, user_id) DO NOTHING;

INSERT INTO message_user_metadata (message_id, user_id, is_read, is_starred, is_deleted)
SELECT 
  m.id as message_id,
  m.recipient_id as user_id,
  COALESCE(m.is_read, false) as is_read,
  COALESCE(m.is_starred, false) as is_starred,
  COALESCE(m.is_deleted, false) as is_deleted
FROM messages m
WHERE NOT EXISTS (
  SELECT 1 FROM message_user_metadata mum 
  WHERE mum.message_id = m.id AND mum.user_id = m.recipient_id
)
ON CONFLICT (message_id, user_id) DO NOTHING;

-- Add comment
COMMENT ON TABLE message_user_metadata IS 'Per-user metadata for messages (read, starred, deleted status)';
