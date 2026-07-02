import type { Route } from "./+types/login";
import { data, Form, redirect } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  appendSessionCookie,
  createSession,
  getAuthUser,
  getClientIp,
  getMemberByLoginId,
  isMemberBlocked,
  recordMemberLogin,
} from "~/lib/auth.server";
import { mainNavigation } from "~/lib/navigation";
import { verifyLegacyPassword } from "~/lib/password.server";

export function meta() {
  return [{ title: "로그인 | 한국요가연합회" }];
}

function safeRedirect(path: string | null) {
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return "/";
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await getAuthUser(request, context.cloudflare.env.DB);
  if (user) throw redirect("/");

  const url = new URL(request.url);
  return { redirectTo: safeRedirect(url.searchParams.get("redirectTo")) };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const loginId = String(formData.get("loginId") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirect(String(formData.get("redirectTo") ?? "/"));

  if (!loginId || !password) {
    return data({ error: "아이디와 비밀번호를 입력해 주세요." }, { status: 400 });
  }

  const db = context.cloudflare.env.DB;
  const member = await getMemberByLoginId(db, loginId);

  if (!member || !(await verifyLegacyPassword(password, member.password_hash))) {
    return data(
      { error: "가입된 회원아이디가 아니거나 비밀번호가 틀립니다." },
      { status: 400 },
    );
  }

  if (isMemberBlocked(member)) {
    return data({ error: "접근이 제한된 회원입니다." }, { status: 403 });
  }

  if (!member.email_certified) {
    return data({ error: "이메일 인증이 완료되지 않은 회원입니다." }, { status: 403 });
  }

  const sessionId = await createSession(db, member.id);
  await recordMemberLogin(db, member.id, getClientIp(request));

  const headers = new Headers();
  appendSessionCookie(headers, sessionId, request);

  throw redirect(redirectTo, { headers });
}

export default function Login({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <SiteLayout navigation={mainNavigation} pageTitle="로그인">
      <div className="yk-container yk-page-content max-w-md">
        <Form method="post" className="yk-form">
          <input type="hidden" name="redirectTo" value={loaderData.redirectTo} />

          {actionData?.error ? (
            <p className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {actionData.error}
            </p>
          ) : null}

          <label>
            아이디
            <Input
              name="loginId"
              autoComplete="username"
              required
              placeholder="회원 아이디"
            />
          </label>

          <label>
            비밀번호
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="비밀번호"
            />
          </label>

          <Button type="submit" className="w-full">
            로그인
          </Button>
        </Form>
      </div>
    </SiteLayout>
  );
}
