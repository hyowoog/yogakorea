import type { Route } from "./+types/admin.slides._index";
import { data, Form, redirect } from "react-router";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminRowEdit } from "~/components/admin/admin-row-edit";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { requireAdmin } from "~/lib/auth.server";
import { mainNavigation } from "~/lib/navigation";
import {
  createMainSlide,
  deleteMainSlide,
  listAllMainSlides,
  parseMainSlideFormData,
  updateMainSlide,
  type MainSlide,
} from "~/lib/main-slide.server";

export function meta() {
  return [{ title: "메인사진관리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const slides = await listAllMainSlides(context.cloudflare.env.DB);
  return { slides };
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create" || intent === "update") {
    const parsed = parseMainSlideFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    if (intent === "create") {
      await createMainSlide(db, parsed.input);
    } else {
      const id = parseInt(String(formData.get("id") ?? ""), 10);
      if (!id) return data({ error: "수정할 슬라이드를 찾을 수 없습니다." }, { status: 400 });
      await updateMainSlide(db, id, parsed.input);
    }
    return redirect("/admin/slides");
  }

  if (intent === "delete") {
    const id = parseInt(String(formData.get("id") ?? ""), 10);
    if (!id) return data({ error: "삭제할 슬라이드를 찾을 수 없습니다." }, { status: 400 });
    await deleteMainSlide(db, id);
    return redirect("/admin/slides");
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

function SlideForm({ intent, slide }: { intent: "create" | "update"; slide?: MainSlide }) {
  return (
    <Form method="post" className="grid gap-2">
      <input type="hidden" name="intent" value={intent} />
      {slide ? <input type="hidden" name="id" value={slide.id} /> : null}
      <Input
        name="imagePath"
        defaultValue={slide?.image_path ?? ""}
        placeholder="이미지 경로 (예: /mainpic/photo.jpg)"
        required
      />
      <Input name="caption" defaultValue={slide?.caption ?? ""} placeholder="캡션 텍스트" />
      <Input
        name="sortOrder"
        type="number"
        defaultValue={String(slide?.sort_order ?? 0)}
        placeholder="순서"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          value="1"
          defaultChecked={slide ? slide.is_active === 1 : true}
        />
        사용함
      </label>
      <Button type="submit" size="sm">{intent === "create" ? "추가" : "저장"}</Button>
    </Form>
  );
}

export default function AdminSlidesIndex({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { slides } = loaderData;

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="메인사진관리"
      title="메인사진관리"
      description="메인 페이지 슬라이드 이미지를 관리합니다."
    >
      {actionData && "error" in actionData ? (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {actionData.error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">순번</th>
              <th className="px-3 py-2 text-left">미리보기</th>
              <th className="px-3 py-2 text-left">순서</th>
              <th className="px-3 py-2 text-left">사용</th>
              <th className="px-3 py-2 text-left">작성일</th>
              <th className="px-3 py-2 text-left">관리</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide, index) => (
              <tr key={slide.id} className="border-t">
                <td className="px-3 py-2 align-top">{index + 1}</td>
                <td className="px-3 py-2 align-top">
                  {slide.image_path ? (
                    <img
                      src={slide.image_path}
                      alt={slide.caption ?? ""}
                      className="max-h-24 max-w-xs rounded border object-cover"
                    />
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">{slide.caption}</p>
                </td>
                <td className="px-3 py-2 align-top">{slide.sort_order}</td>
                <td className="px-3 py-2 align-top">{slide.is_active === 1 ? "O" : "X"}</td>
                <td className="px-3 py-2 align-top whitespace-nowrap">
                  {slide.created_at?.slice(0, 10) ?? "-"}
                </td>
                <td className="px-3 py-2 align-top">
                  <AdminRowEdit panelClassName="min-w-[280px]">
                    <SlideForm intent="update" slide={slide} />
                  </AdminRowEdit>
                  <Form
                    method="post"
                    className="mt-2"
                    onSubmit={(e) => {
                      if (!confirm("정말 삭제하시겠습니까?")) e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={slide.id} />
                    <Button type="submit" size="sm" variant="destructive">삭제</Button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">사진 추가</h2>
        <div className="max-w-md">
          <SlideForm intent="create" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          이미지 파일은 R2 업로드 후 경로를 입력하거나, 레거시 /mainpic/ 경로를 사용할 수 있습니다.
        </p>
      </section>
    </AdminLayout>
  );
}
