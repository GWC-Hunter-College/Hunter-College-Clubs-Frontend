import { useMemo } from "react";
import type { Club } from "../types/club";

/** The backend's `owners.owner.name` is empty, so event/club names come from this lookup by id. */
export default function useClubsById(clubs: Club[]) {
  return useMemo(() => new Map(clubs.map((club) => [club.id, club])), [clubs]);
}
