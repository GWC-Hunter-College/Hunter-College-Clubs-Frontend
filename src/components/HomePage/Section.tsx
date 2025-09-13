import { Text } from "@mantine/core";

type EventSectionProps = {
  month: string; 
};

export default function Section({ month }: EventSectionProps) {
  return (
    <Text
      style={{
        fontFamily: "Roboto Mono, monospace",
        fontWeight: 400,
        fontStyle: "italic",
        fontSize: "35px",
        lineHeight: "100%",
        letterSpacing: "0%",
        color: "white",
      }}
    >
      {month}
    </Text>
  );
}
