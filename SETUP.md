# Cloudflare 배포 설정

로컬에서 Wrangler로 배포합니다. (`npm run deploy`가 빌드 후 배포)

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
