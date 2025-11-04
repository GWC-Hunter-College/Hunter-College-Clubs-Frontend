import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import placeholderImg from "../assets/placeholder.png";
import MyClubs from "../components/Other/MyClubs";
import SearchBar from "../components/ClubPage/SearchBar";
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
  Title,
  Center,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useAuthInfo } from "../types/auth";

import PageShell from "../components/Other/PageShell";

import type { Club } from "../types/club";

export default function ClubDirectory() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const auth = useAuthInfo();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clubs?verified=true`);
        if (!res.ok) throw new Error("Failed to fetch clubs");

        const data = await res.json();
        if (cancelled) return;

        setClubs(data.clubs || []);
        setFilteredClubs(data.clubs || []);
      } catch (err) {
        console.error("❌ Failed to fetch clubs:", err);
        setClubs([]);
        setFilteredClubs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // === Loading ===
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
        </Stack>
      </Container>
    );
  }



  // === Main Layout ===
  return (
    <PageShell
      pageTitle="Clubs"
      back={{to: "/"}}
      user={{ auth }}
      size="xl"
      padded
    >
      <Flex gap="2rem" align="stretch">
        {/* LEFT SIDEBAR */}
        <MyClubs />

        {/* MAIN CONTENT */}
        <Flex direction="column" gap="1.5rem" style={{ flex: 1 }}>
          {/* === ACTION PANEL === */}
          <Paper
            p="xl"
            radius="md"
            style={{
              background: "#2A1F3F",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <Flex direction="column" gap="lg">
              <Button
                size="xl"
                radius="xl"
                onClick={() => navigate("/club/create")}
                style={{
                  backgroundColor: "#B57FFF",
                  color: "white",
                  fontFamily: "Roboto Mono, monospace",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                CREATE NEW CLUB
              </Button>

              <Button
                size="xl"
                radius="xl"
                onClick={() => navigate("/event/create")}
                style={{
                  backgroundColor: "#7D5CFF",
                  color: "white",
                  fontFamily: "Roboto Mono, monospace",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                CREATE AN EVENT FOR A CLUB
              </Button>
            </Flex>
          </Paper>

          {/* === Divider === */}
          <Flex align="center" gap="sm" mt="sm">
            <Box
              style={{
                flex: 1,
                height: 2,
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <Title
              order={3}
              style={{
                color: "white",
                letterSpacing: 2,
                fontFamily: "Roboto Mono, monospace",
              }}
            >
              CLUB DIRECTORY
            </Title>
            <Box
              style={{
                flex: 1,
                height: 2,
                background: "rgba(255,255,255,0.2)",
              }}
            />
          </Flex>

          {/* === SEARCH BAR === */}
          <SearchBar
            onSearch={(query) => {
              const q = query.trim().toLowerCase();
              if (!q) {
                setFilteredClubs(clubs);
                return;
              }
              const filtered = clubs.filter((club) =>
                club.name.toLowerCase().includes(q)
              );
              setFilteredClubs(filtered);
            }}
          />

          {/* === CLUB GALLERY === */}
          {filteredClubs.length === 0 ? (
            <Center py="xl">
              <Text size="sm" c="dimmed">
                No matching clubs found.
              </Text>
            </Center>
          ) : (
            <Grid gutter="md" mt="md">
              {filteredClubs.map((club) => (
                <Grid.Col key={club.id} span={{ base: 6, sm: 4, md: 3 }}>
                  <Flex direction="column" gap="xs">
                    <Box
                      onClick={() => navigate(`/club/${club.id}`)}
                      style={{
                        cursor: "pointer",
                        aspectRatio: "1 / 1",
                        borderRadius: 16,
                        overflow: "hidden",
                        background: "#ffffff12",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
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
                    <Text
                      ta="center"
                      style={{
                        fontFamily: "Roboto Mono, monospace",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "white",
                        marginTop: "0.5rem",
                      }}
                    >
                      {club.name}
                    </Text>
                  </Flex>
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Flex>
      </Flex>
    </PageShell>
  );
}
