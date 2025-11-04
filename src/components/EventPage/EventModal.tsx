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
import type { Event } from "../../types/events"; // <-- canonical Event

function formatDateRange(startIso?: string, endIso?: string) {
  if (!startIso) return undefined;
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : undefined;
  const date = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (!end) return `${date}, ${time}`;
  const sameDay = start.toDateString() === end.toDateString();
  const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return sameDay ? `${date}, ${time}–${endTime}` : `${date} ${time} → ${end.toLocaleString()}`;
}

type Props = {
  opened: boolean;
  onClose: () => void;
  event: Event;          // <-- use Event directly
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

  const dateText = formatDateRange((event as any).start, (event as any).end);
  const location: string | undefined =
    (event as any).location ?? (event as any).venue ?? (event as any).place ?? undefined;
  const description: string | undefined =
    (event as any).description ?? (event as any).details ?? undefined;

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
        <Box style={{ position: "relative", width: "100%", aspectRatio: "5 / 4", background: "#1b1330" }}>
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

        <Box p="lg" style={{ background: "#190b30", color: "white" }}>
          <Stack gap="md">
            <Group align="center" justify="space-between" wrap="nowrap">
              <Group gap="sm">
                {clubLogo ? (
                  <Image src={clubLogo} alt={clubName ?? ""} radius="xl" h={36} w={36} style={{ objectFit: "cover" }} />
                ) : null}
                <Stack gap={2}>
                  <Title order={3} c="white" style={{ lineHeight: 1.1 }}>{title}</Title>
                  {clubName ? <Text size="sm" c="dimmed">{clubName}</Text> : null}
                </Stack>
              </Group>
              <Badge variant="light" radius="lg">Club Event</Badge>
            </Group>

            <Divider color="rgba(255,255,255,0.08)" />

            <Stack gap={6}>
              {dateText ? (
                <Text size="sm"><Text component="span" fw={600}>Date</Text>: {dateText}</Text>
              ) : null}
              {location ? (
                <Text size="sm"><Text component="span" fw={600}>Location</Text>: {location}</Text>
              ) : null}
            </Stack>

            {description ? <Text size="sm" c="gray.3">{description}</Text> : null}

            <Group justify="end" mt="sm">
              {onRsvp ? <Button onClick={onRsvp} radius="xl">RSVP</Button> : <Fragment />}
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Modal>
  );
}
