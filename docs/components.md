# Components

This doc catalogs the major reusable components and shared context.
It’s meant to answer: where to add or change UI for a given feature.

## Layout and navigation

### PageShell
File: `src/components/Other/PageShell.tsx`

Role:
- Shared page layout wrapper.
- Handles standard header and content framing.

Used by:
- Most route-level pages.

Related:
- `src/components/Other/PageHeader.tsx`

### BackButton
File: `src/components/Other/BackButton.tsx`

Role:
- Consistent back navigation control used in page headers.

## Home page components

### Hero
File: `src/components/HomePage/Hero.tsx`

Role:
- Home hero section layout.

### Heading
File: `src/components/HomePage/Heading.tsx`

Role:
- Home page heading and title styling.

### Section
File: `src/components/HomePage/Section.tsx`

Role:
- Shared section layout used by multiple Home and Events components.

### View
File: `src/components/HomePage/View.tsx`

Role:
- View switcher UI used for toggling between labels like “MY CLUBS” and “GLOBAL”.

### ToClubDirectoryButton
File: `src/components/HomePage/ToClubDirectoryButton.tsx`

Role:
- Navigation CTA to the club directory route.

### MyClubs
File: `src/components/Other/MyClubs.tsx`

Role:
- Renders the user’s clubs list.

Data expectations:
- Typically receives club data from the parent page.
- The parent page is responsible for fetching `GET /me/clubs` using the access token.

## Club components

### SearchBar
File: `src/components/ClubPage/SearchBar.tsx`

Role:
- Search input for the club directory.

Extension points:
- Add category, tag, or verified filters here.

### FeaturedClubCard
File: `src/components/ClubPage/FeaturedClubCard.tsx`

Role:
- Club card component used for directory and club detail presentation.
- Supports optional action controls (join or leave) when supplied by the page.

## Event components

### EventList
File: `src/components/Events/EventList.tsx`

Role:
- Renders events grouped by month.
- Supports view tabs and calls `openEvent` when an event is selected.

Related:
- `src/components/Events/EventCard.tsx`

### Event modal context
File: `src/context/EventModalContext.tsx`

Role:
- Shared state for opening and closing the event modal.

Used by:
- `EventList` and event modal presentation components.

## Types and normalization

### Types folder
Folder: `src/types/`

Role:
- Shared TypeScript types and normalization helpers.

Files:
- `auth.ts` auth normalization and `useAuthInfo`
- `club.ts` club types
- `events.ts` event types and parsing helpers

Recommendation:
- Keep a single “source of truth” type for each domain model, and normalize API payloads into those types before rendering.
