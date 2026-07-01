# Cloudflare 배포 설정

GitHub Actions 자동 배포를 위해 다음 Secrets를 설정하세요.

| Secret | 값 |
|--------|-----|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 토큰 (Workers, D1, R2 권한) |
| `CLOUDFLARE_ACCOUNT_ID` | `25197d91b2bb90ff76f27343cce57d7d` |

## 로컬 개발 순서

```bash
npm install
npm run db:migrate:local   # D1 로컬 마이그레이션
npm run dev                # http://localhost:5173
```

## 데이터 임포트 (dump.sql)

```bash
npm run db:import          # 로컬 D1
npm run db:import:remote   # 원격 D1
```

## 수동 배포

```bash
npm run build
npm run deploy
```

## 생성된 Cloudflare 리소스

- **Worker**: yogakorea
- **D1**: yogakorea (`42c5c42d-9ee1-4531-b817-d62c50ad292a`)
- **R2**: yogakorea-uploads
