# Trade Journal Build Plan

## Objective

Build a production-ready full-stack trade journal web app using `Next.js`, `TypeScript`, `Tailwind CSS`, `shadcn/ui`, `Prisma`, and `PostgreSQL` on `Neon`, with JWT auth via HTTP-only cookies, phase-aware trade journaling, analytics, calendar review, seed data, and Vercel-ready deployment setup.

## Non-Negotiable Product Rules

- Build the real app, not a UI-only mockup.
- Scope all data to the authenticated user.
- Derive all analytics from stored trades only.
- Separate all views and calculations by selected phase.
- Persist historical data when switching phases.
- Automatically assign new trades to the currently selected phase.
- Keep dark mode readable across all surfaces.
- Keep architecture modular and production-oriented.

## Core Stack

- `Next.js` latest with App Router
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Lucide React`
- `Prisma ORM`
- `PostgreSQL` on `Neon`
- `Zod`
- JWT auth with `HTTP-only cookies`
- Vercel deployment target

## Delivery Scope

1. Project setup and folder structure
2. Database schema and Prisma configuration
3. Authentication system
4. Protected dashboard shell
5. Phase selection and persistence
6. Trade entry form and reason builder
7. Trade CRUD and master table
8. Analytics computation layer
9. Calendar aggregation and UI
10. Seed data
11. Environment, deployment, and README

## Recommended Build Sequence

### Phase 1: Project Foundation

- Initialize `Next.js` app with App Router and `TypeScript`
- Configure `Tailwind CSS`
- Install and configure `shadcn/ui`
- Add base app layout, theme provider, and typography strategy
- Set up folder structure for:
  - `app/`
  - `components/`
  - `lib/`
  - `prisma/`
  - `types/`
- Add shared utilities, constants, and validation scaffolding
- Add `.env.example`

### Phase 2: Database and Prisma

- Configure Prisma with Neon connection settings
- Create enums:
  - `Phase`
  - `Direction`
  - `SetupCategory`
  - `Bias`
- Create `User` model
- Create `Trade` model
- Create `PhaseSettings` or `JournalSettings` model
- Add relations so every trade and settings record belongs to a user
- Model `reasonStructure` as JSON
- Model `summarizedReasons` as text/string field
- Define deterministic trade number strategy
- Run initial migration

### Phase 3: Authentication

- Implement register flow
- Implement login flow
- Implement logout flow
- Implement current-user session lookup
- Hash passwords with `bcrypt` or `bcryptjs`
- Issue JWT tokens on auth success
- Store auth token in `HTTP-only cookies`
- Use production-safe cookie settings
- Add route protection for authenticated app routes
- Keep auth utilities modular for future refresh-token/password-reset expansion

### Phase 4: App Shell and Routing

- Create public routes:
  - `/login`
  - `/register`
- Create protected dashboard route
- Build dashboard shell with:
  - app title
  - user menu
  - logout action
  - theme toggle
  - phase selector
- Add responsive layout behavior for desktop and mobile

### Phase 5: Phase Model and Settings

- Support `Phase 1`, `Phase 2`, and `Live`
- Make selected phase filter the full app
- Persist selected phase across refresh, preferably per user
- Store per-phase settings:
  - starting balance
  - goal
  - phase target percent
- Set default target logic:
  - `Phase 1 = 8%`
  - `Phase 2 = 5%`
  - `Live = 10%`
- Make phase target config editable in code and DB-backed

### Phase 6: Trade Entry and Reason Builder

- Build trade entry form fields:
  - trade number auto-generated
  - date
  - direction
  - PnL
  - setup category
  - bias
  - R:R
  - notes
- Do not allow manual phase selection in the form
- Use `Zod` validation
- Require:
  - PnL
  - at least one valid reason selection
- Build multi-timeframe reason builder tabs:
  - `4H`
  - `1H`
  - `15M`
  - `5M`
- For each timeframe support:
  - bias selector
  - confluence checklist
  - custom confluence add/remove
- Generate live readable summary for the trade reason
- Store both normalized JSON reason data and readable summary text
- Reset form cleanly after successful submit

### Phase 7: Trade CRUD and Master Table

- Implement create trade action
- Implement edit trade action
- Implement delete trade action
- Save trades under the selected phase automatically
- Refresh dashboard data immediately after changes
- Build master trades table with columns:
  - trade no
  - date
  - direction
  - PnL
  - setup category
  - bias
  - R:R
  - reasons
  - notes
  - phase
  - actions
- Add readable `Long` and `Short` badges
- Add loading, empty, and error states
- If time allows, add filters:
  - date range
  - direction
  - setup category
  - phase-aware search

### Phase 8: Analytics Layer

- Implement server-side analytics utilities
- Compute all metrics from stored trades only
- Build summary cards for:
  - starting balance
  - current balance
  - phase target
  - total PnL
  - win rate
  - profit factor
  - returns
  - average R:R
  - remaining to goal
  - remaining to phase target
- Build direction-based analytics tables for `Long` and `Short`
- Include:
  - total trades
  - wins
  - losses
  - win %
  - average win
  - average loss
  - average R:R
- Keep analytics scoped by user and selected phase

### Phase 9: Goal Tracking and Calendar

- Build editable goal tracking section per phase
- Show:
  - set goal
  - current PnL
  - required to reach goal
  - phase target left
  - progress bar
- Build real monthly calendar UI
- Support:
  - Sunday to Saturday columns
  - weekly summary column
  - previous/next month navigation
  - one month at a time
- Show inside day cells:
  - trade count
  - daily PnL
- Show weekly summary values:
  - weekly trade count
  - weekly PnL
- Show month summary in header:
  - month/year
  - month P/L
  - month trade count
  - win rate
  - profit factor
- Aggregate calendar data server-side
- Keep calendar scoped by user, selected phase, and selected month

### Phase 10: Theming and UI Polish

- Implement dark/light theme toggle
- Persist theme choice across refresh
- Ensure strong contrast in:
  - cards
  - tables
  - tabs
  - calendar
  - badges
  - forms
  - dropdowns
  - modals
- Avoid weak gray-on-gray styling
- Ensure `Long` and `Short` badges remain readable in both themes
- Keep UI premium, trading-focused, and not template-like

### Phase 11: Seed Data

- Create demo user
- Seed settings for all phases
- Seed realistic trades across multiple dates and phases
- Include long and short examples
- Include populated reason structures
- Ensure seed data produces meaningful analytics and calendar output

### Phase 12: Deployment and Docs

- Ensure environment variables are used correctly
- Verify Prisma setup is correct for Neon
- Verify auth/cookies are safe for Vercel deployment
- Add local development instructions
- Add DB setup instructions
- Add Prisma migrate/generate/seed instructions
- Add Vercel deployment instructions
- Write complete README

## Backend Capability Checklist

- Register user
- Login user
- Logout user
- Fetch current user
- Create trade
- Edit trade
- Delete trade
- Fetch trades by phase
- Fetch trades by phase and month
- Fetch analytics by phase
- Fetch calendar aggregation by phase and month
- Fetch and update phase settings

## Data Model Checklist

### User

- `id`
- `email`
- `passwordHash`
- `name`
- `createdAt`
- `updatedAt`

### Trade

- `id`
- `tradeNumber`
- `date`
- `direction`
- `pnl`
- `setupCategory`
- `bias`
- `rr`
- `notes`
- `phase`
- `summarizedReasons`
- `reasonStructure`
- `createdAt`
- `updatedAt`
- `userId`

### PhaseSettings or JournalSettings

- `id`
- `userId`
- `phase`
- `startingBalance`
- `goal`
- `phaseTargetPercent`
- `createdAt`
- `updatedAt`

## Important Architecture Decisions to Lock Early

- JWT helper design and cookie strategy
- Route handlers vs server actions split
- Selected phase persistence strategy
- Trade number generation strategy
- Server-side analytics module design
- Server-side calendar aggregation shape
- Shape of `reasonStructure` JSON
- Dashboard state refresh strategy after CRUD actions

## Suggested Milestone Order

1. Scaffold app and dependencies
2. Prisma schema and migration
3. Auth flow and protected routing
4. Dashboard shell and theme system
5. Phase settings and selector
6. Trade form and reason builder
7. Trade table and CRUD
8. Analytics service and summary cards
9. Calendar aggregation and UI
10. Seed data and QA pass
11. README and Vercel readiness

## Acceptance Criteria

- User can register, login, logout, and access only their own data.
- User can switch between `Phase 1`, `Phase 2`, and `Live`.
- New trades are saved under the selected phase automatically.
- User can create, edit, and delete trades.
- Reason builder stores both structured and summarized trade reasons.
- Analytics update correctly after trade changes.
- Calendar updates correctly by month and phase.
- Goals and phase targets are reflected correctly.
- Dark and light themes are both polished and readable.
- App is ready for local development, seeding, and Vercel deployment.

## Nice-to-Haves After Core Completion

- Edit modal or drawer refinement
- Table filtering
- CSV export
- Month dropdown jump
- Small professional animations
