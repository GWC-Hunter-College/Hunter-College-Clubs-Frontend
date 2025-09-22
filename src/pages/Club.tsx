// ClubPage.tsx
import { Box, Container, Stack, Skeleton } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { default as ClubHeroCard } from "../components/ClubPage/ClubHero";
import EventList from "../components/Events/EventList";

// import placeholderLogo from "../assets/logo.png";

// unified Event type + normalizer func
import type { Event } from "../types/events";
import { fromJsonEvents } from "../types/events";

import type { Club } from "../types/club";
import { fromJsonClub } from "../types/club";

export default function ClubPage() {
  const [loading, setLoading] = useState(true);

  const [club, setClub] = useState<Club | null>(null);

  const [eventsAll, setEventsAll] = useState<Event[]>([]);
  const [view, setView] = useState<"Upcoming" | "Previous">("Upcoming");

  // load club and club events
  useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      // --- Fetch club info ---
      const resClub = await fetch("/data/demo-club.json");
      const jsonClub = await resClub.json();
      
      if (!cancelled) {
        const normalizedClub = fromJsonClub(jsonClub) 
        setClub(normalizedClub);
      }

      // --- Fetch events ---
      const resEvents = await fetch("/data/demo-event.json");
      const jsonEvents = await resEvents.json();

      if (!cancelled) {
        const normalizedEvents = fromJsonEvents(jsonEvents?.events);
        setEventsAll(normalizedEvents);
      }

    } catch (e) {
      console.error("Failed to load demo JSON", e);
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
          {club && <ClubHeroCard club={club} />}
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
