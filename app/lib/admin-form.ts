/** Radix Select는 빈 문자열 value를 허용하지 않아 필터 '전체' 옵션에 사용 */
export const ADMIN_SELECT_ALL = "__all__";

export function fromAdminSelectValue(value: string | null | undefined) {
  if (!value || value === ADMIN_SELECT_ALL) return undefined;
  return value;
}

export function toAdminSelectValue(value: string | undefined) {
  return value && value.length > 0 ? value : ADMIN_SELECT_ALL;
}
