-- Remove yoga branches formerly in 충북권 (merged into 충청권 in 0012)
-- 레거시 목록과 건수를 맞추기 위해 삭제는 0014에서 복원함.
DELETE FROM yoga_branches
WHERE y_addr LIKE '충북%';
