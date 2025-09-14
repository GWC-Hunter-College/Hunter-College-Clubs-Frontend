// components/Events/EventCard.tsx
import { Box, Image, Text } from "@mantine/core";

type EventCardProps = {
  flyer: string;
  logo: string;
  title: string;
  location: string;
  start: string;  // ISO
  end: string;    // ISO
  altText?: string;
};

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

  return { day, timeRange };
}

export default function EventCard({
  flyer,
  logo,
  title,
  location,
  start,
  end,
  altText = "Event flyer",
}: EventCardProps) {
  const { day, timeRange } = formatRange(start, end);

  return (
    <Box
      pos="relative"
      w="100%"
      style={{ aspectRatio: "1 / 1", borderRadius: 16, overflow: "hidden" }}
    >
      <Image src={flyer} alt={altText} fit="cover" h="100%" w="100%" />

      {/* Bottom overlay with details */}
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        style={{
          padding: "12px",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.85) 100%)",
          color: "white",
        }}
      >
        <Text fw={700} size="lg" style={{ lineHeight: 1.2 }}>
          {title}
        </Text>
        <Text size="sm" style={{ opacity: 0.9 }}>
          {location}
        </Text>
        <Text size="sm" style={{ opacity: 0.9 }}>
          {day} • {timeRange}
        </Text>
      </Box>

      {/* Logo badge */}
      <Box
        pos="absolute"
        top="4%"
        right="4%"
        bg="white"
        p={6}
        style={{
          borderRadius: 12,
          width: "min(22%, 60px)",
          aspectRatio: "1 / 1",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        }}
      >
        <Image src={logo} alt="Club logo" fit="contain" />
      </Box>
    </Box>
  );
}
