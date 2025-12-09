import { Box, Container, Stack, Skeleton, Title, Button } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventList from "../components/Events/EventList";
import FeaturedClubCard from "../components/ClubPage/FeaturedClubCard";
import { API_BASE_URL } from "../config";
import placeholderLogo from "../assets/placeholder.png";

import type { Event } from "../types/events";
import { fromJsonEvents } from "../types/events";
import type { Club } from "../types/club";
import { fromJsonClub } from "../types/club";

import { useAuthInfo } from "../types/auth";

import PageShell from "../components/Other/PageShell";

export default function ClubPage() {
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [eventsAll, setEventsAll] = useState<Event[]>([]);
  const [view, setView] = useState<"Upcoming" | "Previous">("Upcoming");

  const { clubId } = useParams<{ clubId: string }>();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const auth = useAuthInfo();

  // --- membership for current club ---
  const [myRole, setMyRole] = useState<Club["role"] | null>(null);
  const [checkingMembership, setCheckingMembership] = useState(false);
  const [membershipUpdating, setMembershipUpdating] = useState(false);

  // load club and club events
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let clubData = null;

        // --- Fetch club info ---
        try {
          const res = await fetch(`${API_BASE_URL}/clubs/${clubId}`);
          const json = await res.json();
          console.log(json);

          if (json.club) {
            clubData = json.club;
            console.log(`✅ Loaded club ${clubData.name} from API`);
          }
        } catch (err) {
          console.warn("API fetch failed", err);
        }
        if (!clubData) {
          setError("Club not found");
          return;
        }
        // Ensure placeholder logo if missing
        if (clubData) {
          clubData.image = placeholderLogo;
        }

        if (!cancelled && clubData) {
          const normalizedClub = fromJsonClub(clubData);
          setClub(normalizedClub);
        }

        // Load demo events
        const resEvents = await fetch(`${API_BASE_URL}/events`);
        // const resEvents = await fetc(`${API_BASE_URL}/events/${clubId}`);
        const jsonEvents = await resEvents.json();

        if (!cancelled) {
          const normalizedEvents = fromJsonEvents(jsonEvents?.events);
          setEventsAll(normalizedEvents);
        }
      } catch (e) {
        console.error("❌ Failed to load club page", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clubId]);

  // ---- Check membership via /me/clubs (use ACCESS token from auth) ----
  useEffect(() => {
    let cancelled = false;

    if (!auth.signedIn || !clubId) {
      setMyRole(null);
      return;
    }

    const token = auth.getAccessToken();
    if (!token) {
      setMyRole(null);
      return;
    }

    (async () => {
      setCheckingMembership(true);
      try {
        const res = await fetch(`${API_BASE_URL}/me/clubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        const list: Array<Pick<Club, "id" | "name" | "role">> = Array.isArray(json?.clubs)
          ? json.clubs
          : [];
        const found = list.find((c) => String(c.id) === String(clubId));
        if (!cancelled) setMyRole(found?.role ?? null);
      } catch {
        if (!cancelled) setMyRole(null);
      } finally {
        if (!cancelled) setCheckingMembership(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth.signedIn, auth.accessToken, clubId]);

  // Helpers (day-based comparisons)
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const dateOnlyGTE = (aIso: string, bDate: Date) =>
    startOfDay(new Date(aIso)).getTime() >= startOfDay(bDate).getTime();

  // Partition by END DAY: if event ends today or later → Upcoming
  const { upcoming, previous } = useMemo(() => {
    const now = new Date();
    const up: Event[] = [];
    const prev: Event[] = [];
    for (const ev of eventsAll) {
      const endIso = ev.end ?? ev.start;
      if (dateOnlyGTE(endIso, now)) up.push(ev);
      else prev.push(ev);
    }
    // Sorts
    up.sort((a, b) => +new Date(a.start) - +new Date(b.start));
    prev.sort((a, b) => +new Date(b.start) - +new Date(a.start));
    return { upcoming: up, previous: prev };
  }, [eventsAll]);

  const filtered = view === "Upcoming" ? upcoming : previous;

  if (error) {
    return (
      <Container py="xl">
        <Title order={2} c="red.4" mb="md">
          {error}
        </Title>
        <Button variant="subtle" onClick={() => navigate(-1)} leftSection="←">
          Go Back
        </Button>
      </Container>
    );
  }

  // === Loading skeleton ===
  if (loading) {
    return (
      <Container py="lg">
        <Stack gap="md">
          <Skeleton h={50} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={200} radius="md" />
          <Skeleton h={60} radius="md" />
        </Stack>
      </Container>
    );
  }

  // Map membership → FeaturedClubCard.action
  // during membership check or mutation we hide the button (`none`) to avoid flicker
  const membershipBusy = checkingMembership || membershipUpdating;

  const action: "none" | "join" | "leave" =
    !auth.signedIn || membershipBusy || myRole === "owner"
      ? "none"
      : myRole === "member" || myRole === "eboard"
      ? "leave"
      : "join";

  // ---- Join / leave handlers ----
  const handleJoin = async () => {
    if (!clubId) return;

    if (!auth.signedIn) {
      // If not signed in, send them through Cognito
      auth.signIn();
      return;
    }

    const token = auth.getAccessToken();
    if (!token) {
      console.warn("No access token; cannot join club.");
      return;
    }

    setMembershipUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${clubId}/members/me`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Failed to join club", res.status, text);
        return;
      }

      // Optimistically update local role
      setMyRole("member");
    } catch (err) {
      console.error("Error joining club", err);
    } finally {
      setMembershipUpdating(false);
    }
  };

  const handleLeave = async () => {
    if (!clubId) return;

    if (!auth.signedIn) {
      auth.signIn();
      return;
    }

    const token = auth.getAccessToken();
    if (!token) {
      console.warn("No access token; cannot leave club.");
      return;
    }

    setMembershipUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${clubId}/members/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Failed to leave club", res.status, text);
        return;
      }

      // Optimistically clear role
      setMyRole(null);
    } catch (err) {
      console.error("Error leaving club", err);
    } finally {
      setMembershipUpdating(false);
    }
  };


  // === Main page ===
  return (
    <PageShell
      pageTitle={club?.name ?? "Club"}
      back={{ to: "/clubs" }}
      user={{ auth }}
      size="xl"
      padded
    >
      {/* ==== Section 1: Hero ==== */}
      <Box px={{ base: "md", sm: "lg" }} py="lg">
        <Box maw={1100} w="100%">
          {club ? (
            <FeaturedClubCard
              club={{ ...club, role: (myRole ?? club.role) as Club["role"] }}
              action={action}
              onJoinClick={handleJoin}
              onLeaveClick={handleLeave}
            />
          ) : (
            <div style={{ height: 200 }} />
          )}
        </Box>
      </Box>

      {/* ==== Section 2: Events ==== */}
      <Box py="lg">
        <EventList
          title="Club Events"
          views={["Upcoming", "Previous"]}
          onChangeView={(v) => setView(v as "Upcoming" | "Previous")}
          events={filtered}
        />
      </Box>
    </PageShell>
  );
}
