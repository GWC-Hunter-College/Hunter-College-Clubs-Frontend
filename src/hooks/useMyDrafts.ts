import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonEvents } from "../types/events";
import type { Event } from "../types/events";

/** Draft events across the given (managed) club ids, for the step-1 "pick up a draft" panel. */
export default function useMyDrafts(clubIds: number[]) {
  const [drafts, setDrafts] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const key = clubIds.slice().sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (clubIds.length === 0) {
      setDrafts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const results = await Promise.all(
          clubIds.map(async (id) => {
            const res = await fetch(`${API_BASE_URL}/clubs/${id}/events`);
            if (!res.ok) return [];
            const json = await res.json();
            return fromJsonEvents(json?.events);
          }),
        );
        if (!cancelled) setDrafts(results.flat().filter((event) => event.status === "draft"));
      } catch (e) {
        console.error("Failed to fetch drafts", e);
        if (!cancelled) setDrafts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { drafts, loading };
}
