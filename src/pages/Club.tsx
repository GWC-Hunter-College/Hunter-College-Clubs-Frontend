import { Skeleton, Stack, Title } from "@mantine/core";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { Box, Container } from "@mantine/core";
import ClubHeroCard from "../components/ClubPage/ClubHero";

import placeholderLogo from "../assets/logo.png";


type Club = {
  name: string;
  logo: string;
  description: string;
  tags: string[];
};

export default function ClubPage() {
  let { clubId } = useParams();

  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    const fetchedClub: Club = {
      name: "Girls Who Code",
      logo: placeholderLogo, // put your logo path here
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      // tags: ["Tech", "Academic"],
      tags: [],
    };

    setClub(fetchedClub);
    // setClub(null);
  }, []); 

  if(!club){
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">
          Club Page {clubId}
        </Title>

        <Stack gap="md">
          {/* Hero section */}
          <Skeleton height={50} radius="md" />

          {/* Cards / content placeholders */}
          <Skeleton height={200} radius="md" />
          <Skeleton height={200} radius="md" />
          <Skeleton height={200} radius="md" />

          {/* Footer / CTA placeholder */}
          <Skeleton height={60} radius="md" />
        </Stack>
      </Container>
    );
  }

  return (
    <Box style={{ minHeight: "100dvh" }}>
      <Container fluid px={0} style={{ minHeight: "100dvh" }}>
        <Box
          style={{
            minHeight: "100dvh",
            display: "grid",
            placeItems: "center",
            // responsive page padding
            padding: "min(4vw, 32px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "clamp(320px, 92vw, 1100px)",
              marginInline: "auto",
            }}
          >
            <ClubHeroCard
              name={club.name}
              logo={club.logo}
              description={club.description}
              tags={club.tags}
            />
          </div>
        </Box>
      </Container>
    </Box>
  );
}
