import { Link, useFetcher, useRouteLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ADMIN_LEVEL } from "~/lib/event-constants";
import type { loader as rootLoader } from "~/root";

export function HomeLoginPanel() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const user = rootData?.user;
  const fetcher = useFetcher<{ error?: string }>();
  const error = fetcher.data?.error;
  const isSubmitting = fetcher.state !== "idle";

  if (user) {
    return (
      <div className="yk-home-latest yk-home-login">
        <div className="yk-home-latest-header">
          <h3 className="text-xl font-semibold text-neutral-700">회원</h3>
        </div>
        <div className="yk-home-login-user">
          <p className="text-sm text-neutral-700">
            <strong>{user.name}</strong>님, 안녕하세요.
          </p>
          <div className="yk-home-login-links">
            {user.level >= ADMIN_LEVEL ? (
              <Link to="/admin">관리자모드</Link>
            ) : null}
            <Link to="/logout">로그아웃</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="yk-home-latest yk-home-login">
      <div className="yk-home-latest-header">
        <h3 className="text-xl font-semibold text-neutral-700">로그인</h3>
      </div>
      <fetcher.Form method="post" action="/login" className="yk-home-login-form">
        <input type="hidden" name="redirectTo" value="/" />

        {error ? (
          <p className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </fetcher.Form>
    </div>
  );
}
