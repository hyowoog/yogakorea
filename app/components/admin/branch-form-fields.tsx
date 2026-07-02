import type { ReactNode } from "react";
import { AdminSelect } from "~/components/admin/admin-select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { YogaBranch } from "~/lib/yoga-branch.server";

interface BranchFormFieldsProps {
  branch?: YogaBranch | null;
  disabled?: boolean;
  idPrefix?: string;
}

interface BranchFormFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

function BranchFormField({ label, htmlFor, className, children }: BranchFormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-medium text-sky-700" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

const YN_OPTIONS = [
  { value: "Y", label: "사용함" },
  { value: "N", label: "사용안함" },
];

export function BranchFormFields({
  branch,
  disabled = false,
  idPrefix = "branch",
}: BranchFormFieldsProps) {
  function fieldId(name: string) {
    return `${idPrefix}-${name}`;
  }

  return (
    <>
      <BranchFormField label="요가원명" htmlFor={fieldId("yName")}>
        <Input
          id={fieldId("yName")}
          name="yName"
          defaultValue={branch?.y_name ?? ""}
          required
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="원장명" htmlFor={fieldId("yCeo")}>
        <Input
          id={fieldId("yCeo")}
          name="yCeo"
          defaultValue={branch?.y_ceo ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="요가원구분" htmlFor={fieldId("yType")}>
        <Input
          id={fieldId("yType")}
          name="yType"
          defaultValue={branch?.y_type ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="권역구분" htmlFor={fieldId("yAreaDscd")}>
        <Input
          id={fieldId("yAreaDscd")}
          name="yAreaDscd"
          defaultValue={branch?.y_area_dscd ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="휴대전화" htmlFor={fieldId("yHp")}>
        <Input
          id={fieldId("yHp")}
          name="yHp"
          defaultValue={branch?.y_hp ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="전화번호" htmlFor={fieldId("yPhone")}>
        <Input
          id={fieldId("yPhone")}
          name="yPhone"
          defaultValue={branch?.y_phone ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="이메일" htmlFor={fieldId("yEmail")}>
        <Input
          id={fieldId("yEmail")}
          name="yEmail"
          defaultValue={branch?.y_email ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="홈페이지" htmlFor={fieldId("yHomepage")}>
        <Input
          id={fieldId("yHomepage")}
          name="yHomepage"
          defaultValue={branch?.y_homepage ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="등록일" htmlFor={fieldId("yRegDate")}>
        <Input
          id={fieldId("yRegDate")}
          name="yRegDate"
          type="date"
          defaultValue={branch?.y_reg_date ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="사용여부" htmlFor={fieldId("yYn")}>
        <AdminSelect
          name="yYn"
          className="w-full"
          defaultValue={branch?.y_yn ?? "Y"}
          options={YN_OPTIONS}
        />
      </BranchFormField>
      <BranchFormField label="우편번호" htmlFor={fieldId("yZipcode")}>
        <Input
          id={fieldId("yZipcode")}
          name="yZipcode"
          defaultValue={branch?.y_zipcode ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="주소" htmlFor={fieldId("yAddr")} className="md:col-span-2">
        <Input
          id={fieldId("yAddr")}
          name="yAddr"
          defaultValue={branch?.y_addr ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
      <BranchFormField label="비고" htmlFor={fieldId("yEtc")} className="md:col-span-2">
        <Textarea
          id={fieldId("yEtc")}
          name="yEtc"
          defaultValue={branch?.y_etc ?? ""}
          disabled={disabled}
        />
      </BranchFormField>
    </>
  );
}
