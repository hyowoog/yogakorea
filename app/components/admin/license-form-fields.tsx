import type { ReactNode } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { MemberLicense } from "~/lib/yoga-license.server";

interface LicenseFormFieldsProps {
  license?: MemberLicense | null;
  disabled?: boolean;
  idPrefix?: string;
}

interface LicenseFormFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

function LicenseFormField({ label, htmlFor, className, children }: LicenseFormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-medium text-sky-700" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function LicenseFormFields({
  license,
  disabled = false,
  idPrefix = "license",
}: LicenseFormFieldsProps) {
  function fieldId(name: string) {
    return `${idPrefix}-${name}`;
  }

  return (
    <>
      <LicenseFormField label="자격번호" htmlFor={fieldId("licId")}>
        <Input
          id={fieldId("licId")}
          name="licId"
          defaultValue={String(license?.lic_id ?? "")}
          disabled={disabled}
        />
      </LicenseFormField>
      <LicenseFormField label="이름" htmlFor={fieldId("name")}>
        <Input
          id={fieldId("name")}
          name="name"
          defaultValue={license?.name ?? license?.member_name ?? ""}
          disabled={disabled}
        />
      </LicenseFormField>
      <LicenseFormField label="종목 및 급수" htmlFor={fieldId("gradeTxt")} className="md:col-span-2">
        <Input
          id={fieldId("gradeTxt")}
          name="gradeTxt"
          defaultValue={license?.grade_txt ?? ""}
          disabled={disabled}
        />
      </LicenseFormField>
      <LicenseFormField label="교육기관" htmlFor={fieldId("gradeEduLoc")}>
        <Input
          id={fieldId("gradeEduLoc")}
          name="gradeEduLoc"
          defaultValue={license?.grade_edu_loc ?? ""}
          disabled={disabled}
        />
      </LicenseFormField>
      <LicenseFormField label="종목" htmlFor={fieldId("gradeType")}>
        <Input
          id={fieldId("gradeType")}
          name="gradeType"
          defaultValue={license?.grade_type ?? ""}
          disabled={disabled}
        />
      </LicenseFormField>
      <LicenseFormField label="급수" htmlFor={fieldId("gradeNo")}>
        <Input
          id={fieldId("gradeNo")}
          name="gradeNo"
          defaultValue={license?.grade_no ?? ""}
          disabled={disabled}
        />
      </LicenseFormField>
      <LicenseFormField label="등록일" htmlFor={fieldId("created")}>
        <Input
          id={fieldId("created")}
          name="created"
          type="date"
          defaultValue={license?.created ?? ""}
          disabled={disabled}
        />
      </LicenseFormField>
    </>
  );
}
