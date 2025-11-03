import { Box, Container, Stack, Skeleton, Anchor, Space, Title, Button } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventList from "../components/Events/EventList";
import FeaturedClubCard from "../components/ClubPage/FeaturedClubCard";
import { API_BASE_URL } from "../config";
import placeholderLogo from "../assets/placeholder.png";

import type { Event } from "../types/events";
import { fromJsonEvents } from "../types/events";
import type { Club } from "../types/club";
import { fromJsonClub } from "../types/club";

import { useAuthInfo } from "../types/auth";
import PageHeader from "../components/Other/PageHeader";

export default function ClubPage() {
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [eventsAll, setEventsAll] = useState<Event[]>([]);
  const [view, setView] = useState<"Upcoming" | "Previous">("Upcoming");

  const { clubId } = useParams<{ clubId: string }>();
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const authInfo = useAuthInfo();

  // load club and club events
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let clubData = null;

        // --- Fetch club info ---
        try {
          const res = await fetch(`${API_BASE_URL}/clubs/${clubId}`);
          const json = await res.json();

          if (json.club) {
            clubData = json.club;
            console.log(`✅ Loaded club ${clubData.name} from API`);
          }
        } catch (err) {
          console.warn("⚠️ API fetch failed", err);
        }
        if (!clubData) {
          setError("Club not found");
          return;
        }
        // ✅ Ensure placeholder logo if missing
        if (clubData) {
          clubData.image = placeholderLogo;
        }

        if (!cancelled && clubData) {
          const normalizedClub = fromJsonClub(clubData);
          setClub(normalizedClub);
        }

        // Load demo events
        const resEvents = await fetch("/data/demo-event.json");
        const jsonEvents = await resEvents.json();

        if (!cancelled) {
          const normalizedEvents = fromJsonEvents(jsonEvents?.events);
          setEventsAll(normalizedEvents);
        }
      } catch (e) {
        console.error("❌ Failed to load club page", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clubId]);

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
    up.sort((a, b) => +new Date(a.start) - +new Date(b.start));
    prev.sort((a, b) => +new Date(b.start) - +new Date(a.start));
    return { upcoming: up, previous: prev };
  }, [eventsAll]);

  const filtered = view === "Upcoming" ? upcoming : previous;
  if (error) {
    return (
      <Container py="xl">
        <Title order={2} c="red.4" mb="md">
          {error}
        </Title>
        <Button
          variant="subtle"
          onClick={() => navigate(-1)}
          leftSection="←"
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  // === Loading skeleton ===
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

  // === Main page ===
  return (
    <Box mih="100dvh">
      {/* ==== Section 1: Hero ==== */}
      <Box px={{ base: "md", sm: "lg" }} py="lg">
          <PageHeader
            pageTitle={`CLUB-${clubId}`}
            back={{ size: "md" }}
            user={{ auth: authInfo}}
            titleSize="md"
            titleTone="muted"
          />
        <Box maw={1100} w="100%">

          <Space h="md" />

          {/* Club Info */}
          {club ? (
            <FeaturedClubCard club={club} />
          ) : (
            <div style={{ height: 200 }} /> // placeholder avoids hook order changes
          )}
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
