// ClubPage.tsx
import { Box, Container, Stack, Skeleton, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClubHeroCard from "../components/ClubPage/ClubHero";
import EventList from "../components/Events/EventList";
import placeholderLogo from "../assets/logo.png";

import flyer from "../assets/card.png";
// import flyer2 from "../assets/card.png";
import flyer2 from "../assets/hero.png";
import flyer3 from "../assets/react.svg";
import logo from "../assets/logo.png";

type Club = {
  name: string;
  logo: string;
  description: string;   // keep this
  tags: string[];
};


export default function ClubPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState<Club | null>(null);
  const demoEvents = [
    { id: "1", flyer: flyer, logo: logo, month: "SEPTEMBER 2025" },
    { id: "2", flyer: flyer2, logo: logo, month: "SEPTEMBER 2025" },
    { id: "3", flyer: flyer, logo: logo, month: "SEPTEMBER 2025" },
    { id: "4", flyer: flyer2, logo: logo, month: "OCTOBER 2025" },
    { id: "5", flyer: flyer, logo: logo, month: "OCTOBER 2025" },
    { id: "6", flyer: flyer, logo: logo, month: "dfsR 2025" },
    { id: "7", flyer: flyer2, logo: logo, month: "dfsR 2025" },
    { id: "8", flyer: flyer, logo: logo, month: "dfsR 2025" },
    { id: "6", flyer: flyer3, logo: logo, month: "dfsR 2025" },
    { id: "7", flyer: flyer, logo: logo, month: "dfsR 2025" },
    { id: "8", flyer: flyer, logo: logo, month: "dfsR 2025" },
    { id: "6", flyer: flyer2, logo: logo, month: "dfsR 2025" },
    { id: "7", flyer: flyer, logo: logo, month: "dfsR 2025" },
    { id: "8", flyer: flyer2, logo: logo, month: "dfsR 2025" },
    { id: "6", flyer: flyer3, logo: logo, month: "dfsR 2025" },
    { id: "7", flyer: flyer, logo: logo, month: "dfsR 2025" },
    { id: "8", flyer: flyer, logo: logo, month: "dfsR 2025" },

  ];
  
  useEffect(() => {
    setClub({
      name: "Girls Who Code",
      logo: placeholderLogo,
      description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      tags: [],
    });
    // setClub(null);
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
  {/* NOTE: no mx="auto" here, so it won't be centered */}
  <Box maw={1100} w="100%">
    <ClubHeroCard
      name={club.name}
      logo={club.logo}
      description={club.description}
      tags={club.tags}
    />
  </Box>
</Box>
      

      {/* ==== Section 2: Events (same centering) ==== */}
      <Box py="lg">  {/* no inner width cap */}
        <EventList
  title="Club Events"
  views={["Upcoming", "Previous"]}
  onChangeView={(v) => console.log("selected:", v)}
  events={demoEvents}
/>
      </Box>
    </Box>
  );
}
