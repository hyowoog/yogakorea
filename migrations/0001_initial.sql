-- 게시판 설정
CREATE TABLE IF NOT EXISTS boards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  board_type TEXT NOT NULL DEFAULT 'list',
  list_count INTEGER NOT NULL DEFAULT 15,
  allow_reply INTEGER NOT NULL DEFAULT 1,
  min_level INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'renew'
);

-- 통합 게시글
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id TEXT NOT NULL,
  parent_id INTEGER,
  depth INTEGER NOT NULL DEFAULT 0,
  sort_order REAL NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  content TEXT,
  author_name TEXT,
  author_email TEXT,
  password TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  legacy_id INTEGER,
  legacy_table TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (board_id) REFERENCES boards(id)
);

CREATE INDEX IF NOT EXISTS idx_posts_board ON posts(board_id, sort_order DESC);
CREATE INDEX IF NOT EXISTS idx_posts_legacy ON posts(legacy_table, legacy_id);

-- 댓글
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  parent_id INTEGER,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

-- 첨부파일 (R2)
CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  r2_key TEXT NOT NULL,
  mime_type TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE INDEX IF NOT EXISTS idx_attachments_post ON attachments(post_id);

-- 메인 슬라이드
CREATE TABLE IF NOT EXISTS main_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_path TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 리뉴얼 게시판 기본 설정
INSERT OR IGNORE INTO boards (id, title, board_type, list_count, allow_reply, min_level, source) VALUES
  ('notice', '공지사항', 'list', 15, 1, 0, 'renew'),
  ('news', '권역별 소식', 'list', 15, 1, 0, 'renew'),
  ('job', '구인구직', 'list', 15, 1, 0, 'renew'),
  ('bbs', '회원게시판', 'list', 15, 1, 0, 'renew'),
  ('photo', '포토앨범', 'gallery', 15, 1, 0, 'renew'),
  ('qna', '묻고답하기', 'qna', 15, 1, 0, 'renew'),
  ('free', '자유게시판', 'list', 15, 1, 0, 'renew');

-- 그누보드 게시판
INSERT OR IGNORE INTO boards (id, title, board_type, list_count, allow_reply, min_level, source) VALUES
  ('g5_notice', '공지사항 (구)', 'list', 15, 1, 0, 'gnuboard'),
  ('g5_webzine', '웹진', 'list', 15, 1, 0, 'gnuboard'),
  ('g5_gallery', '갤러리', 'gallery', 15, 1, 0, 'gnuboard'),
  ('g5_fieldnews', '권역별소식 (구)', 'list', 15, 1, 0, 'gnuboard'),
  ('g5_qna', 'Q&A (구)', 'qna', 15, 1, 0, 'gnuboard');
