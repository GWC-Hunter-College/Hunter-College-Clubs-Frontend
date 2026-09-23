# API Contract (Frontend Expectations)

This document lists the HTTP endpoints the frontend calls and the contract it expects. If the
backend changes, update this file alongside the frontend changes.

Implementation notes: the opt-in [local design mode](design-mode.md) mocks every endpoint below.
`POST /clubs/:clubId/events` and `POST /clubs` are answered in memory (nothing persists past a
reload) and accept a few mock-only extensions beyond the documented request shape — see each
endpoint's Notes.

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
Used by: Home (`/`), Events (`/events`)

Retrieves every event, including drafts. Callers filter out `status: "draft"` client-side —
drafts are never shown in a public list, only to their club's managers.

---

#### `GET /events/:eventId`
Auth: Unauthenticated
Used by: Event (`/event/:eventId`)

Retrieves a single event by id. `404` when not found.

---

#### `GET /clubs/:clubId/events`
Auth: Unauthenticated
Used by: Club (`/club/:clubId`), New event step 1 (`/event/create`, to list drafts), New event
form (`/club/:clubId/event/new`, to prefill from a draft)

Retrieves every event owned by one club, including drafts. `404` when the club doesn't exist.

---

#### `GET /me/events`
Auth: **Authenticated**
Used by: My Clubs (`/my-clubs`)

Retrieves every non-draft event owned by a club the current user belongs to. `401` when not
authenticated.

---

#### `POST /clubs/:clubId/events`
Auth: **Authenticated**
Used by: New event form (`/club/:clubId/event/new`) — Save Draft and Post Event

Request body:
```json
{
  "event": { "title": "string", "location": "string", "rsvpLink": "string?", "startDate": "ISO 8601", "endDate": "ISO 8601", "timezone": "string?" },
  "description": "string?"
}
```

Expected behavior:
- `200` with `{ "eventId": number }` on success.
- `401` if not authenticated.
- `404` if the club doesn't exist.

Notes (mock-side extensions, not yet in the documented shape above — the real backend needs to
decide how it wants these):
- `status`: `"draft" | "posted"`, defaults to `"posted"` if omitted.
- `tags`: `string[]`, accepted but currently unused (the Event type has no tags field).
- `flyer`: the chosen flyer, as a `blob:` object URL in design mode. There's no upload endpoint
  yet; a real implementation needs some way to reference an uploaded image.
- `altText`: alt text for the flyer.

---

### Clubs

#### `GET /clubs?verified=true`
Auth: Unauthenticated
Used by: Clubs (`/clubs`); Events, Home, and the Club page (to resolve an event's host club
name/logo by id, since `owners.owner.name` is empty)

Retrieves verified clubs. `verified=false` or omitted retrieves the rest / everything.

---

#### `GET /clubs/:clubId`
Auth: Unauthenticated
Used by: Club (`/club/:clubId`), Event (`/event/:eventId`, for the host club), New event form

Retrieves a single club's details. `404` when not found.

---

#### `POST /clubs`
Auth: **Authenticated**
Used by: New club form (`/club/create`)

Request body:
```json
{ "club": { "name": "string", "description": "string" } }
```

Expected behavior:
- `200` with `{ "clubId": number }` on success. The creator becomes the club's `owner`.
- `401` if not authenticated.
- The created club is unverified, so — like on the real backend — it doesn't appear on the Clubs
  page until verified, but does appear in My Clubs for its owner.

Notes (mock-side extensions, not yet in the documented shape above):
- `logo`: the chosen logo, as a `blob:` object URL in design mode (same caveat as event flyers).
- `tags`: `string[]`, the selected topics.

---

### Membership

#### `GET /me/clubs`
Auth: **Authenticated**
Used by: Club, My Clubs, Create hub, New event step 1, New event form, Event (for the manager
bar) — everywhere the viewer's role needs to be known

Retrieves the current user's clubs, each with a `role` (`member` | `eboard` | `owner`).

---

#### `POST /clubs/:clubId/members/me`
Auth: **Authenticated**
Used by: Club page join action

Joins a club as the current user.

Expected behavior:
- `200` or `201` on success.
- `401` if not authenticated.
- `404` if the club doesn't exist.

---

#### `DELETE /clubs/:clubId/members/me`
Auth: **Authenticated**
Used by: Club page leave action (after the confirm modal)

Leaves a club as the current user.

Expected behavior:
- `200` or `204` on success.
- `401` if not authenticated.
- `403` if the current user owns the club (owners can't leave).
- `404` if not a member (optional but helpful).
