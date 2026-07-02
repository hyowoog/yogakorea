import type { ReactNode } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { YogaMember } from "~/lib/yoga-member.server";

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
  function fieldId(name: string) {
    return `${idPrefix}-${name}`;
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
        <Input
          id={fieldId("memberDscd")}
          name="memberDscd"
          defaultValue={member?.member_dscd ?? ""}
          disabled={disabled}
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
          id={fieldId("zipcode")}
          name="zipcode"
          defaultValue={member?.zipcode ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField
        label="주소"
        htmlFor={fieldId("addr")}
        className="md:col-span-2"
      >
        <Input
          id={fieldId("addr")}
          name="addr"
          defaultValue={member?.addr ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="기관권한" htmlFor={fieldId("eduAuth")}>
        <Input
          id={fieldId("eduAuth")}
          name="eduAuth"
          defaultValue={member?.edu_auth ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
      <MemberFormField label="권역권한" htmlFor={fieldId("areaAuth")}>
        <Input
          id={fieldId("areaAuth")}
          name="areaAuth"
          defaultValue={member?.area_auth ?? ""}
          disabled={disabled}
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
          defaultValue={member?.etc ?? ""}
          disabled={disabled}
        />
      </MemberFormField>
    </>
  );
}
