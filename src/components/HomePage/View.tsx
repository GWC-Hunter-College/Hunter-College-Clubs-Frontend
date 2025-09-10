import { Box, Text } from "@mantine/core";
import { useState } from "react";

type ToggleButtonProps = {
  label: string;      // text inside the button
  active?: boolean;   // whether it's selected (filled)
  onClick?: () => void;
};

export default function View({ label, active = false, onClick }: ToggleButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
<Box
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  onClick={onClick}
  style={{
    cursor: "pointer",
    borderRadius: "9999px", // pill shape
    width: "clamp(140px, 20vw, 220px)",  // min 140px, scales with viewport, max 220px
    height: "clamp(45px, 6vh, 60px)",    // min 45px, scales with viewport, max 60px
    border: "2px solid white",
    backgroundColor: active ? "#d9d9d9" : hovered ? "white" : "transparent",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Text
    fw={700}
    style={{
      fontFamily: "Roboto Mono, monospace",
      fontSize: "clamp(0.8rem, 2vw, 1.1rem)", // responsive text size
      color: active ? "black" : hovered ? "black" : "white",
      textTransform: "uppercase",
    }}
  >
    {label}
  </Text>
</Box>

  );
}
