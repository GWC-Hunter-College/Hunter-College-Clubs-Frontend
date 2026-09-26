import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fromJsonClubs } from "../types/club";
import type { Club } from "../types/club";
import { useAuthInfo } from "../types/auth";

/** The signed-in user's clubs, each with `role` set. Empty (not an error) when signed out. */
export default function useMyClubs() {
  const auth = useAuthInfo();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!auth.signedIn) {
      setClubs([]);
      setLoading(false);
      return;
    }
    const token = auth.getAccessToken();
    if (!token) {
      setClubs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/me/clubs`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setClubs(fromJsonClubs(json));
    } catch (e) {
      console.error("Failed to fetch my clubs", e);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { clubs, loading, refresh };
}
