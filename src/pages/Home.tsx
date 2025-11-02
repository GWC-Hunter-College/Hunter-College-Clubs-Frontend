// import { Flex, Box, Stack } from "@mantine/core";
// import { Flex, Text, Divider, Box} from "@mantine/core";
import { Grid, Container, Stack, Skeleton, SimpleGrid, Box } from "@mantine/core"; // add Grid, keep existing
import MyClubs from "../components/Other/MyClubs";
import ToClubDirectory from "../components/HomePage/ToClubDirectoryButton"
import Heading from "../components/HomePage/Heading"
import Hero from "../components/HomePage/Hero"
// import EventCard from "../components/HomePage/EventCard"
// import Section from "../components/HomePage/Section"
// import View from "../components/HomePage/View"
// import logo from "../assets/logo.png";
// import flyer from "../assets/card.png"; 
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "react-oidc-context";
import type { Event } from "../types/events";
import { fromJsonEvents } from "../types/events";

import EventList from "../components/Events/EventList";

import { signOutRedirect } from "../types/auth";

export default function Home() {
  const auth = useAuth();
  const user = auth.user;
  const email = user?.profile.email;

  const [globalEvents, setGlobalEvents] = useState<Event[]>([]);
  const [myClubEvents, setMyClubEvents] = useState<Event[]>([]);
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
    <Container fluid style={{ paddingTop: "3.5rem" }}>
      <Grid gutter="2rem" align="flex-start">
        {/* Row 1 (small): Heading 3/12 + Hero 9/12 */}
        <Grid.Col span={{ base: 3, md: 2, lg: 1 }}>
          <Heading />
        </Grid.Col>

        <Grid.Col span={{ base: 9, md: 7, lg: 8 }}>
          <Box style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 16 }}>
            <Hero
              email={email}
              signedIn={!!user}
              onSignIn={() => auth.signinRedirect()}
              onSignOut={() => signOutRedirect(auth)}
            />
          </Box>
        </Grid.Col>

        {/* Row 2 (small): right rail becomes its own row; md+: fixed 3/12 */}
        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <SimpleGrid cols={{ base: 2, md: 1 }} spacing="1.25rem">
            <MyClubs />
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
    </Container>
  );
}