import { useEffect, useMemo, useState } from "react";
// import { Flex, Divider, Text, SimpleGrid, Box } from "@mantine/core";
import { Flex, Divider, Text, Box } from "@mantine/core";
import Section from "../HomePage/Section";
import EventCard from "./EventCard";
import View from "../HomePage/View";
import type { Event } from "../../types/events"; // ⬅️ use canonical Event

type EventsListProps = {
  title: string;
  views: string[];
  active?: string;
  onChangeView?: (label: string) => void;

  // events to render (canonical Event[])
  events: Event[];
};

// top of file (or above the return)
const CARD_SIZE = "clamp(200px, 17vw, 260px)"; // <= max 260px so 3 cols + gaps fit in 60vw
const GAP       = "clamp(12px, 2vw, 16px)";
// const BAND_MAX  = "60vw";

// "SEPTEMBER 2025"
const monthLabel = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "long" }).toUpperCase()} ${d.getFullYear()}`;
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
      const key = monthLabel(e.start);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
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
      {monthBuckets.map(([month, items]) => {
        // Wider band for months with more items so they can add another column
        const bandMax =
          items.length >= 8
            ? "min(95vw, 1600px)" // 5 cols possible on huge screens
            : items.length >= 4
            ? "min(80vw, 1280px)" // allow 4 cols
            : "min(60vw, 1040px)"; // default ~3/5 width (what you liked before)

        return (
          <Box key={month} mt="2rem">
            <Section month={month} />

            {/* Full width on small; capped by bandMax on large */}
            <Box w="100%" style={{ maxWidth: bandMax }}>
              <Box
                style={{
                  display: "grid",
                  // Identical column width everywhere; grid auto-fits more columns when band gets wider
                  gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_SIZE}, ${CARD_SIZE}))`,
                  gap: GAP,
                  justifyContent: "start", // pack left; leave right side empty
                  alignItems: "start",
                }}
              >
                {items.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
