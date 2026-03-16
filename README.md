# Trade Journal

Production-oriented trade journal application built from the requirements in [specs/prompt.pdf](./specs/prompt.pdf).

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL on Neon
- JWT auth with HTTP-only cookies

## Local Setup

1. Install dependencies.
2. Configure `.env` with your Neon database credentials and JWT secret.
3. Run Prisma migration and seed.
4. Start the development server.

```bash
npm install
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Set these in `.env`:

```env
DATABASE_URL=""
DIRECT_URL=""
JWT_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- `DATABASE_URL`: Neon pooled connection string
- `DIRECT_URL`: Neon direct connection string
- `JWT_SECRET`: long random secret for session signing
- `NEXT_PUBLIC_APP_URL`: absolute app URL for the deployed app

## Seeded Login

The seed script creates a demo account:

- Email: `tnznjamtsho@gmail.com`
- Password: `password123`

## Implemented Features

- Register, login, logout, and current-session auth flow
- Protected dashboard routes
- Persistent phase selection
- Trade create, edit, and delete
- Multi-timeframe reason builder
- Phase-scoped summary cards
- Direction-based analytics tables
- Goal tracking
- Monthly calendar with weekly summaries
- Table search and filters

## Useful Commands

```bash
npm run dev
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Notes

- The implementation checklist lives in [specs/trade-journal-build-plan.md](./specs/trade-journal-build-plan.md).
- This app uses Neon + Prisma directly. Neon Auth is not used.

The implementation checklist lives in [specs/trade-journal-build-plan.md](./specs/trade-journal-build-plan.md).
