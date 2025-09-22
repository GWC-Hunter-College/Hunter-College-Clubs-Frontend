// src/types/clubs.ts
export type Club = {
  id: number;
  name: string;
  logo?: string; 
  role?: "member" | "eboard" | "owner";
	description: string;
  tags: string[];
};

const normalizeRole = (v: any): Club["role"] => {
  const s = String(v ?? "").toLowerCase();
  return s === "member" || s === "eboard" || s === "owner" ? (s as Club["role"]) : undefined;
};

export const fromJsonClub = (v: any): Club | null => {
  if (!v) return null;

  const id = Number(v.id);
  const name = typeof v.name === "string" ? v.name : (typeof v.title === "string" ? v.title : "");

  if (!Number.isFinite(id) || !name) return null;

  const logo = v.logo ?? v.thumbnailUrl ?? v.image ?? undefined;

  return {
    id,
    name,
    logo,
    role: normalizeRole(v.role),
		description: typeof v.description === "string" ? v.description : undefined,
		tags: []
  };
};

// Accepts: an array, or an envelope { clubs: [...] }
export const fromJsonClubs = (input: any): Club[] => {
  const arr = Array.isArray(input) ? input : (Array.isArray(input?.clubs) ? input.clubs : []);
  return arr.map(fromJsonClub).filter(Boolean) as Club[];
};
