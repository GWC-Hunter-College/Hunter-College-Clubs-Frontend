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
  Image,
  Badge,
} from "@mantine/core";
import type { Event } from "../../types/events"; // canonical Event

// -----------------------
// Inline EventDetails logic
// -----------------------
type DetailsProps = {
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
};

const parse = (s?: string | null) => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};
const formatDay = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "short", day: "numeric" }); // no year
const formatTime = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

function Details({ startDate, endDate, location }: DetailsProps) {
  const s = parse(startDate);
  const e = parse(endDate);
  const locLabel = location && location.trim() ? location : "na";

  let line1Label = "Date:";
  let line1Value = "na";
  let line2Label = "Time:";
  let line2Value = "na";

  if (s && e) {
    const sameDay = s.toDateString() === e.toDateString();
    if (sameDay) {
      line1Label = "Date:";
      line1Value = formatDay(s);
      line2Label = "Time:";
      line2Value = `${formatTime(s)}–${formatTime(e)}`;
    } else {
      line1Label = "Start:";
      line1Value = `${formatDay(s)}, ${formatTime(s)}`;
      line2Label = "End:";
      line2Value = `${formatDay(e)}, ${formatTime(e)}`;
    }
  } else if (s) {
    line1Label = "Date:";
    line1Value = formatDay(s);
    line2Label = "Time:";
    line2Value = formatTime(s);
  } else if (e) {
    line1Label = "Date:";
    line1Value = formatDay(e);
    line2Label = "Time:";
    line2Value = formatTime(e);
  }

  return (
    <Stack gap={6}>
      <Text fw={700} tt="uppercase">
        {line1Label} <Text span fw={400}>{line1Value}</Text>
      </Text>
      <Text fw={700} tt="uppercase">
        {line2Label} <Text span fw={400}>{line2Value}</Text>
      </Text>
      <Text fw={700} tt="uppercase">
        Location: <Text span fw={400}>{locLabel}</Text>
      </Text>
    </Stack>
  );
}

// -----------------------
// Event modal
// -----------------------
type Props = {
  opened: boolean;
  onClose: () => void;
  event: Event;
  onRsvp?: () => void;
};

export default function EventModal({ opened, onClose, event, onRsvp }: Props) {
  // Resolve what the UI needs from Event
  const title =
    (event as any).title ??
    (event as any).name ??
    (event as any).eventTitle ??
    "Event";

  const coverImage: string | undefined =
    (event as any).flyer ??
    (event as any).imageUrl ??
    (event as any).image ??
    (event as any).thumbnailUrl ??
    (event as any).bannerUrl ??
    undefined;

  const clubLogo: string | undefined =
    (event as any).owner?.logo ??
    (event as any).clubLogoUrl ??
    (event as any).club?.logoUrl ??
    undefined;

  const clubName: string | undefined =
    (event as any).owner?.name ??
    (event as any).clubName ??
    (event as any).club?.name ??
    undefined;

  const locRaw: string | undefined =
    (event as any).location ?? (event as any).venue ?? (event as any).place ?? undefined;

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
      styles={{ content: { background: "transparent" }, body: { padding: 0 } }}
    >
      <Stack gap={0} style={{ borderRadius: 16, overflow: "hidden" }}>
        {/* Banner */}
        <Box
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "5 / 4",
            background: "#1b1330",
          }}
        >
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fit="cover"
              height="100%"
              width="100%"
              style={{ display: "block", objectFit: "cover", height: "100%" }}
            />
          ) : null}
        </Box>

        {/* Info */}
        <Box p="lg" style={{ background: "#190b30", color: "white" }}>
          <Stack gap="md">
            <Group align="center" justify="space-between" wrap="nowrap">
              <Group gap="sm">
                {clubLogo ? (
                  <Image
                    src={clubLogo}
                    alt={clubName ?? ""}
                    radius="xl"
                    h={36}
                    w={36}
                    style={{ objectFit: "cover" }}
                  />
                ) : null}
                <Stack gap={2}>
                  <Title order={3} c="white" style={{ lineHeight: 1.1 }}>
                    {title}
                  </Title>
                  {clubName ? <Text size="sm" c="dimmed">{clubName}</Text> : null}
                </Stack>
              </Group>
              <Badge variant="light" radius="lg">Club Event</Badge>
            </Group>

            <Divider color="rgba(255,255,255,0.08)" />

            {/* Figma-style details (from your EventDetails) */}
            <Details
              startDate={(event as any).start ?? null}
              endDate={(event as any).end ?? null}
              location={locRaw ?? null}
            />

            {(event as any).description ? (
              <Text size="sm" c="gray.3">
                {(event as any).description}
              </Text>
            ) : null}

            <Group justify="end" mt="sm">
              {onRsvp ? <Button onClick={onRsvp} radius="xl">RSVP</Button> : <Fragment />}
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Modal>
  );
}
