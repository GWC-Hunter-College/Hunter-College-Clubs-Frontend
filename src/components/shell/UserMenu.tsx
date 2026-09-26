import { Menu } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import classes from "./UserMenu.module.css";
import Button from "../ui/Button";
import admin from "../../assets/admin.png";
import type { AuthInfo } from "../../types/auth";

export default function UserMenu({ auth }: { auth: AuthInfo }) {
  if (!auth.signedIn) {
    return (
      <Button variant="primary" size="m" onClick={() => auth.signIn()}>
        SIGN IN
      </Button>
    );
  }

  return (
    <Menu withinPortal position="bottom-end" width={220}>
      <Menu.Target>
        <button type="button" className={classes.trigger} aria-label="Open account menu">
          <img src={admin} alt="" />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <span className={`${classes.email} text-caption`}>{auth.email ?? "Signed in"}</span>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={16} />} onClick={() => auth.signOut()}>
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
