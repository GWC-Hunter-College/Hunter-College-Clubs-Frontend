import { Link } from "react-router-dom";
import classes from "./Hero.module.css";
import EventArt from "../ui/EventArt";
import type { Event } from "../../types/events";
import type { Club } from "../../types/club";

type HeroProps = {
  events: Event[];
  clubsById: Map<number, Club>;
  mobile?: boolean;
};

const DESKTOP_TILES = [
  { width: 203, height: 203, left: 12, top: 65 },
  { width: 178, height: 258, left: 228, top: 114 },
  { width: 178, height: 258, left: 419, top: 28 },
];

const MOBILE_TILES = [
  { width: 136, height: 136, left: 16, top: 12 },
  { width: 124, height: 148, left: 168, top: 20 },
  { width: 124, height: 148, left: 304, top: 8 },
];

/** Home hero: brand spine, pitch text, and a static strip of the next few upcoming events' flyers. */
export default function Hero({ events, clubsById, mobile }: HeroProps) {
  const tiles = events.slice(0, 3);
  const positions = mobile ? MOBILE_TILES : DESKTOP_TILES;

  const spine = (
    <span>
      HUNTER <span>CS</span>
    </span>
  );

  if (mobile) {
    return (
      <div className={classes.mobileCard}>
        <div className={classes.mobileTop}>
          <div className={classes.mobileSpine}>
            <span className={classes.mobileSpineText}>{spine}</span>
          </div>
          <div className={classes.mobileText}>
            <p className={`${classes.eyebrow} text-meta-mono-caps`}>HUNTER COLLEGE &middot; CS</p>
            <h1 className={`${classes.title} text-display-m`}>CLUBS &amp; EVENTS</h1>
            <p className={`${classes.desc} text-body-m`}>
              Workshops, build nights and meetups from student clubs at Hunter CS. Look around, no account needed.
            </p>
          </div>
        </div>
        <div className={classes.mobileStrip}>
          {tiles.map((event, i) => {
            const pos = positions[i];
            const club = event.owner ? clubsById.get(event.owner.id) : undefined;
            return (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className={classes.stripTile}
                style={{ width: pos.width, height: pos.height, left: pos.left, top: pos.top }}
              >
                <EventArt src={event.flyer} alt={event.altText ?? event.title} size="100%" radius={0} clubId={club?.id ?? 0} title={event.title} />
              </Link>
            );
          })}
          <div className={classes.dots}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`${classes.dot} ${i === 0 ? classes.active : ""}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.card}>
      <div className={classes.spine}>
        <span className={classes.spineText}>{spine}</span>
      </div>
      <div className={classes.text}>
        <p className={`${classes.eyebrow} text-meta-mono-caps`}>HUNTER COLLEGE &middot; COMPUTER SCIENCE</p>
        <h1 className={`${classes.title} text-display-l`}>CLUBS &amp; EVENTS</h1>
        <p className={`${classes.desc} text-body-l`}>
          Workshops, build nights and meetups from student clubs at Hunter CS. Look around, no account needed.
        </p>
      </div>
      <div className={classes.strip}>
        {tiles.map((event, i) => {
          const pos = positions[i];
          const club = event.owner ? clubsById.get(event.owner.id) : undefined;
          return (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className={classes.stripTile}
              style={{ width: pos.width, height: pos.height, left: pos.left, top: pos.top }}
            >
              <EventArt src={event.flyer} alt={event.altText ?? event.title} size="100%" radius={0} clubId={club?.id ?? 0} title={event.title} />
            </Link>
          );
        })}
        <div className={classes.dots}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`${classes.dot} ${i === 0 ? classes.active : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
