import { Box } from "@mantine/core";
import User from "./User";
import bgImage from "../../assets/hero.png";

export default function Hero() {
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
        <User />
      </Box>
    </Box>
  );
}
