import { Box, Text } from "@mantine/core";
import './Home.css';

export default function Heading() {
  return (
    <Box
      h="100%"
      w={80} // adjust sidebar width
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
    <Text
    c="white"
    style={{
        fontFamily: "Roboto Mono, monospace",
        fontWeight: 700,
        fontSize: "125px",
        lineHeight: "100%",
        writingMode: "vertical-rl", // makes text vertical
        transform: "rotate(360deg)", // flips so it reads bottom-to-top
    }}
    >
        HUNTER CS
      </Text>
    </Box>
  );
}
