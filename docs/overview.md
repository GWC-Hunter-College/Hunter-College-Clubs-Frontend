# Overview: Architecture + Deployment

This doc explains how the frontend is structured and how staging deploys.

## Architecture

### Routing
Routes are defined in `src/App.tsx` using `react-router-dom`.
Pages live in `src/pages/` and should be route-focused: fetch data, wire handlers, assemble layout.

### UI framework
The app uses Mantine for layout and components.
Reusable UI elements live in `src/components/`.

### Auth flow (OIDC / Cognito)
Auth is handled via `react-oidc-context`.

- Provider setup: `src/main.tsx`
- Config validation: `src/config.ts`
- Convenience hook: `src/types/auth.ts` (`useAuthInfo`)

Usage pattern:
- Get `access_token` from `useAuthInfo()`
- Call authenticated endpoints with `Authorization: Bearer <access_token>`

Notes:
- `VITE_COGNITO_REDIRECT_URI` must match Cognito settings.
- `VITE_COGNITO_ISSUER` must match your user pool issuer.

### API integration pattern
The code uses `fetch` in pages and some components:
- base URL from `VITE_API_BASE_URL`
- Bearer auth header when needed
- JSON parsing and basic error handling

If you want to standardize later:
- Add a small `src/api/` layer for `fetchJson`, headers, and shared error handling.

### State management
Shared UI state is handled via context in `src/context/`.

- `EventModalContext` manages open/close state for the event modal.

Most other state stays local to pages via `useState` and `useEffect`.

### Demo data
JSON fixtures exist in `public/data/` for demo or local testing.
Keep any demo fallback explicit so production never silently uses it.

## Deployment (Staging)

### Workflow location
Staging deploy is defined in `.github/workflows/staging.yml` and runs on pushes to the `staging` branch.

High-level steps:
1. Install dependencies
2. Build the Vite app
3. Sync `dist/` to S3
4. Invalidate CloudFront

### Required GitHub configuration
The workflow expects the following.

Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `VITE_COGNITO_CLIENT_ID`

Variables:
- `VITE_COGNITO_DOMAIN`
- `VITE_COGNITO_REDIRECT_URI`
- `VITE_COGNITO_ISSUER`
- `VITE_API_BASE_URL`
- `AWS_S3_BUCKET_DESTINATION_STAGING` (example: `s3://your-bucket-name`)
- `AWS_CF_DIST_ID_STAGING` (CloudFront distribution id)

### Manual checks after deploy
- Confirm the CloudFront invalidation completes.
- Open the staging site and verify:
  - `/clubs` loads
  - a club detail page loads
  - login works (redirect URI matches)
  - join and leave actions work when signed in

### Common pitfalls
- Redirect URI mismatch in Cognito
- Missing `VITE_` env vars during build
- CORS issues from the API
- CloudFront caching an old SPA entrypoint
