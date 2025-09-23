import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
  const t = setTimeout(() => setLoading(false), 0);
  return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">
          Club Directory
        </Title>

        <Stack gap="md">
          <Skeleton height={50} radius="md" />
          <Skeleton height={200} radius="md" />
          <Skeleton height={200} radius="md" />
          <Skeleton height={200} radius="md" />
          <Skeleton height={60} radius="md" />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      {/* Back button */}
      <Button
        variant="subtle"
        onClick={() => navigate("/")}
        mb="md"
        radius="xl"
      >
        ← Back
      </Button>

      <Title order={1} mb="lg">
        Club Directory
      </Title>

      <Flex gap="2rem" align="stretch">
        {/* Left rail */}
        <Paper
          p="lg"
          radius="md"
          style={{ width: 260, minHeight: 400, background: "#1f1631" }}
        >
          <Text fw={700} size="sm" mb="sm" style={{ opacity: 0.7 }}>
            MY CLUBS
          </Text>
          <Box
            mt="md"
            p="md"
            style={{
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              minHeight: 300,
            }}
          >
            <Text size="sm" style={{ opacity: 0.6 }}>
              Looking a bit empty...
            </Text>
          </Box>
        </Paper>

        {/* Main column */}
        <Flex direction="column" gap="1.25rem" style={{ flex: 1 }}>
          {/* Replace featured card with two big buttons */}
          <Paper p="xl" radius="md" style={{ background: "#2a1f3f" }}>
            <Flex direction="column" gap="lg">
              <Button
                size="xl"
                radius="md"
                onClick={() => navigate("/club/create")}
              >
                Create New Club
              </Button>

              <Button
                size="xl"
                radius="md"
                onClick={() => navigate("/event/create")}
              >
                Create an Event for a Club
              </Button>
            </Flex>
          </Paper>

          {/* Section header */}
          <Flex align="center" gap="sm" mt="sm">
            <Box style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.2)" }} />
            <Title order={3} style={{ letterSpacing: 2 }}>
              CLUB GALLERY
            </Title>
            <Box style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.2)" }} />
          </Flex>

          {/* Search row */}
          <Flex gap="sm" align="center">
            <TextInput
              placeholder="Search clubs..."
              style={{ flex: 1 }}
              radius="xl"
            />
            <Button radius="xl">Search</Button>
          </Flex>

          {/* Gallery grid placeholders */}
          <Grid gutter="md">
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid.Col key={i} span={{ base: 6, sm: 4, md: 3 }}>
                <Flex direction="column" gap="xs">
                  <Box
                    style={{
                      aspectRatio: "1 / 1",
                      width: "100%",
                      borderRadius: 16,
                      background: i % 2 === 0 ? "#5a3ea6" : "#ffffff12",
                    }}
                  />
                  <Text size="sm" ta="center" style={{ opacity: 0.9 }}>
                    CLUB NAME
                  </Text>
                </Flex>
              </Grid.Col>
            ))}
          </Grid>
        </Flex>
      </Flex>
    </Container>
  );
}
