// ClubPage.tsx
import { Box, Container, Stack, Skeleton } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { default as ClubHeroCard } from "../components/ClubPage/ClubHero";
import EventList from "../components/Events/EventList";

import placeholderLogo from "../assets/logo.png";

// unified Event type + normalizer func
import type { Event } from "../types/events";
import { fromJsonEvents } from "../types/events";

// --- club hero props (probs placholder??) ---
type Club = {
  name: string;
  logo: string;
  description: string;
  tags: string[];
};

export default function ClubPage() {
  const [loading, setLoading] = useState(true);
  const [eventsAll, setEventsAll] = useState<Event[]>([]);
  const [view, setView] = useState<"Upcoming" | "Previous">("Upcoming");

  const club: Club = {
    name: "Girls Who Code",
    logo: placeholderLogo,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: [],
  };

  // Load demo events once -> normalize to canonical Event[]
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/demo-event.json");
        const json = await res.json();
        if (cancelled) return;

        // file shape: { events: [...] }
        const normalized = fromJsonEvents(json?.events);
        setEventsAll(normalized);
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

  // Helpers (day-based comparisons)
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const dateOnlyGTE = (aIso: string, bDate: Date) =>
    startOfDay(new Date(aIso)).getTime() >= startOfDay(bDate).getTime();

  // Partition by END DAY: if event ends today or later → Upcoming
  const { upcoming, previous } = useMemo(() => {
    const now = new Date();
    const up: Event[] = [];
    const prev: Event[] = [];

    for (const ev of eventsAll) {
      const endIso = ev.end ?? ev.start;
      if (dateOnlyGTE(endIso, now)) up.push(ev);
      else prev.push(ev);
    }

    // Sorts
    up.sort((a, b) => +new Date(a.start) - +new Date(b.start));   // soonest first
    prev.sort((a, b) => +new Date(b.start) - +new Date(a.start)); // most recent first
    return { upcoming: up, previous: prev };
  }, [eventsAll]);

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
      {/* ==== Section 1: Hero (unchanged layout) ==== */}
      <Box px={{ base: "md", sm: "lg" }} py="lg">
        <Box maw={1100} w="100%">
          <ClubHeroCard
            name={club.name}
            logo={club.logo}
            description={club.description}
            tags={club.tags}
          />
        </Box>
      </Box>

      {/* ==== Section 2: Events (same controls) ==== */}
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
