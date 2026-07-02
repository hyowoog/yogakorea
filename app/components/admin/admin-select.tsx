import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ADMIN_SELECT_ALL, toAdminSelectValue } from "~/lib/admin-form";

export interface AdminSelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  options: AdminSelectOption[];
  includeAll?: boolean;
  allLabel?: string;
}

export function AdminSelect({
  name,
  defaultValue,
  placeholder = "선택하세요",
  className = "w-full",
  options,
  includeAll = false,
  allLabel = "전체",
}: AdminSelectProps) {
  const resolvedDefault = includeAll
    ? toAdminSelectValue(defaultValue)
    : (defaultValue ?? options[0]?.value ?? "");

  return (
    <Select name={name} defaultValue={resolvedDefault}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {includeAll ? (
            <SelectItem value={ADMIN_SELECT_ALL}>{allLabel}</SelectItem>
          ) : null}
          {options.map((option) => (
            <SelectItem key={`${name}-${option.value}`} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
