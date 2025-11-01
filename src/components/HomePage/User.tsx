import { Avatar, Box, Button, Flex, Text } from "@mantine/core";
// import { useAuth } from "react-oidc-context";
import admin from "../../assets/admin.png";

type AdminProps = {
  email?: string;
  signedIn: boolean;
  onSignIn: () => void;
};

export default function User({ email, signedIn, onSignIn }: AdminProps) {
  // const auth = useAuth();
  // const user = auth.user;
  // const email = user?.profile.email;

  // === If user not signed in, show Sign In button ===
  if (!signedIn) {
    return (
      <Flex
        align="center"
        justify="center"
        p="md"
        style={{
          backgroundColor: "#2D203E",
          borderRadius: "16px",
          width: "fit-content",
        }}
      >
        <Button
          onClick={onSignIn}
          radius="xl"
          style={{
            backgroundColor: "#B57FFF",
            color: "white",
            fontFamily: "Roboto Mono, monospace",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          SIGN IN
        </Button>
      </Flex>
    );
  }

  // === Otherwise, display user info ===
  return (
    <Flex
      align="center"
      p="md"
      style={{
        backgroundColor: "#2D203E",
        borderRadius: "16px",
        width: "fit-content",
      }}
      gap="sm"
    >
      <Box style={{ position: "relative" }}>
        <Avatar src={admin} size={70} radius="xl" />
      </Box>

      <Box>
        <Text
          fw={700}
          size="lg"
          style={{ fontFamily: "Roboto Mono, monospace" }}
        >
          {email}
        </Text>

        <Flex align="center" gap="xs">
          <Box
            w={20}
            h={20}
            style={{
              borderRadius: "50%",
              backgroundColor: "#E879F9",
            }}
          />
          <Text
            size="sm"
            fw={500}
            style={{
              fontStyle: "italic",
              fontFamily: "Roboto Mono, monospace",
            }}
          >
            Admin
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
