import { Link } from "react-router-dom";
import classes from "./EventTile.module.css";
import EventArt from "./EventArt";
import ClubLogo from "./ClubLogo";
import { formatRowWhen } from "../../lib/datetime";
import type { Event } from "../../types/events";

type EventTileClub = { id: number; name: string; logo?: string };

type EventTileProps = {
  event: Event;
  club?: EventTileClub;
  /** Mobile shows the club name only (no place). */
  mobile?: boolean;
};

/** Home/Events grid tile: square art, when (with end time), title, club + location. Whole tile links to the event. */
export default function EventTile({ event, club, mobile }: EventTileProps) {
  const clubName = club?.name ?? "Hunter CS";
  return (
    <Link to={`/event/${event.id}`} className={classes.tile} state={{ origin: "grid" }}>
      <div className={classes.art}>
        <EventArt src={event.flyer} alt={event.altText ?? event.title} size="100%" radius={0} clubId={club?.id ?? 0} title={event.title} />
      </div>
      <p className={`${classes.when} text-meta-mono-caps`}>{formatRowWhen(event.start, event.end, event.timezone)}</p>
      <h3 className={classes.title}>{event.title}</h3>
      <div className={classes.meta}>
        {!mobile && <span className={`${classes.location} text-caption`}>{event.location}</span>}
        <div className={classes.clubRow}>
          <ClubLogo clubId={club?.id ?? 0} name={clubName} logo={club?.logo} size={18} />
          <span className="text-caption">{clubName}</span>
        </div>
      </div>
    </Link>
  );
}
