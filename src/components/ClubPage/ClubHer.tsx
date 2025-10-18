import { Box, Flex, Title, Text, Button, Paper } from "@mantine/core";
import placeholderImg from "../../assets/placeholder.png";
import type { Club } from "../../types/club";
import { useNavigate } from "react-router-dom";

type FeaturedClubCardProps = {
  club: Club;
};

export default function FeaturedClubCard({ club }: FeaturedClubCardProps) {
  const navigate = useNavigate();

  return (
    <Paper
      radius="xl"
      p="xl"
      style={{
        backgroundColor: "#2A1F3F",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
      }}
    >
      <Flex
        direction="row"
        align="flex-start"
        justify="space-between"
        wrap="wrap"
        gap="lg"
      >
        {/* Club Info */}
        <Flex direction="row" gap="lg" style={{ flex: 1 }}>
          <Box
            style={{
              width: 160,
              height: 160,
              borderRadius: 20,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={placeholderImg}
              alt={club.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          <Flex direction="column" justify="space-between">
            <Box>
              <Title
                order={2}
                style={{
                  fontFamily: "Roboto Mono, monospace",
                  fontWeight: 700,
                  fontSize: "36px",
                  lineHeight: "1",
                  marginBottom: "1rem",
                }}
              >
                {club.name}
              </Title>
              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#E0E0E0",
                  maxWidth: 500,
                }}
              >
                {club.description ??
                  "A community of students empowering each other through coding workshops, mentorship, and projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </Text>
            </Box>

            {/* Tags */}
            <Flex gap="sm" mt="md">
              {(club.tags?.length
                ? club.tags
                : ["Tech", "Academic"]
              ).map((tag) => (
                <Button
                  key={tag}
                  radius="xl"
                  variant="white"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: "12px",
                    padding: "6px 20px",
                  }}
                >
                  {tag.toUpperCase()}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Flex>

        {/* Join Button */}
        <Button
          radius="xl"
          size="lg"
          onClick={() => navigate(`/club/${club.id}`)}
          style={{
            backgroundColor: "#B57FFF",
            color: "white",
            fontWeight: 600,
            fontFamily: "Roboto Mono, monospace",
            alignSelf: "center",
          }}
        >
          JOIN →
        </Button>
      </Flex>
    </Paper>
  );
}
