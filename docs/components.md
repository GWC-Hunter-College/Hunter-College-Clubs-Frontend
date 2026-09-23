# Components

This doc catalogs the major reusable components. It's meant to answer: where to add or change
UI for a given feature. Everything under `src/components/ui/` is styled from the design tokens
in `src/styles/tokens.css` and `src/styles/text.css` — see those files (and the redesign spec,
not shipped in this repo — see the PR description) for the source values.

## App shell
Folder: `src/components/shell/`

- **AppShell** — top-level layout: desktop top nav + footer (≥1024px) or mobile top bar + fixed
  bottom tab bar (<1024px). Does **not** own `ShellProvider`; that wraps the router in `App.tsx`
  instead, because pages call the hooks below from their own top level, as a sibling of the
  `<AppShell>` they render, not a descendant of a provider `AppShell` would create.
- **ShellContext** / **context.ts** / **useShell.ts** — shared state for the mobile top bar mode
  (section vs. detail-with-back/title/share), the active-nav override, and whether the mobile
  tab bar is hidden (the Event page swaps it for its own fixed action bar). Pages call
  `useMobileDetailHeader`, `useNavOverride`, and `useHideMobileTabBar` from `useShell.ts`.
- **TopNav** / **Footer** / **MobileTopBar** / **MobileTabBar** — the chrome itself.
- **destinations.tsx** — the five nav destinations and `navKeyForPath`, the default
  active-destination rule from the current path (pages override it via `useNavOverride` when the
  rule can't be derived from the path alone, e.g. the Club page highlighting My Clubs for
  members).

## Design-system components
Folder: `src/components/ui/`

- **Button** (`Button.tsx`) — the five button variants (primary/secondary/outline/ghost/danger)
  in three sizes, plus `IconButton` (circle, outline/ghost/glass/filled). Renders a `<Link>`,
  `<a>`, or `<button>` depending on whether `to`/`href` is passed.
- **Pills** — `ChipTag`, `ChipFilter`, `StatusPill`, `SoonPill`, `EboardPill`, `CountPill`,
  `RoleLabel`, `RoleDot`.
- **ClubLogo** / **EventArt** — square images with fallbacks: a tint-gradient monogram for a
  club with no logo (`src/lib/clubTint.ts` picks the tint deterministically by club id), and a
  tint-gradient cover (with the title overlaid) for an event with no flyer.
- **Inputs** (`Inputs.tsx`) — `SearchField`, `Field`, `TextareaField`, `Dropzone`,
  `LockedOptionRow` (expands to a "not available yet" notice).
- **Breadcrumb** / **PageHeader** / **SectionHeader** — desktop breadcrumb, section-page header
  (eyebrow/title/subtitle), and in-page section headers.
- **EventTile** / **EventRow** / **PastEventRow** / **Agenda** (`MonthHeader`, `SemesterHeader`,
  `AgendaDay`, `MobileDayGroup`) — the event card/row family and the date-grouping shells used by
  Home, Events, the Club page, and My Clubs.
- **ClubCard** / **MyClubCard** / **StatCard** — club directory card, "your clubs" card, and the
  stat cards on My Clubs.
- **Gate** — the signed-out blurred-preview + sign-in card, used by My Clubs, Create, and the
  create-flow pages. Callers pass a `preview` node built from public data or static placeholder
  content — never fetch private data for it.
- **ComingSoonPanel** / **ConfirmModal** — empty/coming-soon states (Board, Announcements, no
  results) and the reusable confirm dialog (leave club).
- **PageContainer** — the centered content column (max-width 1248px, responsive gutters/padding).

## Page-specific components
- `src/components/Home/Hero.tsx` — the Home hero (brand spine, pitch, event-flyer strip).
- `src/components/Club/` — `ClubHeader`, `Tabs`, `EventsTab`, `BoardTab`, `ManageTab`.
- `src/components/Event/` — `Gallery`, `WhenWhereCard`, `ManagerBar`, `SharePopover`.
- `src/components/Create/` — `OptionCard` (the Create hub's two cards).

## Hooks
Folder: `src/hooks/` — one hook per resource, each a thin `fetch` + normalize wrapper: `useClub`,
`useClubs`, `useClubEvents`, `useClubsById`, `useEvent`, `useEvents`, `useMembership`,
`useMyClubs`, `useMyEvents`, `useMyDrafts`.

## Framework-free helpers
Folder: `src/lib/` — `datetime.ts` (all the date/time formats the designs use), `ics.ts` (.ics
generation and download), `share.ts` (clipboard/mailto/native share), `clubTint.ts` (deterministic
club tint + monogram initials), `timezone.ts` (reads a typed date/time as America/New_York
wall-clock time regardless of the browser's own timezone, so the create-event form's live
preview always matches what gets posted).

## Types and normalization
Folder: `src/types/`

- `auth.ts` — auth normalization and `useAuthInfo`
- `club.ts` — `Club` type, `fromJsonClub`/`fromJsonClubs`
- `events.ts` — `Event` type, `fromJsonEvent`/`fromJsonEvents`, `isUpcoming`

Keep a single "source of truth" type for each domain model, and normalize API payloads into
those types before rendering.
