import { Box, Flex, Title, Text, Button, Paper } from "@mantine/core";
import placeholderImg from "../../assets/placeholder.png";
import type { Club } from "../../types/club";

type FeaturedClubCardProps = {
  club: Club;
  action?: "none" | "join" | "leave";
  onJoinClick?: () => void;
  onLeaveClick?: () => void;
};

export default function FeaturedClubCard({
  club,
  action = "none",
  onJoinClick,
  onLeaveClick,
}: FeaturedClubCardProps) {
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
      <Flex direction="column" gap="lg">
        {/* Header: title + optional action button */}
        <Flex align="center" justify="space-between" wrap="nowrap" gap="md">
          <Title
            order={2}
            style={{
              fontFamily: "Roboto Mono, monospace",
              fontWeight: 700,
              fontSize: "36px",
              lineHeight: "1",
            }}
          >
            {club.name}
          </Title>

          {action === "join" && (
            <Button
              radius="xl"
              size="md"
              onClick={() => {
                onJoinClick?.();
                if (!onJoinClick) {
                  console.log(`Joined club: ${club.name} (ID: ${club.id})`);
                }
              }}
              style={{
                backgroundColor: "#B57FFF",
                color: "white",
                fontWeight: 600,
                fontFamily: "Roboto Mono, monospace",
              }}
            >
              JOIN →
            </Button>
          )}

          {action === "leave" && (
            <Button
              radius="xl"
              size="md"
              color="red"
              variant="filled"
              onClick={() => {
                onLeaveClick?.();
                if (!onLeaveClick) {
                  console.log(`Left club: ${club.name} (ID: ${club.id})`);
                }
              }}
            >
              LEAVE
            </Button>
          )}
        </Flex>

        {/* Content: image + description (stacks on small screens) */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          align={{ base: "flex-start", sm: "stretch" }}
          gap="lg"
          wrap="nowrap"
        >
          <Box
            style={{
              width: 160,
              height: 160,
              borderRadius: 20,
              overflow: "hidden",
              flexShrink: 0,
              alignSelf: "flex-start",
            }}
          >
            <img
              src={club.logo ?? placeholderImg}
              alt={club.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          <Text
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
              color: "#E0E0E0",
              maxWidth: 600,
            }}
          >
            {club.description ??
              "A community of students empowering each other through coding workshops, mentorship, and projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </Text>
        </Flex>

        {/* Tags at bottom */}
        {club.tags?.length ? (
          <Flex gap="sm" mt="sm" wrap="wrap">
            {club.tags.map((tag) => (
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
        ) : null}
      </Flex>
    </Paper>
  );
}
