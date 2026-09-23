# Hunter College Clubs Frontend

Frontend web app for browsing Hunter College clubs and events, viewing a club’s detail page, and joining or leaving clubs.

## Local design mode (no AWS/backend)

```bash
npm ci
VITE_USE_MOCK_API=true npm run dev:mock -- --host 127.0.0.1 --port 5173 --strictPort
```

Open **http://127.0.0.1:5173/**. No API or Cognito configuration is needed for this mode.
Alternatively, copy `.env.mock.example` to `.env.mock.local`, then run `npm run dev:mock`.
The flag only works with the development server; production and staging builds always use the real API/auth configuration.

See **[docs/design-mode.md](docs/design-mode.md)** for capture routes, personas, fixture details, tests, and existing screen limitations.

## What’s in this repo (site features)
- Browse clubs and discover upcoming events across campus, with a searchable agenda
- View club details — header, membership, events (upcoming/past), and manager-only tools
- Sign in to access authenticated experiences tied to your account
- Join and leave clubs, with a confirmation step before leaving
- View your memberships and their events in one place (“My Clubs”)
- Create a new club, with a live preview of how it will look
- Post a new event for a club you manage — save a draft or publish it, with a live preview
- Share an event (copy link, email, .ics download, or the native share sheet)

## Pages
Defined in `src/App.tsx`.

- **Home** (`/`) — hero with a strip of upcoming event flyers, then a grid of upcoming events
- **Events** (`/events`) — searchable agenda of every upcoming event, grouped by month/day
- **Clubs** (`/clubs`) — searchable grid of verified clubs
- **Club** (`/club/:clubId`) — header (membership, stats, role, tags), tabs for Events, Board
  (coming soon), Announcements (coming soon), and Manage (eboard/owner only)
- **Event** (`/event/:eventId`) — gallery, host, when/where, RSVP/calendar/share actions, and a
  manager bar for the host club's eboard/owner
- **My Clubs** (`/my-clubs`, signed in) — stats, your clubs, and an agenda of their events;
  signed out shows a sign-in gate
- **Create** (`/create`, signed in) — hub linking to the club and event creation flows
- **New event, step 1** (`/event/create`, signed in) — pick a club you manage or resume a draft
- **New event form** (`/club/:clubId/event/new`, signed in) — details form with a live preview
- **New club** (`/club/create`, signed in) — details form with a live preview
- **Auth Debug** (`/auth`, dev) — development-only page to inspect auth state and tokens

For page-by-page details, see **[docs/pages.md](docs/pages.md)**.

## Tech stack

### App dependencies (in this repo)
These are the libraries the React app uses directly to implement the UI and page behavior.  
For UI/component details, see **[docs/components.md](docs/components.md)**.

- **React + TypeScript**: component-based UI and type-safe models for clubs, events, and membership state
- **Vite**: fast dev server and production builds
- **React Router**: route-based navigation for the pages listed above
- **Mantine UI**: reusable UI components and layout primitives used across pages and cards
- **react-oidc-context**: OIDC client logic used by the app to manage sign-in state and tokens

### Repo automation and delivery
CI/CD configuration that builds and deploys the site.  
For deployment details, see **[docs/overview.md](docs/overview.md)**.

- **GitHub Actions**: builds the Vite app on the staging branch and runs the deployment workflow
- **Backend API integration (`fetch`)**: frontend request logic that relies on `VITE_API_BASE_URL` to load data and perform authenticated actions (see `docs/api.md`)

### External services this frontend connects to
These are the AWS services the app expects to exist and integrates with at runtime or during deploy.
For endpoint expectations, see **[docs/api.md](docs/api.md)**.

- **AWS Cognito (OIDC)**: identity provider used for authentication; issues tokens used for authenticated API calls
- **Amazon S3**: hosts the built static site assets
- **Amazon CloudFront**: CDN for caching and serving the site, with invalidations after deploy
- **Backend API**: serves club/event data and membership actions consumed by this frontend (see `docs/api.md`)

## Repo structure
- `src/pages/` Route-level screens
- `src/components/ui/` Shared design-system components (buttons, cards, inputs, overlays, ...)
- `src/components/shell/` App shell: top nav/footer, mobile top bar/tab bar, and their state
- `src/components/Home/`, `src/components/Club/`, `src/components/Event/`, `src/components/Create/`
  Page-specific components
- `src/hooks/` Data-fetching hooks (one per resource: clubs, events, membership, ...)
- `src/lib/` Framework-free helpers (date/time formatting, .ics generation, share, club tints)
- `src/styles/` CSS custom properties and text-style classes for the design tokens
- `src/types/` Shared types + normalizers
- `public/data/` Demo JSON fixtures

## Docs
- [Setup](docs/setup.md)
- [API contract](docs/api.md)
- [Architecture + deployment](docs/overview.md)
- [Pages](docs/pages.md)
- [Components](docs/components.md)

## Contributing
- Keep route-level fetching and wiring in `src/pages/`.
- Keep reusable UI in `src/components/`.
- Prefer typed helpers in `src/types/` for API payload normalization.
- When changing routes or API calls, update the docs in `/docs`.
