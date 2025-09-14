// components/Events/EventList.tsx
import { useState } from "react";
import { Flex, Divider, Text } from "@mantine/core";
import Section from "../HomePage/Section";
import EventCard from "../HomePage/EventCard";
import View from "../HomePage/View";

import logo from "../../assets/logo.png";
import flyer from "../../assets/card.png";

type EventsListProps = {
  /** Heading text (e.g., "Upcoming Events") */
  title: string;

  /** Buttons to render (labels) */
  views: string[];

  /** Controlled active view (optional) */
  active?: string;

  /** Notify parent when a view is selected (optional) */
  onChangeView?: (label: string) => void;
};

export default function EventList({
  title,
  views,
  active: controlledActive,
  onChangeView,
}: EventsListProps) {
  // Uncontrolled fallback if parent doesn't provide `active`
  const [uncontrolledActive, setUncontrolledActive] = useState<string>(
    controlledActive ?? views[0] ?? ""
  );
  const active = controlledActive ?? uncontrolledActive;

  const handleSelect = (label: string) => {
    setUncontrolledActive(label);
    onChangeView?.(label);
  };

  return (
    <>
      {/* Header: title + dynamic buttons */}
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

      {/* --- Static months for now (you’ll make these dynamic later) --- */}
      <Flex direction="column" gap="2rem">
        <Section month="SEPTEMBER 2025" />
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="2rem"
          align="center"
          justify="center"
          wrap="wrap"
        >
          <EventCard logo={logo} flyer={flyer} />
          <EventCard logo={logo} flyer={flyer} />
          <EventCard logo={logo} flyer={flyer} />
        </Flex>
      </Flex>

      <Flex direction="column" gap="2rem" mt="2rem">
        <Section month="OCTOBER 2025" />
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="2rem"
          align="center"
          justify="center"
          wrap="wrap"
        >
          <EventCard logo={logo} flyer={flyer} />
          <EventCard logo={logo} flyer={flyer} />
          <EventCard logo={logo} flyer={flyer} />
        </Flex>
      </Flex>
    </>
  );
}
