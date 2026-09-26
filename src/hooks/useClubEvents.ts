import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonEvents } from "../types/events";
import type { Event } from "../types/events";

/** All events for one club, including drafts — callers filter drafts out for public tabs. */
export default function useClubEvents(clubId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clubId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clubs/${clubId}/events`);
        if (!res.ok) throw new Error("Failed to fetch club events");
        const json = await res.json();
        if (!cancelled) setEvents(fromJsonEvents(json?.events));
      } catch (e) {
        console.error("Failed to fetch club events", e);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clubId]);

  return { events, loading };
}
