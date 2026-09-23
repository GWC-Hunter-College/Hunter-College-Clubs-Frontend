import { useMemo, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { IconUsersGroup, IconCalendarEvent, IconSettings } from "@tabler/icons-react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import { SearchField } from "../components/ui/Inputs";
import StatCard from "../components/ui/StatCard";
import MyClubCard from "../components/ui/MyClubCard";
import EventRow from "../components/ui/EventRow";
import ClubLogo from "../components/ui/ClubLogo";
import { RoleLabel, type Role } from "../components/ui/Pills";
import { MonthHeader, AgendaDay, MobileDayGroup } from "../components/ui/Agenda";
import ComingSoonPanel from "../components/ui/ComingSoonPanel";
import Button from "../components/ui/Button";
import Gate from "../components/ui/Gate";
import useMyClubs from "../hooks/useMyClubs";
import useMyEvents from "../hooks/useMyEvents";
import { useAuthInfo } from "../types/auth";
import { isUpcoming } from "../types/events";
import type { Event } from "../types/events";
import type { Club } from "../types/club";
import { formatDayLabel, formatMonthHeader, formatTimeRange } from "../lib/datetime";
import { downloadIcs } from "../lib/ics";
import classes from "./MyClubs.module.css";

export default function MyClubs() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const auth = useAuthInfo();
  const { clubs, loading: clubsLoading } = useMyClubs();
  const { events, loading: eventsLoading } = useMyEvents();
  const [query, setQuery] = useState("");

  const clubsById = useMemo(() => new Map(clubs.map((c) => [c.id, c])), [clubs]);

  const upcomingEvents = useMemo(
    () => events.filter((e) => isUpcoming(e)).sort((a, b) => +new Date(a.start) - +new Date(b.start)),
    [events],
  );

  const managedCount = clubs.filter((c) => c.role === "eboard" || c.role === "owner").length;

  const nextEventByClub = useMemo(() => {
    const map = new Map<number, string>();
    for (const event of upcomingEvents) {
      if (!event.owner || map.has(event.owner.id)) continue;
      map.set(event.owner.id, `${formatDayLabel(event.start, event.timezone)} · ${event.title}`);
    }
    return map;
  }, [upcomingEvents]);

  const q = query.trim().toLowerCase();
  const filteredClubs = q ? clubs.filter((c) => c.name.toLowerCase().includes(q)) : clubs;
  const filteredEvents = q
    ? upcomingEvents.filter(
        (e) => e.title.toLowerCase().includes(q) || (e.owner && clubsById.get(e.owner.id)?.name.toLowerCase().includes(q)),
      )
    : upcomingEvents;

  const monthGroups = useMemo(() => {
    const months: Array<{ key: string; label: string; days: Array<{ key: string; iso: string; events: typeof filteredEvents }> }> = [];
    for (const event of filteredEvents) {
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
  }, [filteredEvents]);

  if (!auth.signedIn) {
    return (
      <AppShell>
        <PageContainer>
          <Gate
            icon={<IconUsersGroup size={32} />}
            title="Sign in to see your clubs and events"
            pitch="Your clubs and everything they're hosting, in one place. Sign in with your Hunter account to join clubs and keep up with them."
            preview={<GatePreview />}
          />
        </PageContainer>
      </AppShell>
    );
  }

  const loading = clubsLoading || eventsLoading;

  return (
    <AppShell>
      <PageContainer>
        <div className={classes.page}>
          <PageHeader
            eyebrow="MY CLUBS"
            title="YOUR CLUBS & EVENTS"
            subtitle="Everything from the clubs you’re part of, in one place."
          />

          {!loading && clubs.length === 0 ? (
            <ComingSoonPanel
              icon={<IconUsersGroup size={30} />}
              title="You haven’t joined any clubs yet"
              text="Find a club that matches your interests and join in a click."
              action={
                <Button to="/clubs" variant="primary" size="m">
                  FIND A CLUB &rarr;
                </Button>
              }
            />
          ) : (
            <>
              <div className={classes.statsRow}>
                <StatCard icon={<IconUsersGroup size={22} />} number={clubs.length} label="clubs you’re in" mobile={!isDesktop} />
                <StatCard
                  icon={<IconCalendarEvent size={22} />}
                  number={upcomingEvents.length}
                  label="upcoming events from your clubs"
                  mobile={!isDesktop}
                />
                <StatCard icon={<IconSettings size={22} />} number={managedCount} label="clubs you help run" mobile={!isDesktop} />
              </div>

              <section>
                <div className={classes.sectionHeaderRow}>
                  <h2 className={`${classes.title} text-heading-l`}>{isDesktop ? "Your clubs" : "YOUR CLUBS"}</h2>
                  <span className={classes.search}>
                    <SearchField
                      compact={!isDesktop}
                      placeholder="Search your clubs and events…"
                      value={query}
                      onChange={(e) => setQuery(e.currentTarget.value)}
                      aria-label="Search your clubs and events"
                    />
                  </span>
                </div>
                <div className={isDesktop ? classes.cardsGrid : classes.scroller}>
                  {filteredClubs.map((club) => (
                    <MyClubCard
                      key={club.id}
                      club={club}
                      role={club.role as Role}
                      nextEventLabel={nextEventByClub.get(club.id)}
                      mobile={!isDesktop}
                    />
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader eyebrow="UPCOMING" title="From your clubs" />
                {monthGroups.length === 0 ? (
                  <p className="text-body-m" style={{ color: "var(--text-muted)" }}>
                    {q ? `No events match “${query}”.` : "No upcoming events from your clubs yet."}
                  </p>
                ) : (
                  <div className={classes.agenda}>
                    {monthGroups.map((month) => (
                      <div key={month.key} className={classes.monthGroup}>
                        <MonthHeader iso={month.days[0].iso} />
                        {month.days.map((day) =>
                          isDesktop ? (
                            <AgendaDay key={day.key} iso={day.iso}>
                              {day.events.map((event) => (
                                <MyClubsEventRow key={event.id} event={event} club={event.owner ? clubsById.get(event.owner.id) : undefined} />
                              ))}
                            </AgendaDay>
                          ) : (
                            <MobileDayGroup key={day.key} label={formatDayLabel(day.iso)}>
                              {day.events.map((event) => (
                                <MyClubsEventRow
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
              </section>
            </>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}

function MyClubsEventRow({ event, club, mobile }: { event: Event; club?: Club; mobile?: boolean }) {
  return (
    <EventRow
      to={`/event/${event.id}`}
      locationState={{ origin: "my-clubs", clubName: club?.name }}
      artSrc={event.flyer}
      artAlt={event.altText ?? event.title}
      artClubId={club?.id ?? 0}
      artTitle={event.title}
      artSize={mobile ? 64 : 72}
      artRadius={mobile ? 8 : 10}
      when={formatTimeRange(event.start, event.end, event.timezone)}
      title={event.title}
      mobile={mobile}
      gap={mobile ? 12 : 16}
      pad={mobile ? 10 : 12}
      meta={
        <span className={classes.meta}>
          {!mobile && <ClubLogo clubId={club?.id ?? 0} name={club?.name ?? "Hunter CS"} logo={club?.logo} size={18} />}
          <span>{club?.name ?? "Hunter CS"} &middot; {event.location}</span>
          {club?.role && <RoleLabel role={club.role as Role} />}
        </span>
      }
      onCalendar={event.status === "cancelled" ? undefined : () => downloadIcs(event, `${window.location.origin}/event/${event.id}`)}
    />
  );
}

/** Decorative signed-out preview: static placeholder content, never real membership data. */
function GatePreview() {
  return (
    <div className={classes.page}>
      <PageHeader eyebrow="MY CLUBS" title="YOUR CLUBS & EVENTS" subtitle="Everything from the clubs you're part of, in one place." />
      <div className={classes.statsRow}>
        <StatCard icon={<IconUsersGroup size={22} />} number={3} label="clubs you're in" />
        <StatCard icon={<IconCalendarEvent size={22} />} number={5} label="upcoming events from your clubs" />
        <StatCard icon={<IconSettings size={22} />} number={1} label="clubs you help run" />
      </div>
    </div>
  );
}
