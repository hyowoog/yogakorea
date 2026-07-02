import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TSHIRT_COLORS, TSHIRT_SIZE_OPTIONS, normalizeTshirtColor } from "~/lib/tshirt-constants";
import type { TshirtOrder } from "~/lib/tshirt.server";

interface TshirtOrderFormProps {
  intent: "create" | "update";
  order?: TshirtOrder;
  submitLabel?: string;
}

export function TshirtOrderForm({ intent, order, submitLabel }: TshirtOrderFormProps) {
  const label = submitLabel ?? (intent === "create" ? "추가" : "수정 저장");

  return (
    <Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value={intent} />
      {intent === "update" && order ? (
        <input type="hidden" name="orderId" value={order.id} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor={`name-${order?.id ?? "new"}`}>
            이름
          </label>
          <Input
            id={`name-${order?.id ?? "new"}`}
            name="name"
            required
            defaultValue={order?.name}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor={`mobile-${order?.id ?? "new"}`}>
            휴대전화
          </label>
          <Input
            id={`mobile-${order?.id ?? "new"}`}
            name="mobile"
            required
            defaultValue={order?.mobile}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor={`studioName-${order?.id ?? "new"}`}>
            요가원명
          </label>
          <Input
            id={`studioName-${order?.id ?? "new"}`}
            name="studioName"
            required
            defaultValue={order?.studio_name}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <span className="text-sm font-medium">색상</span>
          <div className="flex gap-4 pt-2">
            {TSHIRT_COLORS.map((color) => (
              <label key={color} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="color"
                  value={color}
                  required
                  defaultChecked={
                    order
                      ? normalizeTshirtColor(order.color) === color
                      : color === "흰색"
                  }
                />
                {color}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-sm font-medium">사이즈</span>
        <div className="flex flex-wrap gap-3 pt-2">
          {TSHIRT_SIZE_OPTIONS.map((option) => (
            <label key={option.code} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="sizeCode"
                value={option.code}
                required
                defaultChecked={order ? order.size_code === option.code : option.code === "95"}
              />
              {option.label}({option.code})
            </label>
          ))}
        </div>
      </div>

      <Button type="submit">{label}</Button>
    </Form>
  );
}
