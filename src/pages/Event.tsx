import { Container, Skeleton, Stack, Title } from "@mantine/core";

export default function Home() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Event Page
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
