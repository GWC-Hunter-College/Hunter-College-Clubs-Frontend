// components/Events/EventCard.tsx
import { Link } from "react-router-dom";
import {
  Card,
  Group,
  Text,
  Avatar,
  Box,
  useMantineTheme,
} from "@mantine/core";
import classes from "./EventCard.module.css";
import type { Event } from "../../types/events"; 

import { useEventModal } from "../../context/EventModalContext";

function formatRange(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);

  const day = s.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const sameDay = s.toDateString() === e.toDateString();
  const timeRange = sameDay
    ? `${fmtTime(s)}–${fmtTime(e)}`
    : `${fmtTime(s)} → ${e.toLocaleDateString()} ${fmtTime(e)}`;

  return `${day} • ${timeRange}`;
}

type Props = { event: Event };

export default function EventCard({ event }: Props) {
  const theme = useMantineTheme();
  const { openEvent } = useEventModal();

  const handleOpen = () => openEvent({ event }); 

  return (
    <Card
      className={classes.tile}
      // component={Link}
      // to={to}
      onClick={handleOpen}
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

        {/* Club logo — top-right (owner only, for now) */}
        {event.owner?.logo && (
          <Avatar
            src={event.owner.logo}
            alt={`Owner ${event.owner.id}`}
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
