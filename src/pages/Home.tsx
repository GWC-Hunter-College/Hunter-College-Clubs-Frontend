import { useMediaQuery } from "@mantine/hooks";
import { useMemo } from "react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import SectionHeader from "../components/ui/SectionHeader";
import EventTile from "../components/ui/EventTile";
import Button from "../components/ui/Button";
import Hero from "../components/Home/Hero";
import useEvents from "../hooks/useEvents";
import useClubs from "../hooks/useClubs";
import useClubsById from "../hooks/useClubsById";
import { isUpcoming } from "../types/events";
import classes from "./Home.module.css";

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const { events } = useEvents();
  const { clubs } = useClubs();
  const clubsById = useClubsById(clubs);

  const upcoming = useMemo(
    () =>
      events
        .filter((event) => event.status !== "cancelled" && isUpcoming(event))
        .sort((a, b) => +new Date(a.start) - +new Date(b.start)),
    [events],
  );

  const tileLimit = isDesktop ? 16 : 8;
  const tiles = upcoming.slice(0, tileLimit);

  return (
    <AppShell>
      <PageContainer>
        <div className={classes.page}>
          <Hero events={upcoming} clubsById={clubsById} mobile={!isDesktop} />

          <section>
            <SectionHeader
              eyebrow="UPCOMING"
              title="Happening at Hunter CS"
              action={
                <Button to="/events" variant="ghost" size={isDesktop ? "m" : "s"}>
                  {isDesktop ? "SEE AS A LIST →" : "LIST →"}
                </Button>
              }
            />
            <div className={classes.grid}>
              {tiles.map((event) => (
                <EventTile
                  key={event.id}
                  event={event}
                  club={event.owner ? clubsById.get(event.owner.id) : undefined}
                  mobile={!isDesktop}
                />
              ))}
            </div>
            {!isDesktop && upcoming.length > tileLimit && (
              <div className={classes.seeAll}>
                <Button to="/events" variant="outline" size="m">
                  SEE ALL {upcoming.length} EVENTS
                </Button>
              </div>
            )}
          </section>
        </div>
      </PageContainer>
    </AppShell>
  );
}
