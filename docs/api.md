# API Contract (Frontend Expectations)

This document lists the HTTP endpoints the frontend currently calls and the contract it expects.
If the backend changes, update this file alongside the frontend changes.

## Conventions

### Base URL
All requests are sent to:

- `${VITE_API_BASE_URL}`

### Auth
Endpoints marked **Authenticated** require:

- `Authorization: Bearer <access_token>`

Token source:
- OIDC (AWS Cognito) via `react-oidc-context`
- convenience hook: `src/types/auth.ts` (`useAuthInfo`)

### Response format
Unless otherwise noted:
- Responses are JSON.
- Errors should return a non-2xx status with a JSON body when possible.

## Endpoints

### Events

#### `GET /events`
Auth: Unauthenticated  
Used by:
- Home (`/`)
- Club detail (`/club/:clubId`) (currently also fetches events)

Purpose:
- Retrieve a list of events for display.

Notes:
- If you later add filtering (my clubs vs global), consider:
  - `GET /me/events`
  - `GET /clubs/:clubId/events`
  - query params like `GET /events?scope=global`

---

### Clubs

#### `GET /clubs?verified=true`
Auth: Unauthenticated  
Used by:
- Club Directory (`/clubs`)

Purpose:
- Retrieve a list of verified clubs for directory display.

---

#### `GET /clubs/:clubId`
Auth: Unauthenticated  
Used by:
- Club Detail (`/club/:clubId`)

Purpose:
- Retrieve a single club’s details.

---

### Membership

#### `GET /me/clubs`
Auth: **Authenticated**  
Used by:
- Home (`/`) for “My Clubs”
- Club Detail (`/club/:clubId`) to infer membership state and role

Purpose:
- Retrieve the current user’s clubs (and any membership metadata the UI uses).

---

#### `POST /clubs/:clubId/members/me`
Auth: **Authenticated**  
Used by:
- Club Detail (`/club/:clubId`) join action

Purpose:
- Join a club as the current user.

Expected behavior:
- `200` or `201` on success.
- `401` if not authenticated.
- `409` if already a member (optional but helpful).

---

#### `DELETE /clubs/:clubId/members/me`
Auth: **Authenticated**  
Used by:
- Club Detail (`/club/:clubId`) leave action

Purpose:
- Leave a club as the current user.

Expected behavior:
- `200` or `204` on success.
- `401` if not authenticated.
- `404` if not a member (optional but helpful).

## Suggested future additions (optional)
If you plan to finish the WIP pages, these endpoints tend to pair well:

- `GET /events/:eventId` (Event Detail page)
- `POST /clubs` (Club Create page)
- `POST /events` or `POST /clubs/:clubId/events` (Event Create page)
