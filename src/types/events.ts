// ---- Canonical app-wide shape ----
export type Event = {
  id: number;
  title: string;
  location: string;

  start: string;            // ISO
  end: string;              // ISO
  timezone?: string;        // IANA name; defaults to America/New_York when absent

  flyer?: string;            // event thumbnail
  images?: string[];         // extra gallery images after the flyer
  description?: string;

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
      description?: string;
      timezone?: string;
      images?: string[];
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
    timezone: r.timezone,
    flyer: r.thumbnailUrl,
    images: r.images,
    description: r.description,
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
      r.status === "draft" ? "draft" :
      r.status ? "draft" : undefined,
    altText: `${r.title} at ${r.location}`,
  };
};

export const fromJsonEvents = (arr: RawJson[] | undefined | null): Event[] =>
  Array.isArray(arr) ? arr.map(fromJsonEvent) : [];

// An event is upcoming while its end day is today or later.
export const isUpcoming = (event: Pick<Event, "end">, now = new Date()) => {
  const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  return startOfDay(new Date(event.end)).getTime() >= startOfDay(now).getTime();
};
