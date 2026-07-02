import type { ElementType, ReactNode, Ref } from "react";
import { Form } from "react-router";
import { AdminSelect } from "~/components/admin/admin-select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ADMIN_SELECT_ALL } from "~/lib/admin-form";
import {
  EVENT_REGIONS,
  getEventFormVariant,
  MEMBER_ROLES,
  parseExtraData,
  TSHIRT_SIZES,
  type EventExtraData,
} from "~/lib/event-constants";
import type { EventApplication } from "~/lib/event.server";

interface EventApplicationFormWrapperProps {
  method?: "get" | "post" | "put" | "patch" | "delete";
  action?: string;
  className?: string;
  onSubmit?: () => void;
  ref?: Ref<HTMLFormElement>;
  children?: ReactNode;
}

interface EventApplicationFormProps {
  eventId: number;
  intent: "create" | "update";
  application?: EventApplication;
  showAgreements?: boolean;
  submitLabel?: string;
  action?: string;
  formRef?: Ref<HTMLFormElement>;
  onFormSubmit?: () => void;
  FormComponent?: ElementType<EventApplicationFormWrapperProps>;
  disabled?: boolean;
}

function defaultExtra(application?: EventApplication): EventExtraData {
  if (!application?.extra_data) return { birth: "1980-01-01" };
  return parseExtraData(application.extra_data);
}

export function EventApplicationForm({
  eventId,
  intent,
  application,
  showAgreements = false,
  submitLabel,
  action,
  formRef,
  onFormSubmit,
  FormComponent = Form,
  disabled = false,
}: EventApplicationFormProps) {
  const variant = getEventFormVariant(eventId);
  const extra = defaultExtra(application);
  const label = submitLabel ?? (intent === "create" ? "신청하기" : "수정하기");

  return (
    <FormComponent
      ref={formRef}
      method="post"
      action={action}
      className="space-y-4"
      onSubmit={onFormSubmit}
    >
      <input type="hidden" name="intent" value={intent} />
      {intent === "update" && application ? (
        <input type="hidden" name="applicationId" value={application.id} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {variant === "tshirt" ? (
          <>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-blue-700" htmlFor="name">
                이름
              </label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={application?.name}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-blue-700">성별</span>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="f"
                    defaultChecked={!application || application.gender === "f"}
                  />
                  여성
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="m"
                    defaultChecked={application?.gender === "m"}
                  />
                  남성
                </label>
              </div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <span className="text-sm font-semibold text-blue-700">티셔츠 사이즈</span>
              <div className="flex flex-wrap gap-3 pt-2">
                {TSHIRT_SIZES.map((size) => (
                  <label key={size} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="tshirtSize"
                      value={size}
                      required={variant === "tshirt"}
                      defaultChecked={application?.tshirt_size === size}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-blue-700" htmlFor="name">
                이름
              </label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={application?.name}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-blue-700">성별</span>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="f"
                    defaultChecked={!application || application.gender === "f"}
                  />
                  여성
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="m"
                    defaultChecked={application?.gender === "m"}
                  />
                  남성
                </label>
              </div>
            </div>
          </>
        )}

        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-700" htmlFor="regionCode">
            권역
          </label>
          <AdminSelect
            name="regionCode"
            className="w-full"
            placeholder="선택하세요"
            defaultValue={
              application?.region_code
                ? String(application.region_code)
                : ADMIN_SELECT_ALL
            }
            options={[
              { value: ADMIN_SELECT_ALL, label: "선택하세요" },
              ...Object.entries(EVENT_REGIONS).map(([code, label]) => ({
                value: code,
                label,
              })),
            ]}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-700" htmlFor="studioName">
            요가원명
          </label>
          <Input
            id="studioName"
            name="studioName"
            required
            defaultValue={application?.studio_name}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-700" htmlFor="mobile">
            연락처
          </label>
          <Input
            id="mobile"
            name="mobile"
            required
            defaultValue={application?.mobile}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <span className="text-sm font-semibold text-blue-700">회원자격여부</span>
          <div className="flex flex-wrap gap-3 pt-2">
            {MEMBER_ROLES.map((role, index) => (
              <label key={role} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="memberRole"
                  value={role}
                  required
                  defaultChecked={
                    application ? application.member_role === role : index === 0
                  }
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        {variant === "schedule" ? (
          <>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-blue-700">전체일정선택</span>
              <div className="flex flex-wrap gap-4 pt-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sch1"
                    value="1"
                    defaultChecked={extra.sch1 === 1 || !extra.sch1}
                  />
                  1박2일(150,000)
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sch1" value="2" defaultChecked={extra.sch1 === 2} />
                  2박3일(200,000)
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-blue-700">26.01.18 일정선택</span>
              <div className="flex flex-wrap gap-4 pt-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="sch2" value="2" defaultChecked={extra.sch2 === 2} />
                  한라산등반-영실코스
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sch2" value="3" defaultChecked={extra.sch2 === 3} />
                  관광
                </label>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div
        className={`grid gap-4 ${variant === "schedule" ? "md:grid-cols-4" : "md:grid-cols-3"}`}
      >
        {variant === "schedule" ? (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-blue-700" htmlFor="birth">
              생년월일
            </label>
            <Input
              id="birth"
              name="birth"
              type="date"
              required
              defaultValue={extra.birth ?? "1980-01-01"}
              className="w-full"
            />
          </div>
        ) : null}

        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-700" htmlFor="bankName">
            환불계좌은행명
          </label>
          <Input
            id="bankName"
            name="bankName"
            required
            defaultValue={application?.bank_name ?? ""}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-700" htmlFor="bankNum">
            환불계좌번호
          </label>
          <Input
            id="bankNum"
            name="bankNum"
            required
            defaultValue={application?.bank_num ?? ""}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-700" htmlFor="bankOwner">
            환불계좌예금주
          </label>
          <Input
            id="bankOwner"
            name="bankOwner"
            required
            defaultValue={application?.bank_owner ?? ""}
            className="w-full"
          />
        </div>
      </div>

      {showAgreements ? (
        <div className="space-y-3 rounded border border-amber-200 bg-amber-50 p-4 text-sm">
          <label className="flex items-start gap-2">
            <input type="checkbox" name="privacyAgree" value="y" required className="mt-1" />
            <span>
              개인정보활용 동의여부
              <br />
              본 신청서에 기재된 개인정보는 행사 운영과 예약을 위한 참가자 관리목적으로만
              사용됩니다.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="photoAgree" value="y" required className="mt-1" />
            <span>
              촬영동의여부
              <br />
              행사 중 촬영된 사진 및 영상은 행사 기록과 홍보자료 제작을 위한 목적으로만
              사용됩니다.
            </span>
          </label>
        </div>
      ) : null}

      <div className="flex justify-center gap-2 pt-2">
        <Button type="submit" disabled={disabled}>{label}</Button>
        {showAgreements ? (
          <Button type="reset" variant="outline">
            새로작성
          </Button>
        ) : null}
      </div>
    </FormComponent>
  );
}
