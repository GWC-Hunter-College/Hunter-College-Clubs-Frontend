import { Card, Text, Button, Center, Stack } from "@mantine/core";
import type { AuthInfo } from "../../types/auth";

type SignInGateProps = {
  auth: AuthInfo;
  message?: string;
  buttonLabel?: string;
};

export default function SignInGate({
  auth,
  message = "You need to sign in to create a club.",
  buttonLabel = "Sign in",
}: SignInGateProps) {
  return (
    <Center mih={360}>
      <Card radius="lg" withBorder padding="lg" w={420}>
        <Stack gap="sm">
          <Text>{message}</Text>
          <Button onClick={auth.signIn} aria-label="Sign in">
            {buttonLabel}
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
