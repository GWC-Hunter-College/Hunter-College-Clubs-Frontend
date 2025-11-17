// src/components/Other/MyClubs.tsx
import {
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Box,
  Flex,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/blackarrow.png";

type Club = {
  id: string | number;
  name: string;
  role?: string;
  thumbnailUrl?: string;
};

type Props = {
  clubs?: Club[];
  loading?: boolean;
  // called when a club card is clicked: goes to that club's page (right now the club/# doesn't exist)
  onClubClick?: (club: Club) => void;
  // called when the arrow / 'see directory' action is triggererd
  onDirectoryClick?: () => void;
  onCreateClub?: () => void;
  isSignedIn?: boolean;
};

export default function MyClubs({
  clubs: clubsProp,
  loading: loadingProp,
  onClubClick,
  onDirectoryClick,
  onCreateClub,
  isSignedIn,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const loading = loadingProp ?? false;
  const displayedClubs = clubsProp ?? [];

  if (loading) {
    return (
      <Card p="lg" radius="xl" withBorder>
        {/* Header */}
        <Group justify="space-between" mb="md">
          <Skeleton height={24} width={120} radius="sm" /> {/* "MY CLUBS" */}
        </Group>

        {/* Club list items */}
        <Stack gap="md">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              radius="xl"
              p="md"
              withBorder
              style={{ position: "relative" }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Skeleton height={48} width={48} radius="md" /> {/* Logo */}
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Skeleton height={16} width="60%" /> {/* Club name */}
                  <Group gap="sm">
                    <Skeleton height={12} width={70} radius="xl" />{" "}
                    {/* Member tag */}
                    <Skeleton height={12} width={70} radius="xl" />{" "}
                    {/* E-Board tag */}
                  </Group>
                </Stack>
                <Box style={{ position: "absolute", top: 12, right: 12 }}>
                  <Skeleton height={24} width={24} radius="xl" /> {/* Arrow */}
                </Box>
              </Group>
            </Card>
          ))}
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      p="lg"
      radius="xl"
      style={{ backgroundColor: "#E7D6FF26", border: "none" }}
    >
      <Group justify="space-between" mb="md">
        <Text
          style={{
            fontSize: "24px",
            fontWeight: 700,
            fontFamily: "'Roboto Mono', monospace",
            color: "#FFFFFF",
            marginTop: "1.5rem",
          }}
        >
          MY CLUBS
        </Text>
      </Group>

      <Stack gap="sm">
        {isSignedIn === false && (
          <Text color="dimmed">Sign in to see your clubs.</Text>
        )}

        {isSignedIn !== false &&
          (!displayedClubs || displayedClubs.length === 0) && (
            <Box>
              <Text color="dimmed"> Looking a bit empty... </Text>
              {onCreateClub && (
                <Button variant="outline" onClick={onCreateClub} mt="sm">
                  Create a club
                </Button>
              )}
            </Box>
          )}

        {isSignedIn !== false &&
          displayedClubs &&
          displayedClubs.length > 0 &&
          displayedClubs.map((club) => (
              <Card
                key={club.id}
                radius="md"
                p="md"
                style={{
                  background: "#F7F6FA",
                  border: "none",
                  position: "relative",
                  transition: "transform 120ms, box-shadow 120ms",
                  boxShadow:
                    hoveredId === club.id
                      ? "0 6px 20px rgba(16,24,40,0.08)"
                      : undefined,
                  transform:
                    hoveredId === club.id ? "translateY(-3px)" : undefined,
                  cursor: onClubClick ? "pointer" : undefined,
                }}
                onMouseEnter={() => setHoveredId(club.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onClubClick?.(club)}
              >
                <Group justify="space-between" wrap="nowrap">
                  {/* Thumbnail */}
                  <Box
                    w={48}
                    h={48}
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {club.thumbnailUrl ? (
                      <img
                        src={club.thumbnailUrl}
                        alt={club.name}
                        width="48"
                        height="48"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box w="100%" h="100%" bg="gray.2" />
                    )}
                  </Box>

                  {/* Club Name and Role */}
                  <Stack gap={10} style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "'Roboto Mono', monospace",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#000000",
                      }}
                    >
                      {club.name}
                    </Text>
                    {club.role && (
                      <Flex
                        align="center"
                        gap={8}
                        style={{ marginLeft: "3px" }}
                      >
                        <Box
                          w={18}
                          h={18}
                          style={{
                            borderRadius: "50%",
                            backgroundColor:
                              club.role === "owner"
                                ? "#F28DFF"
                                : club.role === "eboard"
                                ? "#FFCE3B"
                                : club.role === "member"
                                ? "#54D850"
                                : "#999",
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: "'Roboto Mono', monospace",
                            fontWeight: 700,
                            fontStyle: "italic",
                            fontSize: "16px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#000000",
                          }}
                        >
                          {club.role}
                        </Text>
                      </Flex>
                    )}
                  </Stack>

                  {/* Arrow to the respective club's page */}
                  {onDirectoryClick ? (
                    <button
                      type="button"
                      aria-label={`Go to ${club.name} page`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDirectoryClick?.();
                      }}
                      style={{
                        position: "absolute",
                        bottom: -3,
                        right: 12,
                        border: "none",
                        background: "transparent",
                        padding: 0,
                      }}
                    >
                      <img
                        src={arrowImg}
                        alt="Go"
                        width={36}
                        height={36}
                        style={{ objectFit: "contain", cursor: "pointer" }}
                      />
                    </button>
                  ) : (
                    <Link
                      to={`/club/${club.id}`}
                      aria-label={`Go to ${club.name} page`}
                      style={{
                        position: "absolute",
                        bottom: -8,
                        right: 12,
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={arrowImg}
                        alt="Go"
                        width={36}
                        height={36}
                        style={{ objectFit: "contain", cursor: "pointer" }}
                      />
                    </Link>
                  )}
                </Group>
              </Card>
            ))}
      </Stack>
    </Card>
  );
}