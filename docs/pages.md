# Pages (Routes)

This doc describes each route-level page: purpose, data flow, and the API endpoints it calls.

## `/` Home
File: `src/pages/Home.tsx`

Purpose:
- Landing or dashboard view
- Shows upcoming events
- Shows the “My Clubs” sidebar

Data:
- `GET /me/clubs` (authenticated, Bearer token)
- `GET /events` (unauthenticated)

Key components used:
- `src/components/HomePage/Hero.tsx`
- `src/components/HomePage/Heading.tsx`
- `src/components/Other/MyClubs.tsx`
- `src/components/Events/EventList.tsx`

Notes:
- The page maintains “MY CLUBS” vs “GLOBAL” view state. If you want club-scoped events, add a backend endpoint like `GET /me/events` or `GET /clubs/:id/events` and update the page.

## `/clubs` Club Directory
File: `src/pages/ClubDirectory.tsx`

Purpose:
- Browse clubs, search, and show club cards in a grid

Data:
- `GET /clubs?verified=true` (unauthenticated)

Key components used:
- `src/components/ClubPage/SearchBar.tsx`
- `src/components/ClubPage/FeaturedClubCard.tsx`

Notes:
- Filters beyond verified and search can be added in the directory page and `SearchBar` component.

## `/club/:clubId` Club Detail
File: `src/pages/Club.tsx`

Purpose:
- Show a single club’s details
- Allow membership join or leave for signed-in users

Data:
- `GET /clubs/:clubId` (unauthenticated)
- `GET /me/clubs` (authenticated, used to infer membership role)
- `POST /clubs/:clubId/members/me` (authenticated, join)
- `DELETE /clubs/:clubId/members/me` (authenticated, leave)
- `GET /events` (currently fetched by the page)

Key components used:
- `src/components/ClubPage/FeaturedClubCard.tsx`

Notes:
- The join handler will prompt sign-in if the user is not authenticated.
- Membership state is managed client-side using the auth token and role inference.

## `/event/:eventId` Event Detail
File: `src/pages/Event.tsx`

Purpose:
- Show details for a single event

Status:
- Currently demo or stub.

Future wiring:
- Add `GET /events/:eventId` and wire the page to it.

Key components used:
- `src/components/EventPage/EventHero.tsx`
- `src/components/EventPage/EventHeader.tsx`
- `src/components/EventPage/EventDetails.tsx`

## `/club/create` Club Create
File: `src/pages/ClubCreate.tsx`

Purpose:
- Create a club (UI exists as WIP)

Status:
- WIP UI.

Key components used:
- `src/components/ClubCreate/ClubFormPanel.tsx`

Future wiring:
- Add `POST /clubs` (authenticated) and form validation.
- Add image upload if needed.

## `/event/create` Event Create
File: `src/pages/EventCreate.tsx`

Purpose:
- Create an event

Status:
- Placeholder or WIP.

Future wiring:
- Add `POST /events` (authenticated), or `POST /clubs/:clubId/events` if events are club-scoped.

## `/auth` Auth Debug
File: `src/pages/Auth.tsx`

Purpose:
- Dev page to inspect auth status and tokens.

Notes:
- Avoid displaying raw tokens in production builds.
