import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonClub } from "../types/club";
import type { Club } from "../types/club";

export default function useClub(clubId?: string) {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!clubId) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clubs/${clubId}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch club");
        const json = await res.json();
        if (!cancelled) setClub(fromJsonClub(json?.club));
      } catch (e) {
        console.error("Failed to fetch club", e);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clubId]);

  return { club, loading, notFound };
}
