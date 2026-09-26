import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonEvents } from "../types/events";
import type { Event } from "../types/events";
import { useAuthInfo } from "../types/auth";

/** Events from the signed-in user's clubs (drafts excluded). Empty when signed out. */
export default function useMyEvents() {
  const auth = useAuthInfo();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.signedIn) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const token = auth.getAccessToken();
    if (!token) {
      setEvents([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me/events`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (!cancelled) setEvents(fromJsonEvents(json?.events));
      } catch (e) {
        console.error("Failed to fetch my events", e);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  return { events, loading };
}
