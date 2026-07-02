# 한국요가연합회 (yogakorea)

React Router v7 + Cloudflare Workers + D1 + R2 기반으로 마이그레이션한 한국요가연합회 웹사이트입니다.

## 구조

- `/` - 리뉴얼 사이트 (`public_html/renew` 기반)
- `/legacy` - 기존 Eyoom/그누보드 사이트
- `/board/:boardId` - 현대식 게시판 (TipTap 리치텍스트 에디터, R2 첨부파일)

## 로컬 개발

```bash
npm install
npm run db:migrate:local
npm run dev
```

## 데이터 마이그레이션

`dump.sql`을 D1용 SQLite로 변환 후 임포트:

```bash
npm run db:import
```

## 배포

개발 서버: **https://dev.yogakorea.or.kr**

GitHub `main` 브랜치 push 시 Cloudflare Workers로 자동 배포됩니다.

필요한 GitHub Secrets:

- `CLOUDFLARE_API_TOKEN` — [Cloudflare API 토큰](https://dash.cloudflare.com/profile/api-tokens)에서 **Edit Cloudflare Workers** 템플릿으로 생성
- `CLOUDFLARE_ACCOUNT_ID` — `25197d91b2bb90ff76f27343cce57d7d`

수동 배포:

```bash
npm run build
npm run db:migrate:remote
npm run deploy
```

## Cloudflare 리소스

- Worker: `yogakorea`
- D1: `yogakorea`
- R2: `yogakorea-uploads`
- 도메인: `dev.yogakorea.or.kr` (Workers Custom Domain)

## 원본 소스

- `public_html/` - 기존 PHP+MySQL 소스 (참조용, git 제외)
- `dump.sql` - MySQL 덤프 (git 제외)
