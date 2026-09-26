import classes from "./EventArt.module.css";
import { clubTintGradient } from "../../lib/clubTint";

type EventArtProps = {
  src?: string;
  alt: string;
  size?: number | string;
  radius?: number | string;
  clubId?: number;
  title?: string;
  opacity?: number;
  className?: string;
};

/** Square event flyer, with the host club's tint gradient as a fallback when there's no flyer. */
export default function EventArt({ src, alt, size = 64, radius = 12, clubId = 0, title, opacity, className }: EventArtProps) {
  const dimension = typeof size === "number" ? `${size}px` : size;
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${classes.art} ${className ?? ""}`}
        style={{ width: dimension, height: dimension, borderRadius: radius, opacity }}
      />
    );
  }
  return (
    <div
      className={`${classes.fallback} ${className ?? ""}`}
      style={{ width: dimension, height: dimension, borderRadius: radius, background: clubTintGradient(clubId), opacity }}
      role="img"
      aria-label={alt}
    >
      {title && (
        <span className={classes.fallbackTitle} style={{ fontSize: typeof size === "number" ? Math.max(10, size * 0.09) : 14 }}>
          {title}
        </span>
      )}
    </div>
  );
}
