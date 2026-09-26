# Pages (Routes)

This doc describes each route-level page: purpose, data flow, and the API endpoints it calls.
Routes are declared in `src/App.tsx`. The app shell (top nav/footer on desktop, top bar/tab bar
on mobile) wraps every page below via `src/components/shell/AppShell.tsx`.

## `/` Home
File: `src/pages/Home.tsx`

Purpose:
- Hero with a static strip of the next few upcoming events' flyers
- Grid of upcoming events ("Happening at Hunter CS"), sorted by start date

Data:
- `GET /events` (unauthenticated), filtered client-side to non-draft, non-cancelled, upcoming

Key components: `src/components/Home/Hero.tsx`, `src/components/ui/EventTile.tsx`

## `/events` Events
File: `src/pages/Events.tsx`

Purpose:
- Searchable agenda of every upcoming event, grouped by month and day

Data:
- `GET /events` (unauthenticated)
- `GET /clubs?verified=true` (unauthenticated), to resolve each event's host club name/logo

Key components: `src/components/ui/EventRow.tsx`, `src/components/ui/Agenda.tsx`

## `/clubs` Clubs
File: `src/pages/Clubs.tsx`

Purpose:
- Browse verified clubs, search by name or topic

Data:
- `GET /clubs?verified=true` (unauthenticated)

Key components: `src/components/ui/ClubCard.tsx`

## `/club/:clubId` Club
File: `src/pages/Club.tsx`

Purpose:
- Club header (logo, membership control, stats, role, bio, tags)
- Tabs: Events (upcoming + past, grouped by semester), Board (coming soon), Announcements
  (coming soon), Manage (eboard/owner only — drafts and upcoming events with status)

Data:
- `GET /clubs/:clubId` (unauthenticated)
- `GET /clubs/:clubId/events` (unauthenticated; includes drafts — the page filters those out of
  its public tabs itself and shows them only in Manage)
- `GET /me/clubs` (authenticated), to derive the viewer's role
- `POST` / `DELETE /clubs/:clubId/members/me` (authenticated), join/leave

Key components: `src/components/Club/ClubHeader.tsx`, `Tabs.tsx`, `EventsTab.tsx`, `BoardTab.tsx`,
`ManageTab.tsx`

## `/event/:eventId` Event
File: `src/pages/Event.tsx`

Purpose:
- Gallery (flyer + extra images), host, status (past/cancelled), when/where, actions
  (RSVP/add-to-calendar/share for upcoming; view-photos/share for past; share-only for
  cancelled), about, and a manager bar (eboard/owner of the host club) with edit/cancel
  (both show a "not available yet" notice — no backend endpoint exists for either)

Data:
- `GET /events/:eventId` (unauthenticated)
- `GET /clubs/:clubId` (unauthenticated), for the host club's name/logo
- `GET /me/clubs` (authenticated), to show the manager bar when applicable

Key components: `src/components/Event/Gallery.tsx`, `WhenWhereCard.tsx`, `ManagerBar.tsx`,
`SharePopover.tsx`

## `/my-clubs` My Clubs
File: `src/pages/MyClubs.tsx`

Purpose:
- Signed in: stat cards, a grid of your clubs (with each one's next event and role), and a
  searchable agenda of upcoming events across all your clubs
- Signed out: a blurred-preview sign-in gate (`src/components/ui/Gate.tsx`)

Data:
- `GET /me/clubs` (authenticated)
- `GET /me/events` (authenticated)

## `/create` Create hub
File: `src/pages/Create.tsx`

Purpose:
- Two options: start a club, or post an event (disabled, with a caption, if the viewer manages
  no clubs)
- Signed out: sign-in gate

Data:
- `GET /me/clubs` (authenticated), to decide whether the event option is enabled

## `/event/create` New event, step 1
File: `src/pages/EventCreateStep1.tsx`

Purpose:
- Pick a club the viewer owns or is e-board of (preselected when there's only one), or resume a
  draft from any of those clubs
- Signed out: sign-in gate

Data:
- `GET /me/clubs` (authenticated)
- `GET /clubs/:clubId/events` (unauthenticated) per managed club, filtered to drafts

## `/club/:clubId/event/new` New event form
File: `src/pages/EventForm.tsx`

Purpose:
- Basics, when/where, flyer (dropzone), locked options (more photos, co-hosting — both show a
  "not available yet" notice), details, and a live preview that mirrors the posted result
- `?draft=:eventId` prefills the form from an existing draft
- Signed out: sign-in gate; signed in but not a manager of this club: access-denied panel

Data:
- `GET /clubs/:clubId` (unauthenticated)
- `GET /me/clubs` (authenticated), to check the viewer manages this club
- `GET /clubs/:clubId/events` (unauthenticated), to load a draft when `?draft=` is present
- `POST /clubs/:clubId/events` (authenticated) — Save Draft or Post Event

## `/club/create` New club
File: `src/pages/ClubForm.tsx`

Purpose:
- Basics, logo (dropzone), topics (up to three), and a live "how it looks on Discover" preview
- Signed out: sign-in gate

Data:
- `POST /clubs` (authenticated) — creates the club and makes the viewer its owner

## `/auth` Auth Debug
File: `src/pages/Auth.tsx`

Unchanged by the redesign. Dev-only page to inspect auth status and tokens; avoid displaying raw
tokens in production builds.
