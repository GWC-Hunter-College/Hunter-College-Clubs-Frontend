export type ClubTint = { from: string; to: string; text: string };

const TINTS: Record<"cyan" | "violet", ClubTint> = {
  cyan: { from: "#22d3ee", to: "#2563eb", text: "#0b1020" },
  violet: { from: "#4b2a7b", to: "#7c3aed", text: "#ffffff" },
};

/** Deterministic per-club tint (club.id parity), used for monograms and flyer-less art. */
export function clubTintFor(clubId: number): ClubTint {
  return clubId % 2 === 0 ? TINTS.violet : TINTS.cyan;
}

export function clubTintGradient(clubId: number) {
  const tint = clubTintFor(clubId);
  return `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`;
}

export function initialsFor(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
