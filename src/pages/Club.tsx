// ClubPage.tsx
import { Box, Container, Stack, Skeleton } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { default as ClubHeroCard } from "../components/ClubPage/ClubHero";
import EventList from "../components/Events/EventList";

// 👇 uses the same asset you had before for the club logo
import placeholderLogo from "../assets/logo.png";

// --- helpers ---
type DemoEvent = {
  id: number;
  title: string;
  location: string;
  rsvpLink: string;
  status: string;
  startDate: string; // "YYYY-MM-DD HH:mm:ss"
  endDate: string;   // "YYYY-MM-DD HH:mm:ss"
  thumbnailUrl: string;
  owners?: {
    owner?: { id: number; thumbnailUrl?: string };
    associates?: Array<{ id: number; thumbnailUrl?: string }>;
  };
};

// This is the shape EventList expects
type UiEvent = {
  id: string;
  title: string;
  location: string;
  start: string; // ISO
  end: string;   // ISO
  flyer: string;
  logo: string;
  // month: string; // can remain (unused by child) or remove if you prefer
  altText?: string;
};

// Safely turn "YYYY-MM-DD HH:mm:ss" into a real ISO date for Date()
const toIso = (s: string) => s.replace(" ", "T");

// // "SEPTEMBER 2025"
// const monthLabel = (iso: string) => {
//   const d = new Date(iso);
//   return `${d.toLocaleString("en-US", { month: "long" }).toUpperCase()} ${d.getFullYear()}`;
// };

// --- (new) club hero props (same shape you used before) ---
type Club = {
  name: string;
  logo: string;
  description: string;
  tags: string[];
};

export default function ClubPage() {
  const [loading, setLoading] = useState(true);
  const [rawEvents, setRawEvents] = useState<DemoEvent[]>([]);
  const [view, setView] = useState<"Upcoming" | "Previous">("Upcoming");

  // Minimal club info for the hero (matches your previous usage)
  const club: Club = {
    name: "Girls Who Code",
    logo: placeholderLogo,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: [],
  };

  // Load demo events once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/demo-event.json");
        const json = await res.json();
        if (!cancelled) setRawEvents(json.events ?? []);
      } catch (e) {
        console.error("Failed to load demo-event.json", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Map demo → UI shape once
  const allUiEvents: UiEvent[] = useMemo(() => {
    return (rawEvents ?? []).map((e) => {
      const startIso = toIso(e.startDate);
      const endIso = toIso(e.endDate);

      // Prefer the club owner logo if present; fall back to the card image
      const logo = e.owners?.owner?.thumbnailUrl ?? "/logo.png";
      const flyer = e.thumbnailUrl ?? "/card.png";

      return {
        id: String(e.id),
        title: e.title,
        location: e.location,
        start: startIso,
        end: endIso,
        flyer,
        logo,
        // month: monthLabel(startIso),
        altText: e.title,
      };
    });
  }, [rawEvents]);

  // Helpers (day-based comparisons)
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const dateOnlyGTE = (aIso: string, bDate: Date) =>
    startOfDay(new Date(aIso)).getTime() >= startOfDay(bDate).getTime();

  // Partition by END DAY (your new rule): if the event ends today or later → Upcoming
  const { upcoming, previous } = useMemo(() => {
    const now = new Date();
    const up: UiEvent[] = [];
    const prev: UiEvent[] = [];

    for (const ev of allUiEvents) {
      if (dateOnlyGTE(ev.end ?? ev.start, now)) up.push(ev);
      else prev.push(ev);
    }

    // Sorts
    up.sort((a, b) => +new Date(a.start) - +new Date(b.start)); // soonest first
    prev.sort((a, b) => +new Date(b.start) - +new Date(a.start)); // most recent first
    return { upcoming: up, previous: prev };
  }, [allUiEvents]);

  const filtered = view === "Upcoming" ? upcoming : previous;

  if (loading) {
    return (
      <Container py="lg">
        <Stack gap="md">
          <Skeleton h={50} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={60} radius="md" />
        </Stack>
      </Container>
    );
  }

  return (
    <Box mih="100dvh">
      {/* ==== Section 1: Hero (restored, same centering/spacing as before) ==== */}
      <Box px={{ base: "md", sm: "lg" }} py="lg">
        {/* NOTE: no mx="auto" here, so it won't be centered edge-to-edge */}
        <Box maw={1100} w="100%">
          <ClubHeroCard
            name={club.name}
            logo={club.logo}
            description={club.description}
            tags={club.tags}
          />
        </Box>
      </Box>

      {/* ==== Section 2: Events ==== */}
      <Box py="lg">
        <EventList
          title="Club Events"
          views={["Upcoming", "Previous"]}
          onChangeView={(v) => setView(v as "Upcoming" | "Previous")}
          events={filtered}
        />
      </Box>
    </Box>
  );
}
