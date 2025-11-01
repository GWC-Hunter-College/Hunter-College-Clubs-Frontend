// src/components/HomePage/MyClubs.tsx
import { Card, Group, Skeleton, Stack, Text, Box, Flex} from "@mantine/core";
import { useEffect, useState } from "react";

type Club = {
  id: string | number;
  name: string;
  role?: string;
  thumbnailUrl?: string;
};

export default function MyClubs() {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me/clubs");
        const json = await res.json();
        if (cancelled) return;

        const data = Array.isArray(json) ? json : json?.clubs ?? json;
        setClubs(Array.isArray(data) ? data : [data].filter(Boolean));
      } catch (e) {
        console.error("Failed to fetch /me/clubs", e);
        setClubs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
            <Card key={i} radius="xl" p="md" withBorder>
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
                <Skeleton height={24} width={24} radius="xl" /> {/* Arrow */}
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
        {(!clubs || clubs.length === 0) && (
          <Text color="dimmed"> Looking a bit empty... </Text>
        )}

        {clubs.map((club) => (
          <Card
            key={club.id}
            radius="md"
            p="md"
            style={{ background: "#F7F6FA", border: "none" }}
          >
            <Group justify="space-between" wrap="nowrap">
              {/* Thumbnail */}
              <Box
                w={48}
                h={48}
                style={{ borderRadius: 12, overflow: "hidden", flexShrink: 0 }}
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
              <Stack gap={4} style={{ flex: 1 }}>
                <Text fw={600} size="sm" style={{ color: "#000000" }}>
                  {club.name}
                </Text>
                {club.role && (
                  <Flex align="center" gap="xs">
                    <Box
                      w={10}
                      h={10}
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
                    <Text size="xs" fw={500} style={{ fontStyle: "italic", color: "#000000", fontWeight: 700, fontFamily: "'Roboto Mono', monospace", }}>
                      {club.role}
                    </Text>
                  </Flex>
                )}
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}
