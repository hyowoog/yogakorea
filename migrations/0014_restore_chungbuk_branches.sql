-- 0013에서 삭제한 충북 주소 요가원을 복원 (권역명은 충청권으로 통일)
-- 레거시 yoga_branch dump 기준

INSERT OR REPLACE INTO yoga_branches (
  id, y_part, y_type, y_name, y_ceo, y_zipcode, y_addr, y_hp, y_phone, y_reg_date,
  y_email, y_homepage, y_yn, y_area_dscd, y_retire_date, y_pay, y_etc, y_etc2
) VALUES (
  56, '', '지도자교육기관, 전', '담마샨티요가', '이현정', 28120,
  '충북 청주시 청원구 오창읍 중심상업로 7, 401호(오창프라자 4층)', '010-4775-5357', '043-215-7455', '2009-02-04',
  'dammashanti@naver.com', 'https://blog.naver.com/dammashanti', 'N', '충청권', '', '',
  '구. 빠딴잘리요가원(오창)
22.08.09 담마샨티요가로 변경', '교-28, 요-30'
);

INSERT OR REPLACE INTO yoga_branches (
  id, y_part, y_type, y_name, y_ceo, y_zipcode, y_addr, y_hp, y_phone, y_reg_date,
  y_email, y_homepage, y_yn, y_area_dscd, y_retire_date, y_pay, y_etc, y_etc2
) VALUES (
  57, '', '전국요가원', '빠딴잘리요가원(제천)', '박혜림(박다유)', 27173,
  '충북 제천시 의림대로 116 (중앙로1가) 뱅뱅 옆건물 2층', '010-5436-8226', '043-652-7454', '2010-12-28',
  'haha7951@hanmail.net', 'http://blog.naver.com/hyerim7951', 'N', '충청권', '', '',
  '2017.01.01 기준으로 원장님 최은경-> 박혜림으로 변경', '요-50'
);

INSERT OR REPLACE INTO yoga_branches (
  id, y_part, y_type, y_name, y_ceo, y_zipcode, y_addr, y_hp, y_phone, y_reg_date,
  y_email, y_homepage, y_yn, y_area_dscd, y_retire_date, y_pay, y_etc, y_etc2
) VALUES (
  67, '', '전국요가원', '사비타 빠딴잘리요가원', '윤재순', 27833,
  '충북 진천군 진천읍 중앙북로 50-2, 2층', '010-8828-6436', '043-537-7456', '2012-04-17',
  'dhckddyrk2@hanmail.net', 'http://cafe.daum.net/patanjaliyoga', 'N', '충청권', '', '2012.04.17 - 500,000완납',
  '', '요-58'
);

INSERT OR REPLACE INTO yoga_branches (
  id, y_part, y_type, y_name, y_ceo, y_zipcode, y_addr, y_hp, y_phone, y_reg_date,
  y_email, y_homepage, y_yn, y_area_dscd, y_retire_date, y_pay, y_etc, y_etc2
) VALUES (
  131, '', '지도자교육기관, 전', '샨티푸르나 요가', '윤근영', 28800,
  '충북 청주시 서원구 1순환로1107번길 28 (분평동, 명인원플러스) 303호', '010-5439-9816', '043-293-7455', '2018-11-05',
  'cutesoy59@naver.com', '', 'N', '충청권', '', '2018.11.05 50만원 완납',
  '', '요-102,교-62'
);

INSERT OR REPLACE INTO yoga_branches (
  id, y_part, y_type, y_name, y_ceo, y_zipcode, y_addr, y_hp, y_phone, y_reg_date,
  y_email, y_homepage, y_yn, y_area_dscd, y_retire_date, y_pay, y_etc, y_etc2
) VALUES (
  141, '', '지도자교육기관, 전', '수카얌요가', '김미영', 28744,
  '충북 청주시 상당구 중고개로 334 (금천동, 의화빌딩) 4층', '010-4196-3076', '043-292-3076', '2021-04-02',
  'sukhayam3076@naver.com', '', 'Y', '충청권', '', '2021년 4월 2일 50만원 완납',
  '2022년 12월 9일 교육기관등록비 300만원 완납', '요-112,교-79'
);
