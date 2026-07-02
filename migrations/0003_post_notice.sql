ALTER TABLE posts ADD COLUMN is_notice INTEGER NOT NULL DEFAULT 0;

-- g5_board.bo_notice (공지사항)
UPDATE posts
SET is_notice = 1
WHERE board_id = 'notice'
  AND legacy_id IN (366, 363, 357, 356, 355, 3, 20, 345, 288, 287, 286, 285, 278, 269, 268, 135, 4);

-- g5_board.bo_notice (포토앨범)
UPDATE posts
SET is_notice = 1
WHERE board_id = 'gallery'
  AND legacy_id = 63;
