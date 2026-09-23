import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useAuthInfo } from "../types/auth";
import type { Club } from "../types/club";

type Role = "member" | "eboard" | "owner";

/** The signed-in user's role in one club, derived from GET /me/clubs. */
export default function useMembership(clubId?: string) {
  const auth = useAuthInfo();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!auth.signedIn || !clubId) {
      setRole(null);
      return;
    }
    const token = auth.getAccessToken();
    if (!token) {
      setRole(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/me/clubs`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      const list: Array<Pick<Club, "id" | "role">> = Array.isArray(json?.clubs) ? json.clubs : [];
      const found = list.find((c) => String(c.id) === String(clubId));
      setRole((found?.role as Role | undefined) ?? null);
    } catch {
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [auth, clubId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { role, loading, refresh };
}
