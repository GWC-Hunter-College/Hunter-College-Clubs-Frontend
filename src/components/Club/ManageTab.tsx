import classes from "./ManageTab.module.css";
import EventArt from "../ui/EventArt";
import Button from "../ui/Button";
import { SoonPill, StatusPill } from "../ui/Pills";
import { formatShortDate } from "../../lib/datetime";
import type { Event } from "../../types/events";
import type { Club } from "../../types/club";

type ManageTabProps = {
  club: Club;
  events: Event[];
  onNewEvent: () => void;
};

/** Minimal manage view: drafts and upcoming events with a status pill; editing needs a backend endpoint. */
export default function ManageTab({ club, events, onNewEvent }: ManageTabProps) {
  const rows = [...events].sort((a, b) => +new Date(a.start) - +new Date(b.start));

  return (
    <div className={classes.section}>
      <div className={classes.actions}>
        <Button variant="primary" size="m" onClick={onNewEvent}>
          + NEW EVENT
        </Button>
      </div>
      {rows.length === 0 ? (
        <p className={`${classes.empty} text-body-m`}>No drafts or upcoming events yet.</p>
      ) : (
        rows.map((event) => (
          <div key={event.id} className={classes.row}>
            <EventArt src={event.flyer} alt={event.altText ?? event.title} size={56} radius={10} clubId={club.id} title={event.title} />
            <div className={classes.rowBody}>
              <h3 className={`${classes.title} text-body-m-strong`}>{event.title}</h3>
              <span className={`${classes.meta} text-caption`}>{formatShortDate(event.start, event.timezone)}</span>
            </div>
            <StatusPill status={event.status === "cancelled" ? "cancelled" : event.status === "draft" ? "draft" : "posted"} />
            <span className={classes.editButton}>
              <Button variant="outline" size="s" disabled>
                EDIT
              </Button>
              <SoonPill />
            </span>
          </div>
        ))
      )}
    </div>
  );
}
