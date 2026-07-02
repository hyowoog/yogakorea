ALTER TABLE comments ADD COLUMN member_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_comments_member ON comments(member_id);
