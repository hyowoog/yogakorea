-- 서울수도권 → 서울인천권
UPDATE yoga_branches
SET y_area_dscd = '서울인천권'
WHERE y_area_dscd = '서울수도권';

-- 대전충남권, 충북권 → 충청권
UPDATE yoga_branches
SET y_area_dscd = '충청권'
WHERE y_area_dscd IN ('대전충남권', '충북권');
