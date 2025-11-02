import { Avatar, Box, Button, Flex, Text, Menu, ActionIcon } from "@mantine/core";
import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import admin from "../../assets/admin.png";

import type { AuthInfo } from "../../types/auth"; 

type UserProps = {
  auth?: AuthInfo;
  title?: string;           
};

export default function User({
  auth,
  title,
}: UserProps) {
  if (!auth) return null;
  const { email, signedIn, signIn, signOut } = auth;
  
  const showMenu = signedIn && typeof signOut === "function";

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
          onClick={signIn}
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
                <Menu.Item leftSection={<IconLogout size={14} />} onClick={signOut}>
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



