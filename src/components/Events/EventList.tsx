// src/components/Event/EventList.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Flex, Divider, Text, Box } from "@mantine/core";
import Section from "../HomePage/Section";
import EventCard from "./EventCard";
import View from "../HomePage/View";
import type { Event } from "../../types/events";

type EventsListProps = {
  title: string;
  views: string[];
  active?: string;
  onChangeView?: (label: string) => void;
  events: Event[];
  onEventClick?: (ev: Event) => void; // parent provides click behavior
};

// Layout constants
const CARD_SIZE = "clamp(200px, 17vw, 260px)";
const GAP = "clamp(12px, 2vw, 16px)";

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
  onEventClick, 
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

  const handleOpen = useCallback(
    (ev: Event) => {
      onEventClick?.(ev);
    },
    [onEventClick]
  );

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
        const bandMax =
          items.length >= 8
            ? "min(95vw, 1600px)"
            : items.length >= 4
            ? "min(80vw, 1280px)"
            : "min(60vw, 1040px)";

        return (
          <Box key={month} mt="2rem">
            <Section month={month} />

            {/* Full width on small; capped by bandMax on large */}
            <Box w="100%" style={{ maxWidth: bandMax }}>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_SIZE}, ${CARD_SIZE}))`,
                  gap: GAP,
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                {items.map((ev) => (
                  <Box key={ev.id}>
                    <EventCard event={ev} onClick={() => handleOpen(ev)} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
