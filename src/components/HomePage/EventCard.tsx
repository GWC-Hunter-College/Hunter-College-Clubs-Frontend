import { Box, Image, Text } from "@mantine/core";

type EventCardProps = {
  flyer: string;   // main flyer image
  logo: string;    // club logo
  month?: string;  // month label, e.g. "SEPTEMBER 2025"
  altText?: string;
};

export default function EventCard({
  flyer,
  logo,
  month,
  altText = "Event flyer",
}: EventCardProps) {
  return (
    <Box style={{ textAlign: "center" }}>
      {/* Month Label */}
      {month && (
        <Text
          fw={600}
          size="lg"
          style={{
            fontFamily: "Roboto Mono, monospace",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
            color: "white",
            letterSpacing: "2px",
          }}
        >
          {month}
        </Text>
      )}

      {/* Card */}
      <Box
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "white",
          flex: "1 1 300px",  // base width ~300px, shrink if needed
          maxWidth: "350px",  // don’t get huge on wide screens
          minWidth: "250px",  // don’t shrink smaller than this
          margin: "0 auto",
        }}
      >
        <Image src={flyer} alt={altText} radius="md" />

        <Box
          style={{
            position: "absolute",
            bottom: "4%",
            right: "4%",
            backgroundColor: "white",
            padding: "4px",
            borderRadius: "12px",
            width: "20%",            
            aspectRatio: "1 / 1",  
          }}
        >
          <Image src={logo} alt="Club logo" fit="contain" />
      </Box>
      </Box>
    </Box>
  );
}
