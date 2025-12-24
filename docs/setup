# Setup (Local Dev) + API Requirements

This doc covers how to run the frontend locally and what it expects from the backend API.

## Prerequisites
- Node.js (LTS recommended)
- npm

## Install
From the repo root:

```bash
npm ci
```

## Environment variables (required)
Vite env vars are validated in `src/config.ts`.

Required:
- `VITE_API_BASE_URL`
- `VITE_COGNITO_DOMAIN`
- `VITE_COGNITO_CLIENT_ID`
- `VITE_COGNITO_REDIRECT_URI`
- `VITE_COGNITO_ISSUER`

Suggested `.env.example` template:

```env
VITE_API_BASE_URL="https://api.example.com"
VITE_COGNITO_DOMAIN="your-domain.auth.us-east-1.amazoncognito.com"
VITE_COGNITO_CLIENT_ID="your_client_id"
VITE_COGNITO_REDIRECT_URI="http://localhost:5173/"
VITE_COGNITO_ISSUER="https://cognito-idp.us-east-1.amazonaws.com/your_user_pool_id"
```

## Run locally

```bash
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## Backend/API requirements

### Base URL
All API calls are built from:

- `VITE_API_BASE_URL`

Example:
- If `VITE_API_BASE_URL=https://api.example.com`, then the frontend calls `https://api.example.com/clubs`, `https://api.example.com/events`, etc.

### Auth expectations
Authenticated requests use an access token acquired via OIDC (Cognito) and sent as:

- `Authorization: Bearer <access_token>`

If the user is logged out, authenticated requests should return `401`, and the UI should fall back to a logged-out state.

### CORS
If the backend is separate from the frontend origin, the API must allow:
- `GET`, `POST`, `DELETE` (at minimum for current membership flows)
- `Authorization` header
- your frontend origin(s) in `Access-Control-Allow-Origin`

### Required endpoints
See `docs/api.md` for the full contract (endpoints, auth requirements, and which pages use them).
