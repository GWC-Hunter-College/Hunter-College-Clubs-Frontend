# Local frontend design mode

This mode populates the current UI for local inspection and Figma capture. It does not change styles, layouts, components, or deployment workflows. The work branch is `chore/frontend-design-mock-mode`, based on fetched `origin/staging` at `1d65444`.

## Run

From the repository root, using Node 22.13+:

```bash
npm ci
VITE_USE_MOCK_API=true npm run dev:mock -- --host 127.0.0.1 --port 5173 --strictPort
```

Open **http://127.0.0.1:5173/** (localhost port 5173). Keep that hostname consistent while browsing; MSW registers per origin. No AWS account, backend, credentials, Cognito settings, or API base URL is needed. Existing real settings in `.env` are ignored by the mock API/auth path.

For a persistent local preference, copy `.env.mock.example` to `.env.mock.local`, then run `npm run dev:mock`. Do not overwrite an existing local env file. `.env.mock.local` is ignored by Git. `npm run dev:mock` selects Vite's `mock` env files; the explicit `VITE_USE_MOCK_API=true` flag is still required.

Stop the server with Ctrl+C. To return to the normal frontend, run `VITE_USE_MOCK_API=false npm run dev` and reload the page. Reload after changing modes or roles. The mock worker only intercepts clients that have explicitly started MSW; a normal page does not activate it.

## Capture routes and states

| Route | What is available |
| --- | --- |
| `/` | Home, populated My Clubs with role indicators, and event cards. Click a card to capture the existing modal. |
| `/clubs` | Eight verified clubs, search, populated My Clubs, and creation links. The directory retains its existing placeholder images. |
| `/club/1` | Girls Who Code: default E-board membership, LEAVE action, description, tags, logo, Upcoming/Previous events. |
| `/club/2` | Computer Science Club: ordinary member state. |
| `/club/3` | Studio Arts Collective: owner state, without join/leave actions. |
| `/club/5` | Robotics Club: not joined, with working JOIN/LEAVE actions. |
| `/event/13` | Girls Who Code Club Fair: multi-day event detail. |
| `/event/2` | Existing workshop fixture adapted into a single-day event detail. |
| `/club/create` | Authenticated form, live title/description/image preview, existing stub submit. |
| `/event/create` | The current Event Create Page skeleton. There is no implemented event form yet. |
| `/auth` | Existing auth debug screen, displaying clearly fake tokens and local sign-in/sign-out. |

## Authentication and state

`src/mocks/MockAuthProvider.tsx` supplies the same `react-oidc-context` context consumed by both `useAuthInfo` and `/auth`. It never mounts the real AuthProvider or constructs a UserManager. Sign-in, Google popup, and sign-out methods update local state without navigating to Cognito. The representative user is Alex Rivera, `alex.rivera@example.test`; the access token is the literal `design-only-access-token`, which has no real authority.

Set `VITE_MOCK_ROLE` when starting the dev server (or in `.env.mock.local`):

| Value | Initial state |
| --- | --- |
| `eboard` (default) | GWC E-board, CS member, Studio Arts owner. |
| `member` | GWC member, CS member, Studio Arts owner. |
| `owner` | GWC owner, CS member, Studio Arts owner. |
| `user` | Signed in, no memberships. |
| `guest` | Signed out; local sign-in reveals the representative member's clubs. |

Example: `VITE_USE_MOCK_API=true VITE_MOCK_ROLE=guest npm run dev:mock`.

These are club membership roles. The current frontend has no admin role or admin-only route; the `admin.png` avatar asset does not indicate authorization. No admin behavior is invented. OIDC lifecycle subscriptions are unused by current screens and explicitly unsupported by the mock context.

Membership mutations persist across navigation in the current tab. Reloading resets memberships and auth to the selected persona. No changes are stored or sent to a server. A joined club appears in My Clubs when navigating back to Home or Directory.

## API contracts and fixtures

The existing app calls `fetch` directly from pages. `src/config.ts` reads `VITE_API_BASE_URL`; there is no shared API client or active mock layer. Home additionally calls the literal `/api/me/clubs` without a token. Its two event tabs both request `/events`. Club Detail uses the normalizers in `src/types/club.ts` and `src/types/events.ts`; Directory and My Clubs consume response objects directly.

MSW intercepts actual browser requests after startup loads the fixtures and before React renders. In mock mode, `API_BASE_URL` is `/__design_api`, independent of the real env value. The following paths are relative to that local base unless stated otherwise:

| Method/path | Response/behavior |
| --- | --- |
| `GET /events` | `{ events: [...] }`, used by Home and Club Detail. |
| `GET /events/:eventId` | `{ event: {...} }` or 404, used by the mock-only Event Detail adapter. |
| `GET /clubs` | `{ clubs: [...] }`, including unverified clubs. |
| `GET /clubs?verified=true` | Eight verified clubs; `false` returns the unverified example. |
| `GET /clubs/:clubId` | `{ club: {...} }` or 404. |
| `GET /me/clubs` | `{ clubs: [...] }` with member/eboard/owner roles; empty when signed out. |
| `GET /api/me/clubs` (origin-relative) | Same membership response for Home's existing literal URL. |
| `POST /clubs/:clubId/members/me` | Joins the club, returning `{ role: "member" }`; repeat joins preserve the existing role. |
| `DELETE /clubs/:clubId/members/me` | Leaves the club, returning `{ role: null }`; owners receive 403. |

