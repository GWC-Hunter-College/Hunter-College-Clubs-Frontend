// src/components/EventPage/EventDetails.tsx
import { Container, Stack, Text } from "@mantine/core";

type Props = {
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
};

// helpers kept local to the component file
const parse = (s?: string | null) => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};
const formatDay = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "short", day: "numeric" }); // ⬅️ no year
const formatTime = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export default function EventDetails({ startDate, endDate, location }: Props) {
  const s = parse(startDate);
  const e = parse(endDate);
  const locLabel = (location && location.trim()) ? location : "na";

  let line1Label = "Date:";
  let line1Value = "na";
  let line2Label = "Time:";
  let line2Value = "na";

  if (s && e) {
    const sameDay = s.toDateString() === e.toDateString();
    if (sameDay) {
      // DATE + TIME (range)
      line1Label = "Date:";
      line1Value = formatDay(s);                              // e.g., "Jan 1"
      line2Label = "Time:";
      line2Value = `${formatTime(s)}–${formatTime(e)}`;       // e.g., "12:00 PM–4:00 PM"
    } else {
      // START + END (each with its own date+time)
      line1Label = "Start:";
      line1Value = `${formatDay(s)}, ${formatTime(s)}`;        // e.g., "Jan 1 12:00 PM"
      line2Label = "End:";
      line2Value = `${formatDay(e)}, ${formatTime(e)}`;        // e.g., "Jan 2 4:00 PM"
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
    <Container size="lg" py="sm">
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
    </Container>
  );
}
