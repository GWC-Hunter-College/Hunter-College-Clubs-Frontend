import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonEvent } from "../types/events";
import type { Event } from "../types/events";

export default function useEvent(eventId?: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch event");
        const json = await res.json();
        if (!cancelled) setEvent(fromJsonEvent(json?.event));
      } catch (e) {
        console.error("Failed to fetch event", e);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { event, loading, notFound };
}
