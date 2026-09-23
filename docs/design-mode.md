# Local frontend design mode

Design mode runs the whole app against in-memory MSW fixtures instead of the real backend, so
every screen and state can be built and verified without AWS credentials, a backend, or Cognito
settings. It changes no deployment workflow; production/staging builds always use the real
API/auth path (see [Isolation and maintenance](#isolation-and-maintenance)).

## Run

From the repository root, using Node 22.13+:

```bash
npm ci
VITE_USE_MOCK_API=true npm run dev:mock -- --host 127.0.0.1 --port 5173 --strictPort
```

Open **http://127.0.0.1:5173/** (localhost port 5173). Keep that hostname consistent while
browsing; MSW registers per origin. Existing real settings in `.env` are ignored by the mock
API/auth path.

For a persistent local preference, copy `.env.mock.example` to `.env.mock.local`, then run
`npm run dev:mock`. Do not overwrite an existing local env file. `.env.mock.local` is ignored by
Git. `npm run dev:mock` selects Vite's `mock` env files; the explicit `VITE_USE_MOCK_API=true`
flag is still required.

Stop the server with Ctrl+C. To return to the normal frontend, run `VITE_USE_MOCK_API=false npm
run dev` and reload the page. Reload after changing modes or roles. The mock worker only
intercepts clients that have explicitly started MSW; a normal page does not activate it.

## Routes and states

| Route | What to check |
| --- | --- |
| `/` | Hero (event-flyer strip, static dots) and the upcoming-events grid. |
| `/events` | Searchable agenda grouped by month/day; empty states for no match / nothing upcoming. |
| `/clubs` | Searchable grid of the 8 verified clubs (1 unverified club is excluded). |
| `/club/1` | Girls Who Code: eboard by default — Joined menu, Manage tab, drafts. |
| `/club/2` | Computer Science Club: member — no Manage tab, can leave. |
| `/club/3` | Studio Arts Collective: owner — no "Leave club" in the Joined menu. |
| `/club/5` | Robotics Club: not joined — "+ JOIN CLUB", a flyer-less upcoming event. |
| `/club/1?tab=board` / `?tab=announcements` / `?tab=manage` | The other three tabs. |
| `/event/13` | Girls Who Code Club Fair: multi-day, upcoming, extra gallery images, manager bar. |
| `/event/17` | Campus Sustainability Walk: cancelled (status pill, share-only actions). |
| `/event/14` | Robotics Open Build Lab: no flyer (tint-gradient cover). |
| `/event/20` | Spring Kickoff Social: past, with an extra photo. |
| `/my-clubs` | Stats, your clubs, and an agenda across them (signed in by default). |
| `/create` | Hub; the event option is enabled because the default persona manages clubs. |
| `/event/create` | Step 1: pick a managed club or resume the seeded "Hack Night" / "Portfolio Night" drafts. |
| `/club/1/event/new` | The event form and its live preview; add `?draft=30` to resume the Hack Night draft. |
| `/club/create` | The club form, its live preview, and the topic chips (max 3). |
| `/auth` | Existing auth debug screen, displaying clearly fake tokens and local sign-in/sign-out. |

## Authentication and state

`src/mocks/MockAuthProvider.tsx` supplies the same `react-oidc-context` context consumed by both
`useAuthInfo` and `/auth`. It never mounts the real AuthProvider or constructs a UserManager.
Sign-in, Google popup, and sign-out methods update local state without navigating to Cognito. The
representative user is Alex Rivera, `alex.rivera@example.test`; the access token is the literal
`design-only-access-token`, which has no real authority.

Set `VITE_MOCK_ROLE` when starting the dev server (or in `.env.mock.local`):

| Value | Initial state |
| --- | --- |
| `eboard` (default) | GWC e-board, CS member, Studio Arts owner. |
| `member` | GWC member, CS member, Studio Arts owner. |
| `owner` | GWC owner, CS member, Studio Arts owner. |
| `user` | Signed in, no memberships. |
| `guest` | Signed out; local sign-in reveals the representative member's clubs. |

Example: `VITE_USE_MOCK_API=true VITE_MOCK_ROLE=guest npm run dev:mock`. Signed-out visitors see
the sign-in gate on My Clubs, Create, and the create-flow pages; every other page stays
browsable, per the design.

These are club membership roles. The current frontend has no admin role or admin-only route; the
`admin.png` avatar asset does not indicate authorization.

Membership mutations, new drafts/events/clubs, and the selected persona's sign-in state all
persist across client-side navigation in the current tab, and all reset on reload (nothing is
sent to a server).

## API contracts and fixtures

`src/mocks/data.ts` builds the in-memory `clubs`/`events` arrays once per page load, adapting the
original `public/data/demo-*.json` fixtures and `src/mocks/fixtures.ts`'s additions.
`src/mocks/handlers.ts` serves every endpoint documented in [api.md](api.md) from those arrays,
mutating them in place for the two `POST` endpoints. `API_BASE_URL` is `/__design_api` in design
mode, independent of the real env value.

There are **9 clubs** (Girls Who Code + 8 fixture clubs, one of which is an unverified example)
and **22 events**, including:
- one multi-day event (Girls Who Code Club Fair, `/event/13`)
- one event with no flyer (Robotics Open Build Lab, `/event/14`)
- one cancelled event (Campus Sustainability Walk, `/event/17`)
- two drafts, visible only via their club's Manage tab or step 1 of New Event ("Hack Night" for
  GWC with no flyer, "Portfolio Night" for Studio Arts)
- past events spanning four semesters, so the Club page's semester grouping and "LOAD ... AND
  EARLIER" both have real data to show
- extra gallery images on the Club Fair event and two past events

Dates are relative to the browser's current day at startup. Images not in the redesign's asset
table (old `bit.ly` demo links, `react.svg`) are treated as absent, so `EventArt`/`ClubLogo`
render their tint-gradient fallback instead — this is what "flyer-less" fixtures like Robotics
Open Build Lab exercise. RSVP links are absolute `https://forms.gle/...` URLs; the Playwright
suite checks their `href` but never navigates to them.

## Isolation and maintenance

- Both `import.meta.env.DEV` and the exact string flag `true` are required. The dynamic mock
  import is behind the compile-time `DEV` guard.
- Vite's dev middleware serves the installed MSW worker only when the flag is enabled. No worker
  is copied into `public/` or `dist/`.
- Production/staging builds eliminate the mock provider, handlers, and fixture data even if
  `VITE_USE_MOCK_API=true` is set at build time.
- The disabled path retains the configured API base, real `AuthProvider`, real redirects/token
  handling, and normal-mode page behavior. No env secrets or deployment files were changed.
- A mock startup failure stops startup with a console error; it never falls back to real
  authentication or a real backend.
- All mock implementation/data lives in `src/mocks/`, with small guarded adapters in `main.tsx`
  and `config.ts`.

## Validation

```bash
npm run build
npm run lint
npx playwright install chromium   # one-time browser setup
npm run test:mock
VITE_USE_MOCK_API=true npm run build -- --mode staging
```

The Playwright suite (`tests/design-mode.spec.ts`) starts isolated mock and normal dev servers on
ports 5174 and 5175. It checks: every route renders with no console errors, no failed requests,
no external requests, and every image loaded; directory search and navigation; join/leave
persisting across SPA navigation via the Joined menu and its confirm modal, and resetting on
reload; owners can't leave; the event page's description, RSVP link, share popover (including the
copy-link button) and `.ics` download; past events and semester grouping; sign-out/sign-in in
mock auth with the club-create form and its logo preview; the signed-out gates on My Clubs and
the create flows; the full create-event (draft → resume → post) and create-club flows end to end,
each verified to show up where it should (Events, Home, the club page); the mock API contracts
for every endpoint including the two `POST` ones; a 390px-viewport pass over Home, Club, and
Event checking for no horizontal overflow and the mobile chrome; and the "disabled mode uses the
real API URL and OIDC provider" test. Optional Google Fonts responses are stubbed to exercise
rendering without internet. Screenshots are saved under ignored `test-results/`. If using a
separately installed Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable.

## Existing limitations

- "Edit event", "Cancel event", "More photos", and "Co-hosting clubs" all show a "This feature
  isn't available yet." notice when used — no backend endpoint is designed for any of them yet.
- Created events/clubs and membership changes are session-only: they reset on reload, same as
  before the redesign.
- Flyer and logo uploads are kept as in-memory `blob:` object URLs; there's no upload endpoint in
  design mode or the documented backend contract yet.
- Normal (non-mock) mode still builds and keeps today's working calls (clubs list, club detail,
  `/me/clubs`, join/leave, Cognito sign-in); the new screens aren't proven against a real backend.
