import { Box } from "@mantine/core";
import User from "../Other/User.tsx";
import bgImage from "../../assets/hero.png";

type HeroProps = {
  email?: string;
  signedIn: boolean;
  onSignIn: () => void;
  onSignOut?: () => void;
  title?: string;
};

export default function Hero({ email, signedIn, onSignIn, onSignOut, title }: HeroProps) {
  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        height: "100%",       // fill the Grid column height
        minHeight: 260,       // safety so it never collapses to 0
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Background image layer */}
      <Box
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",      // fill then crop
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* Overlay content (User) */}
      <Box
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1, // above the bg
        }}
      >
        <User
          email={email}
          signedIn={signedIn}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          title={title}
        />
      </Box>
    </Box>
  );
}
