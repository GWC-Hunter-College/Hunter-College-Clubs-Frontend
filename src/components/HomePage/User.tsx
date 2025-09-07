import { Avatar, Box, Flex, Text} from "@mantine/core";
import bunny from "../../assets/bunny.png";

export default function Admin() {
  return (
    <Flex
      align="center"
      p="md"
      style={{
        backgroundColor: "#2D203E",
        borderRadius: "16px",
        width: "fit-content",
      }}
      gap="sm"
    >
      <Box style={{ position: "relative" }}>
        <Avatar src={bunny} size={70} radius="xl" />
      </Box>

      {/* Text section */}
      <Box>
        <Text
          fw={700}
          size="lg"
          style={{ fontFamily: "Roboto Mono, monospace" }}
        >
          eboardmember
        </Text>

        <Flex align="center" gap="xs">
          <Box
            w={20}
            h={20}
            style={{
              borderRadius: "50%",
              backgroundColor: "#E879F9",
            }}
          />
          <Text
            size="sm"
            fw={500}
            style={{
              fontStyle: "italic",
              fontFamily: "Roboto Mono, monospace",
            }}
          >
            Admin
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
