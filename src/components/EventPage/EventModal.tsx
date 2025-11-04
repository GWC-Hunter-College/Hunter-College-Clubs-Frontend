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
import type { Event } from "../../types/events";
import "./EventModal.css";

/* ----- EventDetails logic (styled via global CSS) ----- */
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
  d.toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "numeric" });
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
      <Text className="event-modal__detailsLabel">
        {line1Label}{" "}
        <Text span className="event-modal__detailsValue">{line1Value}</Text>
      </Text>
      <Text className="event-modal__detailsLabel">
        {line2Label}{" "}
        <Text span className="event-modal__detailsValue">{line2Value}</Text>
      </Text>
      <Text className="event-modal__detailsLabel">
        Location:{" "}
        <Text span className="event-modal__detailsValue">{locLabel}</Text>
      </Text>
    </Stack>
  );
}

/* ----- Event modal ----- */
type Props = {
  opened: boolean;
  onClose: () => void;
  event: Event;
  onRsvp?: () => void;
};

export default function EventModal({ opened, onClose, event, onRsvp }: Props) {
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
      classNames={{ content: "event-modal__content", body: "event-modal__body" }}
    >
      <Stack gap={0} className="event-modal__shell">
        {/* Banner with centered, smaller flyer */}
        <Box className="event-modal__banner">
          {coverImage ? (
            <Box className="event-modal__coverWrap">
              <Image
                src={coverImage}
                alt={title}
                fit="cover"
                className="event-modal__cover"
              />
            </Box>
          ) : null}
        </Box>

        {/* Info panel */}
        <Box className="event-modal__panel">
          <Stack gap="md">
            <Group align="center" justify="space-between" wrap="nowrap">
              <Group gap="sm">
                {clubLogo ? (
                  <img
                    src={clubLogo}
                    alt={clubName ?? ""}
                    className="event-modal__clubLogo"
                  />
                ) : null}
                <Stack gap={2}>
                  <Title order={2} c="white" className="event-modal__title">
                    {title}
                  </Title>
                  {clubName ? (
                    <Text size="sm" c="dimmed" className="event-modal__clubName">
                      {clubName}
                    </Text>
                  ) : null}
                </Stack>
              </Group>
              <Badge variant="light" radius="lg">
                Club Event
              </Badge>
            </Group>

            <Divider className="event-modal__divider" />

            <Details
              startDate={(event as any).start ?? null}
              endDate={(event as any).end ?? null}
              location={locRaw ?? null}
            />

            {(event as any).description ? (
              <Box className="event-modal__descWrap">
                <Text className="event-modal__descText">
                  {(event as any).description}
                </Text>
              </Box>
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
