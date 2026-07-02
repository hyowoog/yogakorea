import type { ReactNode } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { Event } from "~/lib/event.server";

interface EventFormFieldsProps {
  event?: Event | null;
  disabled?: boolean;
  idPrefix?: string;
}

interface EventFormFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

function EventFormField({ label, htmlFor, className, children }: EventFormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-medium text-sky-700" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function EventFormFields({
  event,
  disabled = false,
  idPrefix = "event",
}: EventFormFieldsProps) {
  function fieldId(name: string) {
    return `${idPrefix}-${name}`;
  }

  return (
    <>
      <EventFormField label="행사명" htmlFor={fieldId("title")} className="md:col-span-2">
        <Input
          id={fieldId("title")}
          name="title"
          defaultValue={event?.title ?? ""}
          required
          disabled={disabled}
        />
      </EventFormField>
      <EventFormField label="접수시작일" htmlFor={fieldId("startsOn")}>
        <Input
          id={fieldId("startsOn")}
          name="startsOn"
          type="date"
          defaultValue={event?.starts_on ?? ""}
          required
          disabled={disabled}
        />
      </EventFormField>
      <EventFormField label="접수종료일" htmlFor={fieldId("endsOn")}>
        <Input
          id={fieldId("endsOn")}
          name="endsOn"
          type="date"
          defaultValue={event?.ends_on ?? ""}
          required
          disabled={disabled}
        />
      </EventFormField>
    </>
  );
}
