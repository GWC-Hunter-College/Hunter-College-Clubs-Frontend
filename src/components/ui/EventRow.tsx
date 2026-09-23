import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconChevronRight, IconCalendarPlus, IconPhoto } from "@tabler/icons-react";
import classes from "./EventRow.module.css";
import EventArt from "./EventArt";
import { IconButton } from "./Button";

type EventRowProps = {
  to: string;
  locationState?: unknown;
  artSrc?: string;
  artAlt: string;
  artClubId?: number;
  artTitle?: string;
  artSize: number;
  artRadius?: number;
  when: string;
  whenColor?: "brand" | "muted";
  title: string;
  meta?: ReactNode;
  onCalendar?: () => void;
  mobile?: boolean;
  gap?: number;
  pad?: number;
};

/** Row layout shared by the Events, Club and My Clubs lists. Whole row links to the event. */
export default function EventRow({
  to,
  locationState,
  artSrc,
  artAlt,
  artClubId = 0,
  artTitle,
  artSize,
  artRadius = 10,
  when,
  whenColor = "brand",
  title,
  meta,
  onCalendar,
  mobile,
  gap = 16,
  pad = 10,
}: EventRowProps) {
  return (
    <Link to={to} state={locationState} className={classes.row} style={{ gap, padding: pad }}>
      <div className={classes.art}>
        <EventArt src={artSrc} alt={artAlt} size={artSize} radius={artRadius} clubId={artClubId} title={artTitle} />
      </div>
      <div className={classes.body}>
        <span
          className="text-meta-mono-caps"
          style={{ color: whenColor === "brand" ? "var(--brand-primary)" : "var(--text-muted)" }}
        >
          {when}
        </span>
        <h3 className={`${classes.title} ${mobile ? "text-body-m-strong" : "text-heading-m"}`}>{title}</h3>
        {meta && <div className={`${classes.meta} text-caption`}>{meta}</div>}
      </div>
      {!mobile && onCalendar && (
        <span className={classes.calendarButton}>
          <IconButton
            variant="outline"
            size={44}
            icon={<IconCalendarPlus size={20} />}
            aria-label={`Add ${title} to calendar`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCalendar();
            }}
          />
        </span>
      )}
      <IconChevronRight size={20} className={classes.chevron} aria-hidden="true" />
    </Link>
  );
}

type PastEventRowProps = Omit<EventRowProps, "onCalendar" | "when"> & {
  date: string;
  photoCount?: number;
};

/** Same layout as the Club EventRow, art at 90% opacity, date muted, optional photo count. */
export function PastEventRow({ date, photoCount, meta, ...rest }: PastEventRowProps) {
  return (
    <EventRow
      {...rest}
      when={date}
      whenColor="muted"
      meta={
        <>
          {meta}
          {typeof photoCount === "number" && photoCount > 0 && (
            <span className={classes.photoLine}>
              <IconPhoto size={14} aria-hidden="true" />
              {photoCount} PHOTOS
            </span>
          )}
        </>
      }
    />
  );
}
