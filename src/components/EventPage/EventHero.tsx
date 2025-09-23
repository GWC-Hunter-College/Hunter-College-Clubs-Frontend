import { Box, Container } from "@mantine/core";

type Props = {
  src?: string;
  alt?: string;
  mt?: number | string;   // top margin
  height?: number;        // fixed stage height
  maxHeight?: number;     // hard cap
  bg?: string;            // optional background
};

export default function EventHero({
  src,
  alt = "Event poster",
  mt = 30,
  height = 400,
  maxHeight = 550,
  bg,
}: Props) {
  const posterSrc = src ?? "/card.png";

  return (
    <Container fluid px={0}>
      <Box
        mt={mt}
        style={{
          width: "100%",
          height,
          maxHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: bg,
        }}
      >
        <img
          src={posterSrc}
          alt={alt}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>
    </Container>
  );
}
