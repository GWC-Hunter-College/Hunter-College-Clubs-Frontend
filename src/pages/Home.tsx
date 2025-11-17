// Home.tsx
import { Grid, Container, Stack, Skeleton, SimpleGrid, Box } from "@mantine/core"; // add Grid, keep existing
import MyClubs from "../components/Other/MyClubs";
import ToClubDirectory from "../components/HomePage/ToClubDirectoryButton"
import Heading from "../components/HomePage/Heading"
import Hero from "../components/HomePage/Hero"
import PageShell from "../components/Other/PageShell";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthInfo } from "../types/auth";


import type { Event } from "../types/events";
import { fromJsonEvents } from "../types/events";

import EventList from "../components/Events/EventList";

export default function Home() {
  const authInfo = useAuthInfo();
  const navigate = useNavigate();

  const [globalEvents, setGlobalEvents] = useState<Event[]>([]);
  const [myClubEvents, setMyClubEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [view, setView] = useState<"MY CLUBS" | "GLOBAL">("MY CLUBS");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    let cancelled = false;
    (async () => {
      try {
        const global = await fetch("/data/demo-event.json");
        const myClubs = await fetch("/data/demo-event-me.json");

        const globalJson = await global.json();
        const myClubsJson = await myClubs.json();

        if (cancelled) {
          return;
        }

        // file shape: { events: [...] }
        const globalJsonNormalized = fromJsonEvents(globalJson?.events);
        const myClubsJsonNormalized = fromJsonEvents(myClubsJson?.events);

        setGlobalEvents(globalJsonNormalized);
        setMyClubEvents(myClubsJsonNormalized);
      } catch (e) {
        console.error("Failed to load demo-event.json", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [])

  // Fetch clubs for MyClubs component
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me/clubs");
        const json = await res.json();
        if (cancelled) return;

        const data = Array.isArray(json) ? json : json?.clubs ?? json;
        setClubs(Array.isArray(data) ? data : [data].filter(Boolean));
      } catch (e) {
        console.error("Failed to fetch /me/clubs", e);
        setClubs([]);
      } finally {
        if (!cancelled) setLoadingClubs(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleClubClick = (club: any) => {
    navigate(`/club/${club.id}`);
  };

  const handleDirectoryClick = () => {
    navigate(`/clubs`);
  };

  const handleCreateClub = () => {
    navigate("/club/create");
  };

  const { events } = useMemo(() => {
    const events = view === "MY CLUBS" ? myClubEvents : globalEvents;
    return { events };
  }, [myClubEvents, globalEvents, view])

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
    <PageShell showHeader={false} size="xxxl" padded>
      <Grid gutter="2rem" align="stretch">
        {/* Row 1 (small): Heading 3/12 + Hero 9/12; md/lg keep your 2/7/1 -> 8/3 split */}
        <Grid.Col span={{ base: 3, md: 2, lg: 1 }}>
          <Heading />
        </Grid.Col>

        {/* Make this column stretch to the tallest sibling and let Hero fill it */}
        <Grid.Col span={{ base: 9, md: 7, lg: 8 }} style={{ display: "flex" }}>
          {/* Wrapper makes the child fill column height */}
          <Box style={{ flex: 1, minHeight: 0 }}>
            <Hero
              auth={authInfo}
              // title="Member"
            />
          </Box>
        </Grid.Col>

        {/* Right rail becomes its own row on small; stacks on md+ */}
        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <SimpleGrid cols={{ base: 2, md: 1 }} spacing="1.25rem">
            <MyClubs clubs={clubs} loading={loadingClubs} onClubClick={handleClubClick} onDirectoryClick={handleDirectoryClick} onCreateClub={handleCreateClub} isSignedIn={authInfo?.signedIn} />
            <ToClubDirectory />
          </SimpleGrid>
        </Grid.Col>
      </Grid>

      <Box py="lg">
        <EventList
          title="Upcoming Events"
          views={["MY CLUBS", "GLOBAL"]}
          onChangeView={(v) => setView(v as "MY CLUBS" | "GLOBAL")}
          events={events}
        />
      </Box>
    </PageShell>
  );

}