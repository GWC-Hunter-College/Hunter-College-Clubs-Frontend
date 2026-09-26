import classes from "./ClubLogo.module.css";
import { clubTintFor, clubTintGradient, initialsFor } from "../../lib/clubTint";
import { RoleDot, type Role } from "./Pills";

type ClubLogoProps = {
  clubId: number;
  name: string;
  logo?: string;
  size: number;
  /** Plain monogram variant (Create Club live preview): brand/strong fill, white initials. */
  plain?: boolean;
  role?: Role;
  className?: string;
};

/** Square club logo, radius 12, with a tint-gradient monogram fallback when there's no image. */
export default function ClubLogo({ clubId, name, logo, size, plain, role, className }: ClubLogoProps) {
  const initials = initialsFor(name).slice(0, 2);
  const fontSize = Math.max(11, Math.round(size * 0.36));

  const body = logo ? (
    <img
      src={logo}
      alt=""
      width={size}
      height={size}
      className={`${classes.logo} ${className ?? ""}`}
      style={{ width: size, height: size }}
    />
  ) : plain ? (
    <div
      className={`${classes.monogram} ${className ?? ""}`}
      style={{ width: size, height: size, background: "var(--brand-strong)", color: "#fff", fontSize }}
      aria-hidden="true"
    >
      {initials}
    </div>
  ) : (
    <div
      className={`${classes.monogram} ${className ?? ""}`}
      style={{ width: size, height: size, background: clubTintGradient(clubId), color: clubTintFor(clubId).text, fontSize }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );

  if (!role) return body;

  return (
    <span className={classes.wrap}>
      {body}
      <span className={classes.roleDot}>
        <RoleDot role={role} />
      </span>
    </span>
  );
}
