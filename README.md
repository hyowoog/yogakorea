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

운영 사이트: **https://yogakorea.or.kr** (www 포함, 개발용 `dev.yogakorea.or.kr`도 같은 Worker)

```bash
npm run db:migrate:remote
npm run deploy
```

레거시 정적 파일(`public_html`)은 git에 포함되지 않습니다. 로컬에서 `public_html`을 갱신한 뒤에는 아래로 R2에 다시 올려주세요.

```bash
npm run assets:upload
```

## Cloudflare 리소스

- Worker: `yogakorea`
- D1: `yogakorea`
- R2: `yogakorea-uploads`
- 도메인: `yogakorea.or.kr`, `www.yogakorea.or.kr`, `dev.yogakorea.or.kr` (Workers Custom Domain)

## 원본 소스

- `public_html/` - 기존 PHP+MySQL 소스 (참조용, git 제외)
- `dump.sql` - MySQL 덤프 (git 제외)
