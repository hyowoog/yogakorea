-- 레거시 renew/manage 데이터 테이블

CREATE TABLE IF NOT EXISTS yoga_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lic_id INTEGER UNIQUE,
  name TEXT,
  ename TEXT,
  birth TEXT,
  sex TEXT,
  member_dscd TEXT,
  lic_date TEXT,
  reg_date TEXT,
  retire_date TEXT,
  area_dscd TEXT,
  edu_loc TEXT,
  email TEXT,
  phone TEXT,
  hp TEXT,
  zipcode TEXT,
  addr TEXT,
  area_auth TEXT,
  login_id TEXT,
  login_pwd TEXT,
  edu_dscd TEXT,
  edu_auth TEXT,
  mem_auth TEXT,
  grade TEXT,
  jumin TEXT,
  etc TEXT,
  y_name TEXT,
  y_area TEXT
);

CREATE INDEX IF NOT EXISTS idx_yoga_members_lic_id ON yoga_members(lic_id);
CREATE INDEX IF NOT EXISTS idx_yoga_members_name ON yoga_members(name);
CREATE INDEX IF NOT EXISTS idx_yoga_members_reg_date ON yoga_members(reg_date);

CREATE TABLE IF NOT EXISTS yoga_payments (
  id INTEGER PRIMARY KEY,
  lic_id INTEGER NOT NULL,
  pay_date TEXT,
  pay_amount INTEGER,
  pay_yy TEXT,
  pay_etc TEXT
);

CREATE INDEX IF NOT EXISTS idx_yoga_payments_lic_id ON yoga_payments(lic_id);

CREATE TABLE IF NOT EXISTS yoga_branches (
  id INTEGER PRIMARY KEY,
  y_part TEXT,
  y_type TEXT,
  y_name TEXT,
  y_ceo TEXT,
  y_zipcode TEXT,
  y_addr TEXT,
  y_hp TEXT,
  y_phone TEXT,
  y_reg_date TEXT,
  y_email TEXT,
  y_homepage TEXT,
  y_yn TEXT,
  y_area_dscd TEXT,
  y_retire_date TEXT,
  y_pay TEXT,
  y_etc TEXT,
  y_etc2 TEXT
);

CREATE TABLE IF NOT EXISTS yoga_mem_grades (
  id INTEGER PRIMARY KEY,
  lic_id INTEGER,
  dscd TEXT,
  grade_type TEXT,
  grade_no TEXT,
  grade_txt TEXT,
  grade_edu_loc TEXT,
  name TEXT,
  jumin TEXT,
  hp TEXT,
  bas_date TEXT,
  chg_date TEXT,
  hour TEXT,
  gubun TEXT
);

CREATE INDEX IF NOT EXISTS idx_yoga_mem_grades_lic_id ON yoga_mem_grades(lic_id);

CREATE TABLE IF NOT EXISTS member_educations (
  id INTEGER PRIMARY KEY,
  lic_id INTEGER,
  dscd INTEGER,
  grade_type TEXT,
  grade_no TEXT,
  grade_txt TEXT,
  grade_edu_loc TEXT,
  name TEXT,
  jumin TEXT,
  hp TEXT,
  created TEXT,
  modified TEXT,
  hour TEXT,
  gubun TEXT
);

CREATE INDEX IF NOT EXISTS idx_member_educations_lic_id ON member_educations(lic_id);
CREATE INDEX IF NOT EXISTS idx_member_educations_dscd ON member_educations(dscd);

ALTER TABLE main_slides ADD COLUMN created_at TEXT;
