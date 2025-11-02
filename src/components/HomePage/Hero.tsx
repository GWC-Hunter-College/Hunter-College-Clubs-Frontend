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
        display: "grid",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >

      <img
        src={bgImage}
        alt="Retro landscape"
        style={{
          gridArea: "1/1", 
          width: "100%",
          height: "auto",
        }}
      />


      <Box
        style={{
          gridArea: "1/1", 
          display: "flex",
          justifyContent: "flex-end", 
          alignItems: "flex-start",  
          padding: "1rem",
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
