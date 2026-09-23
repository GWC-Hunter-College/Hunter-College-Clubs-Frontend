import { IconHome, IconCalendarEvent, IconUsersGroup, IconPlus, IconUserCircle } from "@tabler/icons-react";
import type { NavKey } from "./context";

export const DESTINATIONS: Array<{ key: NavKey; label: string; to: string; icon: (size: number) => React.ReactNode }> = [
  { key: "home", label: "HOME", to: "/", icon: (size) => <IconHome size={size} /> },
  { key: "events", label: "EVENTS", to: "/events", icon: (size) => <IconCalendarEvent size={size} /> },
  { key: "clubs", label: "CLUBS", to: "/clubs", icon: (size) => <IconUsersGroup size={size} /> },
  { key: "create", label: "CREATE", to: "/create", icon: (size) => <IconPlus size={size} /> },
  { key: "my-clubs", label: "MY CLUBS", to: "/my-clubs", icon: (size) => <IconUserCircle size={size} /> },
];

/** Default active-destination rule from the pathname; pages override via useNavOverride when needed. */
export function navKeyForPath(pathname: string): NavKey {
  if (pathname === "/") return "home";
  if (
    pathname === "/create" ||
    pathname === "/event/create" ||
    pathname === "/club/create" ||
    /^\/club\/[^/]+\/event\/new$/.test(pathname)
  ) {
    return "create";
  }
  if (pathname.startsWith("/events") || pathname.startsWith("/event/")) return "events";
  if (pathname.startsWith("/my-clubs")) return "my-clubs";
  if (pathname.startsWith("/clubs") || pathname.startsWith("/club/")) return "clubs";
  return "home";
}
