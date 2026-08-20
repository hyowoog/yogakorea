interface EducationRadioRowProps {
  name: string;
  options: readonly { value: string; label: string }[];
  defaultValue: string;
  disabled?: boolean;
}

export function EducationRadioRow({
  name,
  options,
  defaultValue,
  disabled,
}: EducationRadioRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {options.map((option) => (
        <label
          key={`${name}-${option.value || "none"}`}
          className="flex items-center gap-1.5 text-sm"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            defaultChecked={option.value === defaultValue}
            disabled={disabled}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
