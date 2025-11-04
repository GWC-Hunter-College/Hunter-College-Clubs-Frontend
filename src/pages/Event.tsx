import { useEffect, useState } from "react";
import { Container, Skeleton, Stack } from "@mantine/core";
import type { Event } from "../types/events";

import EventHero from "../components/EventPage/EventHero";
import EventHeader from "../components/EventPage/EventHeader";
import EventDetails from "../components/EventPage/EventDetails";

const DEMO_EVENT: Event = {
  id: 1,
  title: "Girls Who Code — Club Fair",
  location: "Lex Ave & Park Ave (The Streets)",
  rsvpLink: "https://example.com/rsvp",
  status: "posted",
  start: "2025-09-12 17:00:00",
  end: "2025-09-13 19:00:00",
  flyer: "/ra.png",
  owner: { id: 2, logo: "/logo.png" },
  altText: "GWC Club Fair Poster",
};

export default function EventPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading] = useState(false);

  useEffect(() => {
    setEvent(DEMO_EVENT);
  }, []);

  if (loading || !event) {
    return (
      <Container size="lg" py="lg">
        <Stack gap="lg">
          <Skeleton h={280} radius="lg" />
          <Skeleton h={28} w="75%" />
          <Skeleton h={20} w="60%" />
          <Skeleton h={120} />
        </Stack>
      </Container>
    );
  }

  const posterSrc = event.flyer ?? "/card.png";
  const alt = event.altText || `${event.title} poster`;

  return (
    <>
      <EventHero src={posterSrc} alt={alt} mt={30} height={400} maxHeight={550} />
      <EventHeader title={event.title} owner={event.owner} />

      <EventDetails
        startDate={event.start}
        endDate={event.end}
        location={event.location}
      />    
    </>
  );
}
