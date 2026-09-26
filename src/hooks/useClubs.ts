import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonClubs } from "../types/club";
import type { Club } from "../types/club";

/** Verified clubs, used for the directory and for resolving event owner names/logos. */
export default function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clubs?verified=true`);
        if (!res.ok) throw new Error("Failed to fetch clubs");
        const json = await res.json();
        if (!cancelled) setClubs(fromJsonClubs(json));
      } catch (e) {
        console.error("Failed to fetch clubs", e);
        if (!cancelled) setClubs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { clubs, loading };
}
