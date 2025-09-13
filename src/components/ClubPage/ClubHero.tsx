// components/ClubPage/ClubHero.tsx
import { Box, Flex, Image, Title, Text, Group, Button } from "@mantine/core";

type Props = {
  name: string;
  logo: string;
  description: string;
  tags: string[];
  className?: string;
};

export default function ClubHeroCard({
  name,
  logo,
  description,
  tags,
  className,
}: Props) {
  return (
    <Box
      className={className}
      style={{
        width: "100%",
        background: "rgba(231, 214, 255, .15)",
        borderRadius: 16,
        // responsive inner padding
        padding: "clamp(16px, 2.5vw, 28px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Flex gap={24} align="stretch" direction={{ base: "column", md: "row" }}>
        {/* Left: Logo (square, scales with viewport) */}
        <Box
          style={{
            flex: "0 0 auto",
            width: "min(320px, 40vw)", // shrink on half screens
            aspectRatio: "1 / 1",      // keep it square
            alignSelf: "flex-start",
          }}
        >
          <Image
            src={logo}
            alt={`${name} logo`}
            radius="md"
            fit="cover"
            h="100%"
            w="100%"
          />
        </Box>

        {/* Right: Content */}
        <Flex direction="column" gap={12} style={{ flex: 1, minWidth: 0 }}>
          <Title
            order={1}
            // responsive font size for nicer half-screen layout
            fz={{ base: 28, sm: 32, md: 36 }}
            style={{ color: "white", letterSpacing: 1, lineHeight: 1.1 }}
          >
            {name.toUpperCase()}
          </Title>

          <Text c="gray.3" lh={1.6}>
            {description}
          </Text>

          <Group mt={8} gap="md" wrap="wrap">
            {tags.map((t) => (
              <Button
                key={t}
                variant="default"
                radius="xl"
                style={{
                  background: "#E7E5EA",
                  color: "#1E1A22",
                  border: "none",
                  paddingInline: 22,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                }}
              >
                {t.toUpperCase()}
              </Button>
            ))}
          </Group>
        </Flex>
      </Flex>
    </Box>
  );
}
