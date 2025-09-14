// ClubPage.tsx
import { Box, Container, Stack, Skeleton, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClubHeroCard from "../components/ClubPage/ClubHero";
import EventList from "../components/Events/EventList";

import placeholderLogo from "../assets/logo.png";
import flyer from "../assets/card.png";
// import flyer2 from "../assets/card.png";
import flyer2 from "../assets/hero.png";
import flyer3 from "../assets/react.svg";
import logo from "../assets/logo.png";


type Club = {
  name: string;
  logo: string;
  description: string;   // keep this
  tags: string[];
};

type IncomingClubEvent = {
  id: number | string;
  title: string;
  location: string;
  rsvpLink: string;
  status: "posted" | "draft" | string;
  startDate: string; // "YYYY-MM-DD HH:mm:ss"
  endDate: string;   // "YYYY-MM-DD HH:mm:ss"
  // Support both spellings just in case:
  thumbnailURL?: string;
  thumbnailUrl?: string;
  owners?: EventOwners;
};

type ClubRef = { id: number | string; thumbnailUrl?: string };
type EventOwners = { owner: ClubRef; associates: ClubRef[] };

export default function ClubPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState<Club | null>(null);
    const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    setClub({
      name: "Girls Who Code",
      logo: placeholderLogo,
      description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      tags: [],
    });
    // setClub(null);
}, []);

  useEffect(()=>{
     // match the file you actually have
  const url = (import.meta.env.BASE_URL ?? "/") + "data/demo-event.json";
  console.log("[Club] fetching:", url);

  fetch(url)
    .then((res) => {
      console.log("[Club] status:", res.status, res.headers.get("content-type"));
      // Guard: ensure it’s JSON, not HTML fallback
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        throw new Error(`Bad response for ${url}: ${res.status} ${ct}`);
      }
      return res.json();
    })
    .then((data: { events: IncomingClubEvent[] }) => {
      const parseLocal = (s: string) => new Date(s.replace(" ", "T"));
      const monthKey = (d: Date) =>
        d.toLocaleString(undefined, { month: "long", year: "numeric" }).toUpperCase();

      const mapped = (data?.events ?? []).map((c) => {
        const s = parseLocal(c.startDate);
        const e = parseLocal(c.endDate);
        return {
          id: String(c.id),
          title: c.title,
          location: c.location,
          start: s.toISOString(),
          end: e.toISOString(),
          flyer: c.thumbnailUrl,
          // flyer: flyer2,
          logo: c.owners?.owner?.thumbnailUrl,
          // logo: logo,
          month: monthKey(s),
          altText: c.title,
        };
      });

      console.log("[Club] mapped events:", mapped);
      setEvents(mapped);
    })
    .catch((err) => {
      console.error("[Club] failed to load demo-event.json:", err);
      setEvents([]);
    });
  },[club]);



  if (!club) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">Club Page {clubId}</Title>
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
      {/* ==== Section 1: Hero ==== */}
      <Box px={{ base: "md", sm: "lg" }} py="lg">
  {/* NOTE: no mx="auto" here, so it won't be centered */}
  <Box maw={1100} w="100%">
    <ClubHeroCard
      name={club.name}
      logo={club.logo}
      description={club.description}
      tags={club.tags}
    />
  </Box>
</Box>
      

      {/* ==== Section 2: Events (same centering) ==== */}
      <Box py="lg">  {/* no inner width cap */}
        <EventList
          title="Club Events"
          views={["Upcoming", "Previous"]}
          onChangeView={(v) => console.log("selected:", v)}
          events={events}
        />
      </Box>
    </Box>
  );
}
