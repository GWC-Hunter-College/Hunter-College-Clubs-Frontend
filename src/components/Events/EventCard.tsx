// components/Events/EventCard.tsx
import { Box, Image } from "@mantine/core";

type EventCardProps = {
  flyer: string;
  logo: string;
  altText?: string;
};

export default function EventCard({ flyer, logo, altText = "Event flyer" }: EventCardProps) {
  return (
    <Box
      pos="relative"
      w="100%"
      maw={360}                // tighter cap so cards never get huge
      miw={220}
      style={{
        aspectRatio: "1 / 1",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Image src={flyer} alt={altText} w="100%" h="100%" fit="cover" />

      <Box
        pos="absolute"
        bottom="4%"
        right="4%"
        bg="white"
        p={6}
        style={{
          borderRadius: 12,
          width: "min(22%, 60px)",
          aspectRatio: "1 / 1",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        }}
      >
        <Image src={logo} alt="Club logo" fit="contain" />
      </Box>
    </Box>
  );
}
