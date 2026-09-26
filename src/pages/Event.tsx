import { useCallback, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendarPlus, IconShare3 } from "@tabler/icons-react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import Breadcrumb from "../components/ui/Breadcrumb";
import Button, { IconButton } from "../components/ui/Button";
import ClubLogo from "../components/ui/ClubLogo";
import { StatusPill } from "../components/ui/Pills";
import Gallery from "../components/Event/Gallery";
import WhenWhereCard from "../components/Event/WhenWhereCard";
import ManagerBar from "../components/Event/ManagerBar";
import SharePopover from "../components/Event/SharePopover";
import { useMobileDetailHeader, useHideMobileTabBar, useNavOverride } from "../components/shell/useShell";
import useEvent from "../hooks/useEvent";
import useClub from "../hooks/useClub";
import useMembership from "../hooks/useMembership";
import { isUpcoming } from "../types/events";
import { downloadIcs } from "../lib/ics";
import { canNativeShare, copyToClipboard, nativeShare } from "../lib/share";
import classes from "./Event.module.css";

function isAbsoluteHttpUrl(url?: string): url is string {
  return Boolean(url) && /^https?:\/\//i.test(url as string);
}

type EventOrigin =
  | { origin: "events" | "grid" }
  | { origin: "club"; clubId: number; clubName: string; section?: "past" }
  | { origin: "my-clubs"; clubName?: string }
  | undefined;

