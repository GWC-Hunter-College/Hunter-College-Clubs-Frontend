// src/components/Event/EventModal.tsx
import { Fragment } from "react";
import {
  Modal,
  Box,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Divider,
} from "@mantine/core";
import type { Event } from "../../types/events";
import "./EventModal.css";
import ClubLogoLink from "./ClubLogoLink";

/** Temporary extension until `description` is added to the canonical Event */
type EventWithDescription = Event & { description?: string | null };

/* ----- Details (Date / Time / Location) ----- */
function parse(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}
const formatDay = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "numeric" });
const formatTime = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

function Details({ start, end, location }: Pick<Event, "start" | "end" | "location">) {
  const s = parse(start);
  const e = parse(end);
  const locLabel = location?.trim() ? location : "na";

  let line1Label = "Date:", line1Value = "na";
  let line2Label = "Time:", line2Value = "na";

  if (s && e) {
    const sameDay = s.toDateString() === e.toDateString();
    if (sameDay) {
      line1Value = formatDay(s);
      line2Value = `${formatTime(s)}–${formatTime(e)}`;
    } else {
      line1Label = "Start:"; line1Value = `${formatDay(s)}, ${formatTime(s)}`;
      line2Label = "End:";   line2Value = `${formatDay(e)}, ${formatTime(e)}`;
    }
  } else if (s) {
    line1Value = formatDay(s); line2Value = formatTime(s);
  } else if (e) {
    line1Value = formatDay(e); line2Value = formatTime(e);
  }

  return (
    <Stack gap={6}>
      <Text className="event-modal__detailsLabel">
        {line1Label} <Text span className="event-modal__detailsValue">{line1Value}</Text>
      </Text>
      <Text className="event-modal__detailsLabel">
        {line2Label} <Text span className="event-modal__detailsValue">{line2Value}</Text>
      </Text>
      <Text className="event-modal__detailsLabel">
        Location: <Text span className="event-modal__detailsValue">{locLabel}</Text>
      </Text>
    </Stack>
  );
}

/* ----- Modal ----- */
type Props = {
  opened: boolean;
  onClose: () => void;
  event: EventWithDescription;
  onRsvp?: () => void;
};

export default function EventModal({ opened, onClose, event, onRsvp }: Props) {
  const { title, flyer, altText, owner, start, end, location, rsvpLink, description } = event;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton
      centered
      size="lg"
      overlayProps={{ blur: 6, opacity: 0.35 }}
      radius="lg"
      padding={0}
      classNames={{ content: "event-modal__content", body: "event-modal__body" }}
    >
      <Stack gap={0} className="event-modal__shell">
        {/* Flyer (centered, smaller) */}
        <Box className="event-modal__banner">
          {flyer ? (
            <Box className="event-modal__coverWrap">
              <img src={flyer} alt={altText ?? title} className="event-modal__cover" />
            </Box>
          ) : null}
        </Box>

        {/* Info panel */}
        <Box className="event-modal__panel">
          <Stack gap="md">
            {/* Header: club logo left, event title right */}
            <Group align="center" justify="flex-start" gap="sm" wrap="nowrap">
              <ClubLogoLink owner={owner} size="md" offset="md" onClick={onClose} />
              <Stack gap={2}>
                <Title order={2} c="white" className="event-modal__title">
                  {title}
                </Title>
              </Stack>
            </Group>

            <Divider className="event-modal__divider" />

            <Details start={start} end={end} location={location} />

            {/* Description (optional) */}
            {/* {description || true ? ( */}
            {description ? (
              <Box className="event-modal__descWrap">
                <Text className="event-modal__descText">
                    {description}
                    {/* A community of students empowering each other through coding workshops, mentorship, and projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. */}
                </Text>
              </Box>
            ) : null}

            <Group justify="end" mt="sm" gap="sm">
              {onRsvp ? (
                <Button onClick={onRsvp} radius="xl">RSVP</Button>
              ) : rsvpLink ? (
                <Button component="a" href={rsvpLink} target="_blank" rel="noreferrer" radius="xl">
                  RSVP
                </Button>
              ) : (
                <Fragment />
              )}
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Modal>
  );
}
