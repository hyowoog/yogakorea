-- 메인 사이트(public_html/Eyoom) 게시판으로 전환
DELETE FROM boards WHERE source = 'renew';

INSERT OR REPLACE INTO boards (id, title, board_type, list_count, allow_reply, min_level, source) VALUES
  ('notice', '공지사항', 'list', 15, 1, 0, 'gnuboard'),
  ('fieldnews', '권역별소식', 'list', 15, 1, 0, 'gnuboard'),
  ('job', '구인구직', 'list', 15, 1, 0, 'gnuboard'),
  ('member', '회원게시판', 'list', 15, 1, 0, 'gnuboard'),
  ('gallery', '포토앨범', 'gallery', 15, 1, 0, 'gnuboard'),
  ('qna', '묻고 답하기', 'qna', 15, 1, 0, 'gnuboard'),
  ('free2', '자유게시판', 'list', 15, 1, 0, 'gnuboard'),
  ('headroom', '본부자료실', 'list', 15, 1, 0, 'gnuboard'),
  ('photoroom', '사진자료실', 'gallery', 15, 1, 0, 'gnuboard'),
  ('videoroom', '교육동영상', 'gallery', 15, 1, 0, 'gnuboard'),
  ('webzine', '회보자료실', 'list', 15, 1, 0, 'gnuboard'),
  ('branch', '전국요가원', 'list', 15, 1, 0, 'gnuboard'),
  ('brbr', '빠람빠라', 'gallery', 15, 1, 0, 'gnuboard');

INSERT OR IGNORE INTO main_slides (image_path, caption, sort_order, is_active) VALUES
  ('/site-assets/eyoom/theme/basic2/image/banner_slider/banner_slider_1.jpg', '한국요가연합회', 1, 1),
  ('/site-assets/eyoom/theme/basic2/image/banner_slider/banner_slider_3.jpg', 'NOTICE', 2, 1);
