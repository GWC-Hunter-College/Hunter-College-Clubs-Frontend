// src/pages/event-create.tsx (or wherever this component lives)

import { useState, useEffect } from "react";
import { Button, Loader, Stack, Text, Title } from "@mantine/core";
import PageShell from "../components/Other/PageShell";
import SignInPrompt from "../components/Other/SignInPrompt";

import { useAuthInfo } from "../types/auth";
import type { Club } from "../types/club";
import { fromJsonClubs } from "../types/club";
import { API_BASE_URL } from "../config";

export default function ClubCreatePage() {
  const auth = useAuthInfo();

  const [authorizedClubs, setAuthorizedClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!auth.signedIn) {
        setAuthorizedClubs([]);
        return;
      }

      const token = auth.getAccessToken();
      if (!token) {
        setAuthorizedClubs([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/me/clubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        const clubs = fromJsonClubs(json);

        // Only allow owner/eboard to create events
        const allowed = clubs.filter(
          (c) => c.role === "owner" || c.role === "eboard"
        );

        if (!cancelled) setAuthorizedClubs(allowed);
      } catch {
        alert('Failed to grab your clubs')
        if (!cancelled) setAuthorizedClubs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [auth.signedIn]); // token provided by getAccessToken() on demand

  return (
    <PageShell
      pageTitle="Event Creation"
      back={{ to: "/clubs" }}
      user={{ auth }}
      size="xl"
      padded
      contentGap="lg"
    >
      {!auth.signedIn ? (
        <SignInPrompt
          auth={auth}
          message="You need to sign in to create an event."
        />
      ) : (
        <Stack gap="md">
          <Title order={3}>Pick a club to create an event for:</Title>

          {loading ? (
            <Loader />
          ) : authorizedClubs.length === 0 ? (
            <Text c="dimmed">
              No clubs available. You must be an e-board member or owner to
              create events.
            </Text>
          ) : (
            <Stack gap="sm">
              {authorizedClubs.map((c) => (
                // Simple buttons for now — no click behavior yet
                <Button key={c.id} variant="light" fullWidth>
                  {c.name} {c.role ? `(${c.role})` : ""}
                </Button>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </PageShell>
  );
}
