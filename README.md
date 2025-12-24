# Hunter College Clubs Frontend

Frontend web app for browsing Hunter College clubs and events, viewing a club’s detail page, and joining or leaving clubs.

## What’s in this repo
- Route-based pages using React Router
- Auth via OIDC (AWS Cognito) using `react-oidc-context`
- Club directory and club detail pages
- Membership join and leave actions (authenticated)
- “My Clubs” sidebar (authenticated)
- Staging deploy workflow to S3 + CloudFront via GitHub Actions

## Tech stack
- React + TypeScript + Vite
- Mantine UI
- react-router-dom
- react-oidc-context

## Routes
Defined in `src/App.tsx`.

- `/` Home
- `/clubs` Club Directory
- `/club/:clubId` Club Detail
- `/event/:eventId` Event Detail (currently demo or stub)
- `/club/create` Club Create (WIP)
- `/event/create` Event Create (WIP)
- `/auth` Auth debug (dev)

## Repo structure
- `src/pages/` Route-level screens
- `src/components/` Reusable UI components
- `src/context/` Shared UI state (event modal)
- `src/types/` Shared types + normalizers
- `public/data/` Demo JSON fixtures

## Docs
- `docs/setup.md` Local setup + required backend/API assumptions
- `docs/api.md` API contract the frontend expects
- `docs/overview.md` Architecture + deployment notes
- `docs/pages.md` Page-by-page behavior and data flow
- `docs/components.md` Reusable components and shared state

## Contributing
- Keep route-level fetching and wiring in `src/pages/`.
- Keep reusable UI in `src/components/`.
- Prefer typed helpers in `src/types/` for API payload normalization.
- When changing routes or API calls, update the docs in `/docs`.
