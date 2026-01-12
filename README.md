# Hunter College Clubs Frontend

Frontend web app for browsing Hunter College clubs and events, viewing a club’s detail page, and joining or leaving clubs.

## What’s in this repo (site features)
- Browse clubs and discover events across campus
- View club details, including basic club info and club branding (logo)
- Sign in to access authenticated experiences tied to your account
- Join and leave clubs (membership actions)
- View your memberships (“My Clubs”) for quick access
- Create new clubs (WIP)
- Create new events (WIP)
- Upload images for club logos and club events (WIP)

## Pages
Defined in `src/App.tsx`.

- **Home**
  - Landing experience showing events and entry points into the rest of the site
  - Includes a “My Clubs” section when signed in
- **Club Directory**
  - Browse a list of verified clubs
  - Search to find a specific club
- **Club Detail**
  - A club homepage with club information and actions
  - Allows signed-in users to join or leave the club
- **Event Detail** (demo or stub)
  - Intended to show a single event’s details
- **Create Club** (WIP)
  - Intended flow for creating a new club and uploading its branding
- **Create Event** (WIP)
  - Intended flow for creating a new event (including media upload)
- **Auth Debug** (dev)
  - Development-only page to inspect auth state and tokens

For page-by-page details, see **[docs/pages.md](docs/pages.md)**.

## Tech stack

### App dependencies (in this repo)
These are the libraries the React app uses directly to implement the UI and page behavior.

- **React + TypeScript**: component-based UI and type-safe models for clubs, events, and membership state
- **Vite**: fast dev server and production builds
- **React Router**: route-based navigation for the pages listed above
- **Mantine UI**: reusable UI components and layout primitives used across pages and cards
- **react-oidc-context**: OIDC client logic used by the app to manage sign-in state and tokens

### Repo automation and delivery (in this repo, but not part of the runtime app)
These live in the repository as CI/CD configuration and help build and ship the site.

- **GitHub Actions**: builds the Vite app on the staging branch and runs the deployment workflow
- **Backend API integration (`fetch`)**: frontend request logic that relies on `VITE_API_BASE_URL` to load data and perform authenticated actions (see `docs/api.md`)

### External services this frontend connects to (not in the repo, but required)
These are the AWS services the app expects to exist and integrates with at runtime or during deploy.

- **AWS Cognito (OIDC)**: identity provider used for authentication; issues tokens used for authenticated API calls
- **Amazon S3**: hosts the built static site assets
- **Amazon CloudFront**: CDN for caching and serving the site, with invalidations after deploy
- **Backend API**: serves club/event data and membership actions consumed by this frontend (see `docs/api.md`)

## Repo structure
- `src/pages/` Route-level screens
- `src/components/` Reusable UI components
- `src/context/` Shared UI state (event modal)
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
