import { useEffect, useMemo, useState } from "react";
import { Flex, Divider, Text, SimpleGrid, Box } from "@mantine/core";
import Section from "../HomePage/Section";
import EventCard from "./EventCard";
import View from "../HomePage/View";

type Event = {
  id: string;
  flyer: string;
  logo: string;
  month: string;       // e.g. "SEPTEMBER 2025"
  altText?: string;
};

type EventsListProps = {
  title: string;
  views: string[];
  active?: string;
  onChangeView?: (label: string) => void;

  // NEW: events to render
  events: Event[];
};

export default function EventList({
  title,
  views,
  active: controlledActive,
  onChangeView,
  events,
}: EventsListProps) {
  // default to first view
  const [uncontrolledActive, setUncontrolledActive] = useState<string>(
    controlledActive ?? views[0] ?? ""
  );
  const active = controlledActive ?? uncontrolledActive;

  useEffect(() => {
    if (controlledActive == null) {
      setUncontrolledActive((prev) => prev || views[0] || "");
    }
  }, [controlledActive, views]);

  const handleSelect = (label: string) => {
    setUncontrolledActive(label);
    onChangeView?.(label);
  };

  // Group events by month (preserves first-seen order)
  const monthBuckets = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of events) {
      if (!map.has(e.month)) map.set(e.month, []);
      map.get(e.month)!.push(e);
    }
    return Array.from(map.entries()); // [ [month, Event[]], ... ]
  }, [events]);

  return (
    <>
      {/* Header */}
      <Flex direction="column" gap="1rem" mb="1rem">
        <Flex align="center" gap="1rem">
          <Divider style={{ flex: 1, backgroundColor: "white", height: 2 }} />
          <Text
            fw={700}
            style={{
              fontSize: "clamp(1.75rem, 4vw, 4.0625rem)",
              fontFamily: "Roboto Mono, monospace",
              textTransform: "uppercase",
              color: "white",
              letterSpacing: "2px",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Text>
          <Divider style={{ flex: 1, backgroundColor: "white", height: 2 }} />
        </Flex>

        {!!views.length && (
          <Flex gap="1rem" wrap="wrap">
            {views.map((label) => (
              <View
                key={label}
                label={label}
                active={active === label}
                onClick={() => handleSelect(label)}
              />
            ))}
          </Flex>
        )}
      </Flex>

      {/* Months */}
      {monthBuckets.map(([month, items]) => (
      // inside EventList.tsx where you render each month bucket
      <Box key={month} mt="2rem">
        <Section month={month} />

        {/* Full width on small; cap to ~3/5 on large */}
        <Box w="100%" style={{ maxWidth: "60vw" }}>
          <Box
            /* AUTO-FIT columns with a minimum card width;
              grid adds/removes columns fluidly */
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "clamp(0.75rem, 2vw, 1.5rem)",
              justifyItems: "start", // keep cells left-aligned when card hits its max
            }}
          >
            {items.map((e) => (
              <EventCard key={e.id} flyer={e.flyer} logo={e.logo} altText={e.altText} />
            ))}
          </Box>
        </Box>
      </Box>


      ))}
    </>
  );
}
