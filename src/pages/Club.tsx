// ClubPage.tsx
import { Box, Container, Stack, Skeleton, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClubHeroCard from "../components/ClubPage/ClubHero";
import EventList from "../components/Events/EventList";
import placeholderLogo from "../assets/logo.png";

type Club = {
  name: string;
  logo: string;
  description: string;   // keep this
  tags: string[];
};

export default function ClubPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    setClub({
      name: "Girls Who Code",
      logo: placeholderLogo,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      tags: [],
    });
  }, []);

  if (!club) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">Club Page {clubId}</Title>
        <Stack gap="md">
          <Skeleton h={50} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={60} radius="md" />
        </Stack>
      </Container>
    );
  }

  return (
    <Box mih="100dvh">
      {/* ==== Section 1: Hero ==== */}
      <Box px={{ base: "md", sm: "lg" }} py="lg">
        <Box maw={1100} w="100%" mx="auto">
          <ClubHeroCard
            name={club.name}
            logo={club.logo}
            description={club.description}
            tags={club.tags}
          />
        </Box>
      </Box>
      

      {/* ==== Section 2: Events (same centering) ==== */}
      <Box px={{ base: "md", sm: "lg" }} py="lg">
        <Box maw={1100} w="100%" mx="auto">
          <EventList
            title="Upcoming Events"
            views={["My Clubs", "Global"]}
            onChangeView={(v) => console.log("selected:", v)}
          />
        </Box>
      </Box>
    </Box>
  );
}
