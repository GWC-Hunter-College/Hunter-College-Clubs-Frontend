import { Container, Skeleton, Stack, Title } from "@mantine/core";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { Card, Image, Text, Group, Button, Grid } from "@mantine/core";

type Club = {
  name: string;
  logo: string;
  description: string;
  tags: string[];
};

export default function Home() {
  let { clubId } = useParams();

  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    const fetchedClub: Club = {
      name: "Girls Who Code",
      logo: "/images/gwc.png", // put your logo path here
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      tags: ["Tech", "Academic"],
    };

    setClub(fetchedClub);
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
    <Card shadow="md" radius="md" padding="lg" withBorder>
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Image src={club.logo} radius="md" alt={club.name} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Text fw={700} fz="xl">
            {club.name}
          </Text>
          <Text mt="sm" c="dimmed">
            {club.description}
          </Text>

          <Group mt="md">
            {club.tags.map((tag) => (
              <Button key={tag} variant="light">
                {tag}
              </Button>
            ))}
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
