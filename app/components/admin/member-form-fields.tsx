import { useEffect, useRef, type ReactNode } from "react";
import { AdminSelect } from "~/components/admin/admin-select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  formatDaumAddress,
  loadDaumPostcode,
  openDaumPostcode,
} from "~/lib/daum-postcode";
import { cn } from "~/lib/utils";
import type { YogaMember } from "~/lib/yoga-member.server";

const MEMBER_DSCD_OPTIONS = ["일반회원", "정회원", "준회원", "탈퇴회원"].map((value) => ({
  value,
  label: value,
}));

const EDU_AUTH_OPTIONS = [
  { value: "1", label: "일반회원" },
  { value: "2", label: "기관장" },
];

const AREA_AUTH_OPTIONS = [
  { value: "1", label: "일반회원" },
  { value: "2", label: "권역장" },
];

/** 레거시 값 0·빈 값·NULL은 일반회원(1)으로 취급 */
function normalizeAuth(value: string | null | undefined) {
  return value === "2" ? "2" : "1";
}

interface MemberFormFieldsProps {
  member?: YogaMember | null;
  disabled?: boolean;
  idPrefix?: string;
}

interface MemberFormFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

/** 레거시 데이터에 이스케이프된 \\r\\n 문자열이 들어 있는 경우 실제 줄바꿈으로 변환 */
function decodeLineBreaks(value: string | null | undefined) {
  if (!value) return "";
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n");
}

function MemberFormField({ label, htmlFor, className, children }: MemberFormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-medium text-sky-700" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function MemberFormFields({
  member,
  disabled = false,
  idPrefix = "member",
}: MemberFormFieldsProps) {
  const zipcodeRef = useRef<HTMLInputElement>(null);
  const addrRef = useRef<HTMLInputElement>(null);
  const postcodeOpenRef = useRef(false);

  function fieldId(name: string) {
    return `${idPrefix}-${name}`;
  }

  // 포커스 시 팝업이 바로 열리도록 스크립트를 미리 불러옴
  useEffect(() => {
    loadDaumPostcode().catch(() => {});
  }, []);

  function openPostcode() {
    if (disabled || postcodeOpenRef.current) return;
    postcodeOpenRef.current = true;

    openDaumPostcode({
      oncomplete: (data) => {
        if (zipcodeRef.current) zipcodeRef.current.value = data.zonecode;
        const addr = addrRef.current;
        if (addr) {
          addr.value = `${formatDaumAddress(data)} `;
          addr.focus();
          addr.setSelectionRange(addr.value.length, addr.value.length);
        }
      },
      onclose: (state) => {
        postcodeOpenRef.current = false;
        // 선택 없이 닫으면 창 복귀 시 다시 포커스되어 팝업이 반복해 열리지 않게 함
        if (state === "FORCE_CLOSE") zipcodeRef.current?.blur();
      },
    }).catch(() => {
      postcodeOpenRef.current = false;
    });
  }

  return (
    <>
      <MemberFormField label="이름" htmlFor={fieldId("name")}>
        <Input
          id={fieldId("name")}
          name="name"
          defaultValue={member?.name ?? ""}
          required
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="영문이름" htmlFor={fieldId("ename")}>
        <Input
          id={fieldId("ename")}
          name="ename"
          defaultValue={member?.ename ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="급수" htmlFor={fieldId("grade")}>
        <Input
          id={fieldId("grade")}
          name="grade"
          defaultValue={member?.grade ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="회원구분" htmlFor={fieldId("memberDscd")}>
        <AdminSelect
          name="memberDscd"
          defaultValue={member?.member_dscd || undefined}
          options={MEMBER_DSCD_OPTIONS}
        />
      </MemberFormField>
      <MemberFormField label="생년월일" htmlFor={fieldId("birth")}>
        <Input
          id={fieldId("birth")}
          name="birth"
          defaultValue={member?.birth ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="성별" htmlFor={fieldId("sex")}>
        <Input
          id={fieldId("sex")}
          name="sex"
          defaultValue={member?.sex ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="자격취득일" htmlFor={fieldId("licDate")}>
        <Input
          id={fieldId("licDate")}
          name="licDate"
          defaultValue={member?.lic_date ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="입회일" htmlFor={fieldId("regDate")}>
        <Input
          id={fieldId("regDate")}
          name="regDate"
          defaultValue={member?.reg_date ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="탈퇴일" htmlFor={fieldId("retireDate")}>
        <Input
          id={fieldId("retireDate")}
          name="retireDate"
          defaultValue={member?.retire_date ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="권역구분" htmlFor={fieldId("areaDscd")}>
        <Input
          id={fieldId("areaDscd")}
          name="areaDscd"
          defaultValue={member?.area_dscd ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="교육기관" htmlFor={fieldId("eduLoc")}>
        <Input
          id={fieldId("eduLoc")}
          name="eduLoc"
          defaultValue={member?.edu_loc ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="요가원" htmlFor={fieldId("yName")}>
        <Input
          id={fieldId("yName")}
          name="yName"
          defaultValue={member?.y_name ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="요가원권역" htmlFor={fieldId("yArea")}>
        <Input
          id={fieldId("yArea")}
          name="yArea"
          defaultValue={member?.y_area ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="휴대전화" htmlFor={fieldId("hp")}>
        <Input
          id={fieldId("hp")}
          name="hp"
          defaultValue={member?.hp ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="전화번호" htmlFor={fieldId("phone")}>
        <Input
          id={fieldId("phone")}
          name="phone"
          defaultValue={member?.phone ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="이메일" htmlFor={fieldId("email")}>
        <Input
          id={fieldId("email")}
          name="email"
          type="email"
          defaultValue={member?.email ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="로그인 ID" htmlFor={fieldId("loginId")}>
        <Input
          id={fieldId("loginId")}
          name="loginId"
          defaultValue={member?.login_id ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="비밀번호" htmlFor={fieldId("loginPwd")}>
        <Input
          id={fieldId("loginPwd")}
          name="loginPwd"
          type="password"
          defaultValue={member?.login_pwd ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="우편번호" htmlFor={fieldId("zipcode")}>
        <Input
          ref={zipcodeRef}
          id={fieldId("zipcode")}
          name="zipcode"
          defaultValue={member?.zipcode ?? ""}
          placeholder="클릭하여 주소 검색"
          disabled={disabled}
          onFocus={openPostcode}
          onClick={openPostcode}
        />
      </MemberFormField>
      <MemberFormField
        label="주소"
        htmlFor={fieldId("addr")}
        className="md:col-span-2"
      >
        <Input
          ref={addrRef}
          id={fieldId("addr")}
          name="addr"
          defaultValue={member?.addr ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="기관권한" htmlFor={fieldId("eduAuth")}>
        <AdminSelect
          name="eduAuth"
          defaultValue={normalizeAuth(member?.edu_auth)}
          options={EDU_AUTH_OPTIONS}
        />
      </MemberFormField>
      <MemberFormField label="권역권한" htmlFor={fieldId("areaAuth")}>
        <AdminSelect
          name="areaAuth"
          defaultValue={normalizeAuth(member?.area_auth)}
          options={AREA_AUTH_OPTIONS}
        />
      </MemberFormField>
      <MemberFormField
        label="비고"
        htmlFor={fieldId("etc")}
        className="md:col-span-3"
      >
        <Textarea
          id={fieldId("etc")}
          name="etc"
          defaultValue={decodeLineBreaks(member?.etc)}
          disabled={disabled}
        />
      </MemberFormField>
    </>
  );
}
