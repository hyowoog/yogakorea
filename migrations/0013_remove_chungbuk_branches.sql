-- Remove yoga branches formerly in 충북권 (merged into 충청권 in 0012)
DELETE FROM yoga_branches
WHERE y_addr LIKE '충북%';