export default function Event() {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation() as { state?: EventOrigin };
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });

  const { event, loading, notFound } = useEvent(eventId);
  const { club } = useClub(event?.owner ? String(event.owner.id) : undefined);
  const { role } = useMembership(event?.owner ? String(event.owner.id) : undefined);

  const canManage = role === "eboard" || role === "owner";
  const upcoming = event ? isUpcoming(event) && event.status !== "cancelled" : false;
  const isPast = event ? !isUpcoming(event) : false;
  const isCancelled = event?.status === "cancelled";

  useNavOverride("events");
  useHideMobileTabBar(true);

  const url = eventId ? `${typeof window !== "undefined" ? window.location.origin : ""}/event/${eventId}` : "";

  const handleShareFallback = useCallback(() => {
    if (canNativeShare() && event) void nativeShare({ title: event.title, url });
    else void copyToClipboard(url);
  }, [event, url]);

  useMobileDetailHeader("Event", undefined, event ? handleShareFallback : undefined);

  const breadcrumb = useMemo(() => {
    const state = location.state;
    if (state?.origin === "club") {
      const clubLabel = state.clubName.toUpperCase();
      if (state.section === "past") return { segments: [clubLabel, "PAST EVENTS", event?.title.toUpperCase() ?? ""], to: `/club/${state.clubId}?tab=events` };
      return { segments: [clubLabel, event?.title.toUpperCase() ?? ""], to: `/club/${state.clubId}` };
    }
    return { segments: ["EVENTS", event?.title.toUpperCase() ?? ""], to: "/events" };
  }, [location.state, event?.title]);

  const photos = event ? [...(event.flyer ? [event.flyer] : []), ...(event.images ?? [])] : [];

  if (notFound) {
    return (
      <AppShell>
        <PageContainer>
          <div className={classes.notFound}>
            <p className="text-body-l">We couldn&rsquo;t find that event.</p>
            <Button to="/events" variant="ghost" size="m">
              BROWSE EVENTS &rarr;
            </Button>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  if (loading || !event) {
    return (
      <AppShell>
        <PageContainer detail />
      </AppShell>
    );
  }

  // Desktop renders full action buttons inline. Mobile relies on the fixed action bar for
  // RSVP/calendar/share instead (see below); the only inline mobile action is "view photos",
  // which the fixed bar doesn't cover.
  const desktopActions = isCancelled ? null : upcoming ? (
    <div className={classes.actions}>
      {isAbsoluteHttpUrl(event.rsvpLink) && (
        <Button href={event.rsvpLink} target="_blank" rel="noreferrer" variant="primary" size="l" rightIcon={<span>&rarr;</span>}>
          RSVP
        </Button>
      )}
      <Button variant="outline" size="l" onClick={() => downloadIcs(event, url)}>
        ADD TO CALENDAR
      </Button>
      <SharePopover event={event}>
        <Button variant="outline" size="l">
          SHARE
        </Button>
      </SharePopover>
    </div>
  ) : (
    <div className={classes.actions}>
      {(event.images?.length ?? 0) > 0 && (
        <Button
          variant="primary"
          size="l"
          onClick={() => document.getElementById("event-gallery")?.scrollIntoView({ behavior: "smooth" })}
        >
          VIEW ALL {event.images!.length} PHOTOS
        </Button>
      )}
      <SharePopover event={event}>
        <Button variant="outline" size="l">
          SHARE
        </Button>
      </SharePopover>
    </div>
  );

  const mobileViewPhotosAction =
    !isCancelled && isPast && (event.images?.length ?? 0) > 0 ? (
      <div className={classes.actions}>
        <Button
          variant="primary"
          size="m"
          fullWidth
          onClick={() => document.getElementById("event-gallery")?.scrollIntoView({ behavior: "smooth" })}
        >
          VIEW ALL {event.images!.length} PHOTOS
        </Button>
      </div>
    ) : null;

  const hostName = club?.name ?? "Hunter CS";

  const body = (
    <div className={classes.page}>
      {isDesktop && <Breadcrumb segments={breadcrumb.segments} to={breadcrumb.to} />}
      {canManage && event.owner && <ManagerBar clubName={hostName} isOwner={role === "owner"} upcoming={upcoming} mobile={!isDesktop} />}

      <div className={isDesktop ? classes.columns : undefined} style={isDesktop ? undefined : { display: "flex", flexDirection: "column", gap: 20 }}>
        <div id="event-gallery">
          <Gallery photos={photos} title={event.title} clubId={event.owner?.id ?? 0} canManage={canManage} mobile={!isDesktop} />
        </div>

        <div className={classes.details}>
          <div className={classes.host}>
            <ClubLogo clubId={event.owner?.id ?? 0} name={hostName} logo={club?.logo} size={isDesktop ? 48 : 44} />
            <div className={classes.hostText}>
              <p className={`${classes.hostEyebrow} text-meta-mono-caps`}>HOSTED BY</p>
              <a href={`/club/${event.owner?.id ?? ""}`} className={`${classes.hostName} text-body-m-strong`}>
                {hostName}
              </a>
            </div>
          </div>

          {(isPast || isCancelled) && (
            <div className={classes.statusRow}>
              {isCancelled ? (
                <StatusPill status="cancelled" />
              ) : (
                <StatusPill status="past">
                  PAST EVENT{(event.images?.length ?? 0) > 0 ? ` · ${event.images!.length} PHOTOS` : ""}
                </StatusPill>
              )}
            </div>
          )}

          <h1 className={`${classes.title} ${isDesktop ? "text-display-l" : "text-display-m"}`}>{event.title}</h1>

          <WhenWhereCard event={event} />

          {isDesktop ? desktopActions : mobileViewPhotosAction}

          {event.description && (
            <div className={classes.about}>
              <p className={`${classes.aboutEyebrow} text-meta-mono-caps`}>ABOUT THIS EVENT</p>
              <p className={`${classes.aboutText} text-body-l`}>{event.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AppShell>
      <PageContainer detail>{body}</PageContainer>
      {!isDesktop && (
        <div className={classes.mobileActionBar}>
          {isCancelled ? (
            <SharePopover event={event} mobile>
              <IconButton variant="outline" size={44} icon={<IconShare3 size={20} />} aria-label="Share" />
            </SharePopover>
          ) : upcoming ? (
            <>
              {isAbsoluteHttpUrl(event.rsvpLink) && (
                <Button href={event.rsvpLink} target="_blank" rel="noreferrer" variant="primary" size="l">
                  RSVP &rarr;
                </Button>
              )}
              <IconButton
                variant="outline"
                size={44}
                icon={<IconCalendarPlus size={20} />}
                aria-label="Add to calendar"
                onClick={() => downloadIcs(event, url)}
              />
              <SharePopover event={event} mobile>
                <IconButton variant="outline" size={44} icon={<IconShare3 size={20} />} aria-label="Share" />
              </SharePopover>
            </>
          ) : (
            <SharePopover event={event} mobile>
              <IconButton variant="outline" size={44} icon={<IconShare3 size={20} />} aria-label="Share" />
            </SharePopover>
          )}
        </div>
      )}
    </AppShell>
  );
}
