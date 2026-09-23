import { useMemo, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import { SearchField } from "../components/ui/Inputs";
import EventRow from "../components/ui/EventRow";
import { AgendaDay, MobileDayGroup, MonthHeader } from "../components/ui/Agenda";
import ClubLogo from "../components/ui/ClubLogo";
import { StatusPill } from "../components/ui/Pills";
import Button from "../components/ui/Button";
import useEvents from "../hooks/useEvents";
import useClubs from "../hooks/useClubs";
import useClubsById from "../hooks/useClubsById";
import { isUpcoming } from "../types/events";
import type { Event } from "../types/events";
import type { Club } from "../types/club";
import { formatDayLabel, formatMonthHeader, formatTimeRange } from "../lib/datetime";
import { downloadIcs } from "../lib/ics";
import classes from "./Events.module.css";

export default function Events() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const { events } = useEvents();
  const { clubs } = useClubs();
  const clubsById = useClubsById(clubs);
  const [query, setQuery] = useState("");

  const upcoming = useMemo(
    () => events.filter((event) => isUpcoming(event)).sort((a, b) => +new Date(a.start) - +new Date(b.start)),
    [events],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return upcoming;
    return upcoming.filter((event) => {
      const club = event.owner ? clubsById.get(event.owner.id) : undefined;
      return (
        event.title.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        (club?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [upcoming, query, clubsById]);

  const monthGroups = useMemo(() => {
    const months: Array<{ key: string; label: string; days: Array<{ key: string; iso: string; events: typeof filtered }> }> = [];
    for (const event of filtered) {
      const monthKey = formatMonthHeader(event.start, event.timezone);
      let month = months.find((m) => m.key === monthKey);
      if (!month) {
        month = { key: monthKey, label: monthKey, days: [] };
        months.push(month);
      }
      const dayKey = new Date(event.start).toDateString();
      let day = month.days.find((d) => d.key === dayKey);
      if (!day) {
        day = { key: dayKey, iso: event.start, events: [] };
        month.days.push(day);
      }
      day.events.push(event);
    }
    return months;
  }, [filtered]);

  return (
    <AppShell>
      <PageContainer>
        <div className={classes.page}>
          <PageHeader
            eyebrow="EVENTS"
            title="EVERYTHING COMING UP"
            subtitle={`${upcoming.length} upcoming events from Hunter CS clubs, in date order.`}
          />
          <SearchField
            compact={!isDesktop}
            placeholder={isDesktop ? "Search events by name, club or place…" : "Search events…"}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            aria-label="Search events"
          />

          {monthGroups.length === 0 ? (
            <div className={classes.empty}>
              {query ? (
                <p className="text-body-m">No events match &ldquo;{query}&rdquo;.</p>
              ) : (
                <>
                  <p className="text-body-m">No upcoming events yet.</p>
                  <Button to="/clubs" variant="ghost" size="m">
                    BROWSE CLUBS &rarr;
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className={classes.agenda}>
              {monthGroups.map((month) => (
                <div key={month.key} className={classes.monthGroup}>
                  <MonthHeader iso={month.days[0].iso} />
                  {month.days.map((day) =>
                    isDesktop ? (
                      <AgendaDay key={day.key} iso={day.iso}>
                        {day.events.map((event) => (
                          <EventRowItem key={event.id} event={event} club={event.owner ? clubsById.get(event.owner.id) : undefined} />
                        ))}
                      </AgendaDay>
                    ) : (
                      <MobileDayGroup key={day.key} label={formatDayLabel(day.iso)}>
                        {day.events.map((event) => (
                          <EventRowItem
                            key={event.id}
                            event={event}
                            club={event.owner ? clubsById.get(event.owner.id) : undefined}
                            mobile
                          />
                        ))}
                      </MobileDayGroup>
                    ),
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}

function EventRowItem({ event, club, mobile }: { event: Event; club?: Club; mobile?: boolean }) {
  const cancelled = event.status === "cancelled";
  return (
    <EventRow
      to={`/event/${event.id}`}
      locationState={{ origin: "events" }}
      artSrc={event.flyer}
      artAlt={event.altText ?? event.title}
      artClubId={club?.id ?? 0}
      artTitle={event.title}
      artSize={mobile ? 60 : 64}
      when={formatTimeRange(event.start, event.end, event.timezone)}
      title={event.title}
      meta={
        <div className={classes.clubLine}>
          <ClubLogo clubId={club?.id ?? 0} name={club?.name ?? "Hunter CS"} logo={club?.logo} size={mobile ? 16 : 18} />
          <span>{club?.name ?? "Hunter CS"} &middot; {event.location}</span>
          {cancelled && <StatusPill status="cancelled" />}
        </div>
      }
      onCalendar={cancelled ? undefined : () => downloadIcs(event, `${window.location.origin}/event/${event.id}`)}
      mobile={mobile}
      gap={mobile ? 12 : 16}
      pad={mobile ? 10 : 10}
    />
  );
}
