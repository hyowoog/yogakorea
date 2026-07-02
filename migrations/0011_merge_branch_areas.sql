-- 수도권, 강원권 → 경기강원권 통합
UPDATE yoga_branches
SET y_area_dscd = '경기강원권'
WHERE y_area_dscd IN ('수도권', '강원권');
