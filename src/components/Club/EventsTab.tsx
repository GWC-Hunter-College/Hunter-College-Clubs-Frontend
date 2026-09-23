import { useMemo, useState } from "react";
import { IconMapPin, IconCalendarEvent, IconChevronDown } from "@tabler/icons-react";
import classes from "./EventsTab.module.css";
import SectionHeader from "../ui/SectionHeader";
import EventRow, { PastEventRow } from "../ui/EventRow";
import { SemesterHeader } from "../ui/Agenda";
import { CountPill } from "../ui/Pills";
import Button from "../ui/Button";
import ComingSoonPanel from "../ui/ComingSoonPanel";
import { downloadIcs } from "../../lib/ics";
import { formatRowWhen, formatTileWhen, semesterKey, semesterLabel, semesterOf } from "../../lib/datetime";
import type { Event } from "../../types/events";
import type { Club } from "../../types/club";

type EventsTabProps = {
  club: Club;
  upcoming: Event[];
  past: Event[];
  mobile?: boolean;
  canManage: boolean;
  onNewEvent: () => void;
};

export default function EventsTab({ club, upcoming, past, mobile, canManage, onNewEvent }: EventsTabProps) {
  const [expanded, setExpanded] = useState(false);
  const [visibleGroups, setVisibleGroups] = useState(3);

  const semesterGroups = useMemo(() => {
    const groups: Array<{ key: string; label: string; events: Event[] }> = [];
    const now = new Date();
    for (const event of past) {
      const sem = semesterOf(event.start, event.timezone);
      const key = semesterKey(sem);
      let group = groups.find((g) => g.key === key);
      if (!group) {
        const current = semesterOf(now.toISOString());
        group = { key, label: semesterLabel(sem, key === semesterKey(current)), events: [] };
        groups.push(group);
      }
      group.events.push(event);
    }
    return groups;
  }, [past]);

  const oldestYear = past.length > 0 ? new Date(past[past.length - 1].start).getFullYear() : undefined;
  const artSize = mobile ? 76 : 112;

  return (
    <div className={classes.section}>
      <SectionHeader title="Upcoming" countPill={<CountPill>{upcoming.length}</CountPill>} />
      {upcoming.length === 0 ? (
        <ComingSoonPanel
          icon={<IconCalendarEvent size={30} />}
          title="No upcoming events"
          text="This club hasn't posted any upcoming events yet."
          action={
            canManage ? (
              <Button variant="primary" size="m" onClick={onNewEvent}>
                + NEW EVENT
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className={classes.rows}>
          {upcoming.map((event) => (
            <EventRow
              key={event.id}
              to={`/event/${event.id}`}
              locationState={{ origin: "club", clubId: club.id, clubName: club.name }}
              artSrc={event.flyer}
              artAlt={event.altText ?? event.title}
              artClubId={club.id}
              artTitle={event.title}
              artSize={artSize}
              artRadius={mobile ? 8 : 10}
              when={mobile ? formatTileWhen(event.start, event.timezone) : formatRowWhen(event.start, event.end, event.timezone)}
              title={event.title}
              mobile={mobile}
              gap={mobile ? 12 : 20}
              pad={mobile ? 10 : 12}
              meta={
                <span className={classes.meta}>
                  {!mobile && <IconMapPin size={14} aria-hidden="true" />}
                  <span>{event.location}</span>
                </span>
              }
              onCalendar={
                event.status === "cancelled"
                  ? undefined
                  : () => downloadIcs(event, `${window.location.origin}/event/${event.id}`)
              }
            />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className={classes.toggleWrap}>
          <Button variant="outline" size="m" onClick={() => setExpanded((v) => !v)} rightIcon={<IconChevronDown size={16} />}>
            {expanded ? "HIDE PAST EVENTS" : "SHOW PAST EVENTS"}
          </Button>
          {!expanded && (
            <span className={`${classes.toggleCaption} text-caption`}>
              {past.length} past events &middot; since {oldestYear}
            </span>
          )}
        </div>
      )}

      {expanded && (
        <div className={classes.pastHeader}>
          <SectionHeader title="Past events" countPill={<CountPill>{past.length}</CountPill>} />
          {semesterGroups.slice(0, visibleGroups).map((group) => (
            <div key={group.key} className={classes.semesterGroup}>
              <SemesterHeader label={group.label} />
              {group.events.map((event) => (
                <PastEventRow
                  key={event.id}
                  to={`/event/${event.id}`}
                  locationState={{ origin: "club", clubId: club.id, clubName: club.name }}
                  artSrc={event.flyer}
                  artAlt={event.altText ?? event.title}
                  artClubId={club.id}
                  artTitle={event.title}
                  artSize={artSize}
                  artRadius={mobile ? 8 : 10}
                  date={mobile ? formatTileWhen(event.start, event.timezone) : formatRowWhen(event.start, event.end, event.timezone)}
                  title={event.title}
                  mobile={mobile}
                  gap={mobile ? 12 : 20}
                  pad={mobile ? 10 : 12}
                  photoCount={event.images?.length}
                  meta={
                    <span className={classes.meta}>
                      {!mobile && <IconMapPin size={14} aria-hidden="true" />}
                      <span>{event.location}</span>
                    </span>
                  }
                />
              ))}
            </div>
          ))}
          <div className={classes.loadMoreRow}>
            {visibleGroups < semesterGroups.length && (
              <Button variant="outline" size="m" onClick={() => setVisibleGroups((v) => v + 3)}>
                LOAD {semesterGroups[visibleGroups]?.label.split(" · ")[0]} AND EARLIER &darr;
              </Button>
            )}
            <Button variant="ghost" size="s" onClick={() => setExpanded(false)}>
              HIDE PAST EVENTS &uarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
