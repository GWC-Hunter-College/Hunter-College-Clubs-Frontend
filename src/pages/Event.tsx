// src/pages/EventPage.tsx
import { useEffect, useState } from "react";
import { Container, Skeleton, Stack } from "@mantine/core";

// ✅ Use your Event type
import type { Event } from "../types/events";

// ---- (unchanged) date helper copied from EventCard, kept for later ----
function formatRange(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);

  const day = s.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const sameDay = s.toDateString() === e.toDateString();
  const timeRange = sameDay
    ? `${fmtTime(s)}–${fmtTime(e)}`
    : `${fmtTime(s)} → ${e.toLocaleDateString()} ${fmtTime(e)}`;

  return `${day} • ${timeRange}`;
}

// ---- Inline demo data (same shape you use elsewhere) ----
const DEMO_EVENT: Event = {
  id: 1,
  title: "Girls Who Code — Club Fair",
  location: "Lex Ave & Park Ave (The Streets)",
  rsvpLink: "https://example.com/rsvp",
  status: "posted",
  start: "2025-09-12 17:00:00",
  end: "2025-09-13 19:00:00",
  flyer: undefined,
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

  
  return (
    <Container size="lg" py="lg">
    </Container>
  );
}
