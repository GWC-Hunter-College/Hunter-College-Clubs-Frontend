// components/Events/EventCard.tsx
import { Link } from "react-router-dom";
import {
  Card,
  Group,
  Text,
  Avatar,
  Box,
  useMantineTheme,
  rem,
} from "@mantine/core";
import classes from "./EventCard.module.css";

type UiEvent = {
  id: string;
  title: string;
  location: string;
  start: string; // ISO
  end: string;   // ISO
  flyer: string; // image url
  logo: string;  // image url (club/logo)
  altText?: string;
};

function formatRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const day = start.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startTime = start.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
  const endTime = end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day} • ${startTime} – ${endTime}`;
}

export default function EventCard({ event }: { event: UiEvent }) {
  const theme = useMantineTheme();
  const to = `/event/${event.id}`;

  return (
    <Card
      className={classes.tile}
      component={Link}
      to={to}
      shadow="lg"
      radius="md"
      p={0}
      style={{ overflow: "hidden", textDecoration: "none" }}
    >
      {/* Square aspect wrapper */}
      <Box className={classes.square} aria-label={event.altText || event.title}>
        {/* Background image with cover + hover zoom */}
        <Box className={classes.bg} style={{ backgroundImage: `url(${event.flyer})` }} />
        {/* Overlay for readability */}
        <Box className={classes.overlay} />

        {/* Club logo — top-right */}
        {event.logo && (
          <Avatar
            src={event.logo}
            alt="Club logo"
            radius="xl"
            size={44}
            className={classes.logo}
            style={{
              border: `2px solid ${theme.colors.dark[7]}`,
              boxShadow: theme.shadows.md,
            }}
          />
        )}

        {/* Compact content over image */}
        <Box className={classes.content}>
          <Text size="lg" fw={700} className={classes.title}>
            {event.title}
          </Text>

          <Group gap={4} className={classes.meta}>
            <Text size="sm" className={classes.subtle}>
              {formatRange(event.start, event.end)}
            </Text>
          </Group>

          <Text size="sm" className={classes.subtle}>
            {event.location}
          </Text>
        </Box>
      </Box>
    </Card>
  );
}
