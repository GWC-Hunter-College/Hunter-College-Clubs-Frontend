import { Box } from "@mantine/core";
import { Link } from "react-router-dom";
import type { Event } from "../../types/events";
import "./ClubLogoLink.css";

type Size = "sm" | "md" | "lg";
type Offset = "none" | "sm" | "md" | "lg";

type Props = {
  owner?: Event["owner"];
  /** visual size preset */
  size?: Size;          // default "md" (56px)
  /** hover nudge preset */
  offset?: Offset;      // default "md" (5px)
  /** fallback logo if none provided */
  fallbackSrc?: string;
  /** aria-label override when link is present */
  ariaLabel?: string;
};

export default function ClubLogoLink({
  owner,
  size = "md",
  offset = "md",
  fallbackSrc = "/logo.png",
  ariaLabel,
}: Props) {
  const to = owner?.id != null ? `/club/${owner.id}` : null;
  const logoSrc = owner?.logo ?? fallbackSrc;

  const className = `cllogo__link cllogo--${size} cllogo--offset-${offset}`;
  const contents = (
    <>
      <span className="cllogo__backer" />
      {/* empty alt since the link itself is labeled */}
      <img className="cllogo__img" src={logoSrc} alt="" />
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        aria-label={ariaLabel ?? `Go to ${owner?.id ?? "club"} page`}
      >
        {contents}
      </Link>
    );
  }

  return (
    <Box className={className} aria-hidden="true">
      {contents}
    </Box>
  );
}
