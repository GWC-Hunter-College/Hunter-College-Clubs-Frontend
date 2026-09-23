import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import Breadcrumb from "../components/ui/Breadcrumb";
import Button from "../components/ui/Button";
import ComingSoonPanel from "../components/ui/ComingSoonPanel";
import ConfirmModal from "../components/ui/ConfirmModal";
import ClubHeader from "../components/Club/ClubHeader";
import Tabs, { type ClubTab } from "../components/Club/Tabs";
import EventsTab from "../components/Club/EventsTab";
import BoardTab from "../components/Club/BoardTab";
import ManageTab from "../components/Club/ManageTab";
import { useMobileDetailHeader, useNavOverride } from "../components/shell/useShell";
import useClub from "../hooks/useClub";
import useMembership from "../hooks/useMembership";
import useClubEvents from "../hooks/useClubEvents";
import { useAuthInfo } from "../types/auth";
import { API_BASE_URL } from "../config";
import { isUpcoming } from "../types/events";
import { copyToClipboard, nativeShare, canNativeShare } from "../lib/share";
import { IconBell } from "@tabler/icons-react";
import classes from "./Club.module.css";

export default function Club() {
  const { clubId } = useParams<{ clubId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation() as { state?: { origin?: string } };
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const auth = useAuthInfo();

  const { club, loading, notFound } = useClub(clubId);
  const { role, refresh: refreshMembership } = useMembership(clubId);
  const { events } = useClubEvents(clubId);

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabParam = searchParams.get("tab");
  const activeTab: ClubTab = tabParam === "board" || tabParam === "announcements" || tabParam === "manage" ? tabParam : "events";
  const canManage = role === "eboard" || role === "owner";

  const origin = location.state?.origin === "my-clubs" ? "my-clubs" : "clubs";

  useEffect(() => {
    document.title = club ? `${club.name} · Hunter CS` : "Club · Hunter CS";
  }, [club]);

  useNavOverride(role ? "my-clubs" : "clubs");

  const handleShare = useCallback(() => {
    if (!club) return;
    const url = `${window.location.origin}/club/${club.id}`;
    if (canNativeShare()) void nativeShare({ title: club.name, url });
    else void copyToClipboard(url);
  }, [club]);

  useMobileDetailHeader(club?.name ?? "Club", origin === "my-clubs" ? "/my-clubs" : "/clubs", club ? handleShare : undefined);

  const { upcoming, past } = useMemo(() => {
    const nonDraft = events.filter((e) => e.status !== "draft");
    const up = nonDraft.filter((e) => isUpcoming(e)).sort((a, b) => +new Date(a.start) - +new Date(b.start));
    const prev = nonDraft.filter((e) => !isUpcoming(e)).sort((a, b) => +new Date(b.start) - +new Date(a.start));
    return { upcoming: up, past: prev };
  }, [events]);

  const manageRows = useMemo(
    () => events.filter((e) => e.status === "draft" || (e.status !== "cancelled" && isUpcoming(e))),
    [events],
  );

  const setTab = (tab: ClubTab) => {
    if (tab === "events") searchParams.delete("tab");
    else searchParams.set("tab", tab);
    setSearchParams(searchParams, { replace: true });
  };

  const goNewEvent = () => navigate(`/club/${clubId}/event/new`);

  const handleJoin = async () => {
    if (!club) return;
    if (!auth.signedIn) {
      auth.signIn();
      return;
    }
    const token = auth.getAccessToken();
    if (!token) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${club.id}/members/me`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("We couldn’t join this club right now. Please try again.");
        return;
      }
      await refreshMembership();
    } catch {
      setError("We couldn’t join this club right now. Please try again.");
    }
  };

  const handleLeave = async () => {
    if (!club) return;
    const token = auth.getAccessToken();
    if (!token) return;
    setLeaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${club.id}/members/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("We couldn’t leave this club right now. Please try again.");
        return;
      }
      await refreshMembership();
      setLeaveOpen(false);
    } catch {
      setError("We couldn’t leave this club right now. Please try again.");
    } finally {
      setLeaving(false);
    }
  };

  if (notFound) {
    return (
      <AppShell>
        <PageContainer>
          <div className={classes.notFound}>
            <p className="text-body-l">We couldn&rsquo;t find that club.</p>
            <Button to="/clubs" variant="ghost" size="m">
              BROWSE CLUBS &rarr;
            </Button>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  if (loading || !club) {
    return (
      <AppShell>
        <PageContainer detail />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer detail>
        <div className={classes.page}>
          {isDesktop && <Breadcrumb segments={[origin === "my-clubs" ? "MY CLUBS" : "CLUBS", club.name.toUpperCase()]} to={origin === "my-clubs" ? "/my-clubs" : "/clubs"} />}
          {error && <p className={`${classes.error} text-caption`}>{error}</p>}
          <ClubHeader
            club={club}
            role={role}
            signedIn={auth.signedIn}
            canManage={canManage}
            upcomingCount={upcoming.length}
            pastCount={past.length}
            mobile={!isDesktop}
            onJoin={handleJoin}
            onShare={handleShare}
            onLeaveRequest={() => setLeaveOpen(true)}
            onNewEvent={goNewEvent}
          />
          <Tabs active={activeTab} onChange={setTab} showManage={canManage} mobile={!isDesktop} />

          {activeTab === "events" && (
            <EventsTab club={club} upcoming={upcoming} past={past} mobile={!isDesktop} canManage={canManage} onNewEvent={goNewEvent} />
          )}
          {activeTab === "board" && <BoardTab />}
          {activeTab === "announcements" && (
            <ComingSoonPanel
              icon={<IconBell size={32} />}
              title="Announcements are coming soon"
              text="This feature isn’t available yet. Later, the e-board will be able to post updates here."
              tone="surface"
            />
          )}
          {activeTab === "manage" && canManage && <ManageTab club={club} events={manageRows} onNewEvent={goNewEvent} />}
        </div>
      </PageContainer>

      <ConfirmModal
        opened={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        title={`Leave ${club.name}?`}
        body="You can rejoin any time. Owners and e-board access won’t be preserved if you leave and rejoin."
        confirmLabel="LEAVE CLUB"
        onConfirm={handleLeave}
        confirming={leaving}
      />
    </AppShell>
  );
}
