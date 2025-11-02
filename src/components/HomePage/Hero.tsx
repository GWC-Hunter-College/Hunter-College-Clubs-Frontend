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
        height: "100%",        
        borderRadius: 16,
        overflow: "hidden",    
      }}
    >

      <Box
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",     
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat",
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
