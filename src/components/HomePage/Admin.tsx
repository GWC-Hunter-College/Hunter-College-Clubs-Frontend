import { Box, Flex, Text, Image } from "@mantine/core";
import arrowImage from "../../assets/arrow.png"; // straight arrow →

export default function Admin() {
  return (
    <Box
      p="lg"
      style={{
        borderRadius: 20,
        backgroundColor: "#E7D6FF26",
      }}
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text
            fw={700}
            size="lg"
            style={{
              fontFamily: "Roboto Mono, monospace",
              textTransform: "uppercase",
              lineHeight: 1.3,
            }}
          >
            Club
            <br />
            Admin
            <br />
            Settings
          </Text>
        </Box>

        {/* Purple circle with rotated arrow */}
        <Box
          w={75}
          h={75}
          bg="#854CD5"
          style={{
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
        <Image
        src={arrowImage}
        alt="arrow"
        w={35}
        h={57}
        fit="contain"
        style={{ transform: "rotate(-45deg)" }}
        />
        </Box>
      </Flex>
    </Box>
  );
}
