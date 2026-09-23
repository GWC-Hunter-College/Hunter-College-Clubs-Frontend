import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import classes from "./WhenWhereCard.module.css";
import { formatEventPageDate, formatEventPageTime } from "../../lib/datetime";
import type { Event } from "../../types/events";

export default function WhenWhereCard({ event }: { event: Event }) {
  const [placePrimary, ...rest] = event.location.split(",");
  const placeSecondary = rest.join(",").trim();

  return (
    <div className={classes.card}>
      <div className={classes.row}>
        <span className={classes.icon} aria-hidden="true">
          <IconCalendar size={22} />
        </span>
        <div className={classes.text}>
          <p className={`${classes.primary} text-body-m-strong`}>{formatEventPageDate(event.start, event.end, event.timezone)}</p>
          <p className={`${classes.secondary} text-body-m`}>{formatEventPageTime(event.start, event.end, event.timezone)}</p>
        </div>
      </div>
      <div className={classes.row}>
        <span className={classes.icon} aria-hidden="true">
          <IconMapPin size={22} />
        </span>
        <div className={classes.text}>
          <p className={`${classes.primary} text-body-m-strong`}>{placePrimary}</p>
          {placeSecondary && <p className={`${classes.secondary} text-body-m`}>{placeSecondary}</p>}
        </div>
      </div>
    </div>
  );
}