Membership writes require local signed-in state and the demo bearer token; missing authorization returns 401 and unknown clubs return 404. Unknown design API requests return 501. Unhandled external API requests are blocked by MSW instead of falling through to AWS. Static assets, Vite modules, and the existing optional Google Fonts requests are allowed.

All three original fixtures are loaded unchanged from `public/data/`:

- `demo-club.json`: GWC's identity/logo and description opening are reused. The mock adapter replaces lorem ipsum and supplies tags and memberships separately.
- `demo-event.json`: twelve event identities, titles, durations, artwork, and relationships form the base dataset.
- `demo-event-me.json`: merged with the global fixture by event ID; its entries currently overlap, so no duplicate cards are created.

The old event shape (`startDate`, `endDate`, `thumbnailUrl`, `owners`) still works with the current event normalizer. The club fixture has no tags, and the club normalizer drops tags. The Club page preserves mock fixture tags only when design mode is enabled; the real normalizer is unchanged.

`src/mocks/fixtures.ts` adds eight clubs (CS, Studio Arts, Culinary, Robotics, Chess, Climate Action, Film, and an unverified example), descriptions/categories, and five events. There are **nine clubs and seventeen events** total. Runtime adaptation remaps the old event club IDs to agree with GWC's fixture ID 1, replaces fictional venue names, removes external image dependencies, enriches event descriptions, and gives RSVP buttons local detail destinations. The local `/logo.png`, `/card.png`, `/ra.png`, `/hero.png`, and `/react.svg` assets are reused.

Dates are relative to the browser's current day at startup, retaining event durations and supplying both past and upcoming dates. This keeps captures populated in future semesters. These are demo schedules and descriptions, not actual campus information.

## Isolation and maintenance

- Both `import.meta.env.DEV` and the exact string flag `true` are required. The dynamic mock import is behind the compile-time DEV guard.
- Vite's dev middleware serves the installed MSW worker only when the flag is enabled. No worker is copied into `public/` or `dist/`.
- Production/staging builds eliminate the mock provider, handlers, new fixture data, and mock-only page branches even if `VITE_USE_MOCK_API=true` is set at build time. Original public demo files continue to be copied by Vite as before.
- The disabled path retains the configured API base, real AuthProvider, real redirects/token handling, and the existing page behavior. No env secrets or deployment files were changed.
- A mock startup failure stops startup with a console error; it never falls back to real authentication or a real backend.
- All mock implementation/data lives in `src/mocks/`, with small guarded adapters in `main.tsx`, `config.ts`, Club, Club Directory, and Event. Handlers derive from the actual current callers; no old stub API was restored.

## Validation

```bash
npm run build
npm run lint
npx playwright install chromium   # one-time browser setup
npm run test:mock
VITE_USE_MOCK_API=true npm run build -- --mode staging
```

The Playwright suite starts isolated mock and normal dev servers on ports 5174 and 5175. It checks all seven routes, images, console errors, external requests, search/navigation, memberships, modal/past events, sign-in/sign-out, form/image previews, handler contracts, and the original API/OIDC paths with mock mode disabled. Optional Google Fonts responses are stubbed to exercise rendering without internet. Screenshots are saved under ignored `test-results/`. If using a separately installed Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable.

Baseline before this change: build passed; lint reported 8 errors and 3 warnings in BackButton, EventModalContext, Home, club normalizers, and existing hook dependencies. Those unrelated issues are unchanged. The build's existing large-chunk warning remains.

Validated on this branch: **14/14 browser tests passed**, normal build/typecheck passed, staging build with the mock flag forced on passed, and the compiled JavaScript was byte-identical between those builds. Compiled assets contain no MSW implementation, demo auth token, design API path, new fixture data, or worker file. Targeted lint of new code and adapters passed; full lint retains the baseline findings. No stylesheet or existing public fixture was modified.

## Existing limitations preserved for capture

- Create Event is a static skeleton. There is no event creation/upload API call to mock.
- Create Club previews local files, but its submit handler only logs a payload and finishes. It does not save a club or upload to S3.
- Normal Event Detail is a hardcoded demo independent of the route ID. Only design mode loads the selected mock event into the existing components.
- Join/leave in the current staging code only logs messages. Design mode supplies handlers; the disabled path retains the original behavior.
- Home's MY CLUBS/GLOBAL tabs and every Club Detail currently share the global event endpoint. The mock does not invent missing per-club filtering; Home's Upcoming Events heading may include past events.
- Directory images are hardcoded placeholders, even though fixture logos are available on club details, event owners, and My Clubs.
- Home's My Clubs arrow points to Directory; clicking the club card itself opens the club. This existing navigation remains.
- Event modal URL query values do not restore a modal on page reload. Open a card to capture the modal.
- Existing Google Fonts stylesheets still use the internet. Without them the existing font fallbacks render; local content and API/auth functionality need no network. For exact font appearance, allow Google Fonts during capture.
- RSVP opens a local event detail page; it does not register an attendee. This is an in-memory design aid, not a fake backend.
