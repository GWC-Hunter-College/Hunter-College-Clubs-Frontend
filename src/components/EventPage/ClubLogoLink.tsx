import { Box } from "@mantine/core";
import { Link } from "react-router-dom";
import type { Event } from "../../types/events";
import "./ClubLogoLink.css";

type Size = "sm" | "md" | "lg";
type Offset = "none" | "sm" | "md" | "lg";

type Props = {
  owner?: Event["owner"];
  size?: Size;                 // default "md"
  offset?: Offset;             // default "md"
  fallbackSrc?: string;
  ariaLabel?: string;
  onClick?: () => void;        // ← new: allow parent to react to clicks
};

export default function ClubLogoLink({
  owner,
  size = "md",
  offset = "md",
  fallbackSrc = "/logo.png",
  ariaLabel,
  onClick,
}: Props) {
  const to = owner?.id != null ? `/club/${owner.id}` : null;
  const logoSrc = owner?.logo ?? fallbackSrc;

  const className = `cllogo__link cllogo--${size} cllogo--offset-${offset}`;

  const contents = (
    <>
      <span className="cllogo__backer" />
      <img className="cllogo__img" src={logoSrc} alt="" />
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        aria-label={ariaLabel ?? `Go to ${owner?.id ?? "club"} page`}
        onClick={onClick}                    // ← close modal before navigating
      >
        {contents}
      </Link>
    );
  }

  // No destination: behave like a button so close still works
  return (
    <Box
      className={className}
      role="button"
      tabIndex={0}
      aria-hidden="false"
      aria-label={ariaLabel ?? "Close"}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      {contents}
    </Box>
  );
}
