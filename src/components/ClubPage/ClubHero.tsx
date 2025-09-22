// components/ClubPage/ClubHero.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Title,
  Text,
  Group,
  Button,
  Anchor,
  Grid,
} from "@mantine/core";

import type { Club } from "../../types/club";

type Common = {
  className?: string;
  onBack?: () => void;
  backFallbackHref?: string;
};

type Props =
   ({
      club: Club;
    } & Common);

export default function ClubHeroCard(props: Props){
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);


  const onBack = props.onBack ?? undefined;
  const backFallbackHref = props.backFallbackHref ?? undefined;

  const className = props.className ?? undefined;

  const handleBack = () => {
    if (onBack) return onBack();
    if (window.history.length > 1) navigate(-1);
    else if (backFallbackHref) navigate(backFallbackHref);
    else navigate("/");
  };

  return (
    <Box
      className={className}
      style={{
        position: "relative",
        width: "100%",
        background: "rgba(231, 214, 255, .15)",
        borderRadius: 16,
        padding: "clamp(16px, 2.5vw, 28px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Back link — top-left */}
      <Anchor
        component="button"
        onClick={handleBack}
        underline="hover"
        c={hovered ? "white" : "gray.6"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
          fontWeight: 600,
          letterSpacing: 0.2,
          transition: "color 120ms ease",
        }}
        aria-label="Go back"
      >
        {"← Go back"}
      </Anchor>

      {/* Title row */}
      <Title
        order={1}
        fz={{ base: 30, sm: 34, md: 38, lg: 42 }}
        style={{ color: "white", letterSpacing: 1, lineHeight: 1.1, marginTop: 12, marginBottom: 16 }}
      >
        {props.club.name.toUpperCase()}
      </Title>

      {/* Content grid: image left, text right; stacks on small */}
      <Grid gutter={24}>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box
            style={{
              // keep it prominent but not huge
              width: "clamp(180px, 22vw, 260px)",
              aspectRatio: "1 / 1",
            }}
          >
            <Image src={props.club.logo} alt={`${props.club.name} logo`} radius="md" fit="cover" w="100%" h="100%" />
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Text c="gray.3" lh={1.6} mb="md">
            {props.club.description}
          </Text>

          <Group gap="md" wrap="wrap">
            {props.club.tags.map((t) => (
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
        </Grid.Col>
      </Grid>
    </Box>
  );
}
