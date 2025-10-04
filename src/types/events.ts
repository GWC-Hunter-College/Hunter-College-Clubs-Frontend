// ---- Canonical app-wide shape ----
export type Event = {
  id: number;
  title: string;
  location: string;

  start: string;            // ISO
  end: string;              // ISO

  flyer?: string;            // event  thumbnail

  owner?: {
    id: number;
    logo?: string;
  };

  associates?: Array<{
    id: number;
    logo?: string;
  }>;

  rsvpLink?: string;
  status?: "draft" | "posted" | "cancelled";
  altText?: string;
};

// ---- Helpers ----
export const toIso = (s: string) => s.replace(" ", "T");

export const monthLabel = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "long" }).toUpperCase()} ${d.getFullYear()}`;
};

// ---- Normalizer: raw JSON -> Event ----
type RawJson =
  | Event
  | {
      id: number;
      title: string;
      location: string;
      startDate: string;   // "YYYY-MM-DD HH:mm:ss"
      endDate: string;
      thumbnailUrl: string;
      rsvpLink?: string;
      status?: string;
      owners?: {
        owner?: { id: number; thumbnailUrl?: string };
        associates?: Array<{ id: number; thumbnailUrl?: string }>;
      };
    };

export const fromJsonEvent = (raw: RawJson): Event => {
  // Already canonical? Just return.
  if ("start" in raw && "end" in raw && "flyer" in raw && "owner" in raw) {
    return raw as Event;
  }

  const r = raw as Exclude<RawJson, Event>;
  const start = toIso(r.startDate);
  const end = toIso(r.endDate);

  return {
    id: r.id,
    title: r.title,
    location: r.location,
    start,
    end,
    flyer: r.thumbnailUrl,
    owner: r.owners?.owner
      ? { id: r.owners.owner.id, logo: r.owners.owner.thumbnailUrl }
      : undefined,
    associates: r.owners?.associates?.map(a => ({
      id: a.id,
      logo: a.thumbnailUrl,
    })) ?? [],
    rsvpLink: r.rsvpLink,
    status:
      r.status === "posted" ? "posted" :
      r.status === "cancelled" ? "cancelled" :
      r.status ? "draft" : undefined,
    altText: `${r.title} at ${r.location}`,
  };
};

export const fromJsonEvents = (arr: RawJson[] | undefined | null): Event[] =>
  Array.isArray(arr) ? arr.map(fromJsonEvent) : [];
