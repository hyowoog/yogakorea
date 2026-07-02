import type { ReactNode } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { YogaMemGrade } from "~/lib/yoga-education.server";

interface EducationFormFieldsProps {
  education?: YogaMemGrade | null;
  disabled?: boolean;
  idPrefix?: string;
}

interface EducationFormFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

function EducationFormField({ label, htmlFor, className, children }: EducationFormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-medium text-sky-700" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function EducationFormFields({
  education,
  disabled = false,
  idPrefix = "education",
}: EducationFormFieldsProps) {
  function fieldId(name: string) {
    return `${idPrefix}-${name}`;
  }

  return (
    <>
      <EducationFormField label="자격번호" htmlFor={fieldId("licId")}>
        <Input
          id={fieldId("licId")}
          name="licId"
          defaultValue={String(education?.lic_id ?? "")}
          disabled={disabled}
        />
      </EducationFormField>
      <EducationFormField label="이름" htmlFor={fieldId("name")}>
        <Input
          id={fieldId("name")}
          name="name"
          defaultValue={education?.name ?? education?.member_name ?? ""}
          disabled={disabled}
        />
      </EducationFormField>
      <EducationFormField label="기준일자" htmlFor={fieldId("basDate")}>
        <Input
          id={fieldId("basDate")}
          name="basDate"
          defaultValue={education?.bas_date ?? ""}
          disabled={disabled}
        />
      </EducationFormField>
      <EducationFormField label="교육내용" htmlFor={fieldId("gradeTxt")}>
        <Input
          id={fieldId("gradeTxt")}
          name="gradeTxt"
          defaultValue={education?.grade_txt ?? ""}
          disabled={disabled}
        />
      </EducationFormField>
      <EducationFormField label="교육기관" htmlFor={fieldId("gradeEduLoc")}>
        <Input
          id={fieldId("gradeEduLoc")}
          name="gradeEduLoc"
          defaultValue={education?.grade_edu_loc ?? ""}
          disabled={disabled}
        />
      </EducationFormField>
      <EducationFormField label="구분(1~4)" htmlFor={fieldId("gubun")}>
        <Input
          id={fieldId("gubun")}
          name="gubun"
          defaultValue={education?.gubun ?? ""}
          disabled={disabled}
        />
      </EducationFormField>
      <EducationFormField label="시간" htmlFor={fieldId("hour")}>
        <Input
          id={fieldId("hour")}
          name="hour"
          defaultValue={education?.hour ?? ""}
          disabled={disabled}
        />
      </EducationFormField>
    </>
  );
}
