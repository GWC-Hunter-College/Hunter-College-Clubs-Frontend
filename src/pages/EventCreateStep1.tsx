import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { IconCircleCheck, IconChevronRight, IconCalendarPlus } from "@tabler/icons-react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Button from "../components/ui/Button";
import ClubLogo from "../components/ui/ClubLogo";
import EventArt from "../components/ui/EventArt";
import { RoleLabel, StatusPill, type Role } from "../components/ui/Pills";
import Gate from "../components/ui/Gate";
import { useMobileDetailHeader } from "../components/shell/useShell";
import useMyClubs from "../hooks/useMyClubs";
import useMyDrafts from "../hooks/useMyDrafts";
import { useAuthInfo } from "../types/auth";
import { formatShortDate } from "../lib/datetime";
import classes from "./EventCreateStep1.module.css";

export default function EventCreateStep1() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const auth = useAuthInfo();
  const navigate = useNavigate();
  const { clubs } = useMyClubs();
  const managedClubs = useMemo(() => clubs.filter((c) => c.role === "eboard" || c.role === "owner"), [clubs]);
  const managedIds = useMemo(() => managedClubs.map((c) => c.id), [managedClubs]);
  const { drafts } = useMyDrafts(managedIds);

  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (managedClubs.length === 1) setSelected(managedClubs[0].id);
  }, [managedClubs]);

  useMobileDetailHeader("New event", "/create");

  if (!auth.signedIn) {
    return (
      <AppShell>
        <PageContainer>
          <Gate
            icon={<IconCalendarPlus size={32} />}
            title="Sign in to create a club or an event"
            pitch="Start a club, or post an event for a club you manage. You’ll need to sign in first so we know who’s hosting."
            preview={<div />}
          />
        </PageContainer>
      </AppShell>
    );
  }

  const clubsById = new Map(clubs.map((c) => [c.id, c]));

  return (
    <AppShell>
      <PageContainer detail>
        <div className={classes.page}>
          {isDesktop && <Breadcrumb segments={["CREATE", "NEW EVENT"]} to="/create" />}
          <PageHeader eyebrow="NEW EVENT" title="WHO’S HOSTING?" />

          <div className={classes.panels}>
            <div className={classes.panel}>
              <p className={`${classes.eyebrow} text-meta-mono-caps`}>START A NEW EVENT FOR</p>
              <div className={classes.clubRows}>
                {managedClubs.map((club) => {
                  const isSelected = selected === club.id;
                  return (
                    <button
                      key={club.id}
                      type="button"
                      className={`${classes.clubRow} ${isSelected ? classes.selected : ""}`}
                      onClick={() => setSelected(club.id)}
                    >
                      <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={48} />
                      <span className={classes.clubName}>
                        <span className="text-heading-m">{club.name}</span>
                        <RoleLabel role={club.role as Role} />
                      </span>
                      {isSelected ? (
                        <IconCircleCheck size={22} color="var(--brand-primary)" aria-hidden="true" />
                      ) : (
                        <IconChevronRight size={20} color="var(--text-muted)" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className={`${classes.helper} text-caption`}>Only clubs where you&rsquo;re an owner or on the e-board show up here.</p>
              <div className={classes.continueRow}>
                <Button
                  variant="primary"
                  size="l"
                  disabled={selected == null}
                  onClick={() => selected != null && navigate(`/club/${selected}/event/new`)}
                >
                  CONTINUE &rarr;
                </Button>
              </div>
            </div>

            {drafts.length > 0 && (
              <div className={classes.panel}>
                <p className={`${classes.eyebrow} text-meta-mono-caps`}>OR PICK UP A DRAFT</p>
                <div className={classes.draftRows}>
                  {drafts.map((draft) => {
                    const club = draft.owner ? clubsById.get(draft.owner.id) : undefined;
                    return (
                      <a
                        key={draft.id}
                        href={`/club/${draft.owner?.id}/event/new?draft=${draft.id}`}
                        className={classes.draftRow}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/club/${draft.owner?.id}/event/new?draft=${draft.id}`);
                        }}
                      >
                        <EventArt src={draft.flyer} alt={draft.title} size={56} radius={10} clubId={draft.owner?.id ?? 0} title={draft.title} />
                        <span className={classes.draftText}>
                          <p className="text-body-m-strong">{draft.title}</p>
                          <p className={`${classes.draftSub} text-caption`}>
                            {club?.name ?? "Club"} &middot; {formatShortDate(draft.start, draft.timezone)}
                            {!draft.flyer && " · no flyer yet"}
                          </p>
                        </span>
                        <StatusPill status="draft" />
                        <IconChevronRight size={20} color="var(--text-muted)" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
