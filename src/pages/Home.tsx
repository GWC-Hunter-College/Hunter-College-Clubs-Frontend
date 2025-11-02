// import { Flex, Box, Stack } from "@mantine/core";
// import { Flex, Text, Divider, Box} from "@mantine/core";
import { Flex, Box} from "@mantine/core";
import MyClubs from "../components/Other/MyClubs";
import ToClubDirectory from "../components/HomePage/ToClubDirectoryButton"
import Heading from "../components/HomePage/Heading"
import Hero from "../components/HomePage/Hero"
import { Container, Stack, Skeleton } from "@mantine/core";
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

import { COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from "../config";

export default function Home() {
  const auth = useAuth();
  const user = auth.user;
  const email = user?.profile.email;

  const signOutRedirect = () => {
      auth.signoutRedirect({
        post_logout_redirect_uri: COGNITO_REDIRECT_URI,
        extraQueryParams: {
          client_id: COGNITO_CLIENT_ID,
          logout_uri: COGNITO_REDIRECT_URI,
        },
      });
    };

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
    <Flex gap="5rem" direction="column" align="stretch" style={{ paddingTop: "3.5rem" }} > 

      <Flex gap="3rem" direction="row" align="stretch" >

        <Flex direction="row" gap="2rem">
          <Heading />
          <Hero  email={email}
        signedIn={!!user}
        onSignIn={() => auth.signinRedirect?.()}
        onSignOut={signOutRedirect}
  />
        </Flex>

        <Flex gap= "2rem" direction="column" align='stretch'>
          <MyClubs />
          <ToClubDirectory />
        </Flex>

      </Flex>


      {/* Micahel you work here */}
      <Box py="lg">
        <EventList
          title="Upcoming Events"
          views={["MY CLUBS", "GLOBAL"]} 
          onChangeView={(v) => setView(v as "MY CLUBS" | "GLOBAL")}
          events={events}
        />
      </Box>
    </Flex>
  );
}
