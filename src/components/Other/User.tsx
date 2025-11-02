import { Avatar, Box, Button, Flex, Text, Menu, ActionIcon } from "@mantine/core";
import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import admin from "../../assets/admin.png";

type UserProps = {
  email?: string;
  signedIn: boolean;
  onSignIn: () => void;
  onSignOut?: () => void;  
  title?: string;           
};

export default function User({
  email,
  signedIn,
  onSignIn,
  onSignOut,
  title,
}: UserProps) {
  const showMenu = signedIn && typeof onSignOut === "function";

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
          size="sm"
          fw={500}
          style={{ fontStyle: "italic", fontFamily: "Roboto Mono, monospace" }}
        >
          Sign in
        </Button>
      </Flex>
    );
  }

  return (
<Flex
      align="center"
      gap="sm"
      p="md"
      style={{
        backgroundColor: "#2D203E",
        borderRadius: "16px",
        width: "fit-content",
      }}
    >
      <Avatar src={admin} alt="Profile picture" radius="xl" />

      <Box>
        {/* Email row with inline menu */}
        <Flex align="center" gap="xs">
          <Text size="sm" fw={700}>{email ?? "Unknown"}</Text>

          {showMenu && (
            <Menu withinPortal position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" aria-label="Open user menu">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconLogout size={14} />} onClick={onSignOut}>
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>

        {title && (
          <Text
            size="sm"
            fw={500}
            style={{ fontStyle: "italic", fontFamily: "Roboto Mono, monospace" }}
          >
            {title}
          </Text>
        )}
      </Box>
    </Flex>
  );
}



