import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonEvents } from "../types/events";
import type { Event } from "../types/events";

/** All non-draft events (drafts are only shown to a club's managers, per screen). */
export default function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const json = await res.json();
        if (!cancelled) setEvents(fromJsonEvents(json?.events).filter((event) => event.status !== "draft"));
      } catch (e) {
        console.error("Failed to fetch events", e);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { events, loading };
}
