const DEFAULT_TZ = "America/New_York";

const tzOf = (timezone?: string) => timezone ?? DEFAULT_TZ;

function timeParts(date: Date, timezone?: string) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tzOf(timezone),
  }).format(date);
  const match = formatted.match(/^(.*)\s(AM|PM)$/i);
  return match ? { time: match[1], meridiem: match[2].toUpperCase() } : { time: formatted, meridiem: "" };
}

/** "5 PM" / "5:30 PM" — drops ":00" but keeps other minutes. */
function shortTime(date: Date, timezone?: string) {
  const { time, meridiem } = timeParts(date, timezone);
  return `${time.replace(":00", "")} ${meridiem}`;
}

/** "5:00 – 7:00 PM" (en dash, one meridiem when both match), "11:00 AM – 1:00 PM" otherwise. */
export function formatTimeRange(startIso: string, endIso: string, timezone?: string) {
  const a = timeParts(new Date(startIso), timezone);
  const b = timeParts(new Date(endIso), timezone);
  if (a.meridiem === b.meridiem) return `${a.time} – ${b.time} ${b.meridiem}`;
  return `${a.time} ${a.meridiem} – ${b.time} ${b.meridiem}`;
}

/** "WED SEP 23 · 5 PM" — used on EventTile and the Club page's mobile rows. */
export function formatTileWhen(startIso: string, timezone?: string) {
  const d = new Date(startIso);
  const tz = tzOf(timezone);
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(d).toUpperCase();
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: tz }).format(d).toUpperCase();
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: tz }).format(d);
  return `${weekday} ${month} ${day} · ${shortTime(d, timezone)}`;
}

/** "WED SEP 23 · 5:00 – 7:00 PM" — used on the Club page's desktop EventRow. */
export function formatRowWhen(startIso: string, endIso: string, timezone?: string) {
  const d = new Date(startIso);
  const tz = tzOf(timezone);
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(d).toUpperCase();
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: tz }).format(d).toUpperCase();
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: tz }).format(d);
  return `${weekday} ${month} ${day} · ${formatTimeRange(startIso, endIso, timezone)}`;
}

/** "Mon Sep 28" — used in step-1 draft rows. */
export function formatShortDate(iso: string, timezone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tzOf(timezone),
  }).format(new Date(iso));
}

/** "SEPTEMBER 2026" */
export function formatMonthHeader(iso: string, timezone?: string) {
  const d = new Date(iso);
  const tz = tzOf(timezone);
  const month = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: tz }).format(d).toUpperCase();
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: tz }).format(d);
  return `${month} ${year}`;
}

/** "WED SEP 23" — mobile day-group label. */
export function formatDayLabel(iso: string, timezone?: string) {
  const d = new Date(iso);
  const tz = tzOf(timezone);
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(d).toUpperCase();
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: tz }).format(d).toUpperCase();
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: tz }).format(d);
  return `${weekday} ${month} ${day}`;
}

/** {weekday: "WED", day: "23"} for the AgendaDay date column. */
export function formatDayColumn(iso: string, timezone?: string) {
  const d = new Date(iso);
  const tz = tzOf(timezone);
  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(d).toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: tz }).format(d),
  };
}

const isSameDay = (a: Date, b: Date, timezone?: string) => {
  const tz = tzOf(timezone);
  const fmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "numeric", day: "numeric", timeZone: tz });
  return fmt.format(a) === fmt.format(b);
};

/**
 * Event page date line: "Wednesday, September 23" (+ ", 2026" when not the current year).
 * Multi-day: "Wednesday, September 23 → Thursday, September 24".
 */
export function formatEventPageDate(startIso: string, endIso: string, timezone?: string) {
  const tz = tzOf(timezone);
  const start = new Date(startIso);
  const end = new Date(endIso);
  const currentYear = new Date().getFullYear();
  const long = (d: Date) => {
    const base = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: tz }).format(d);
    const year = Number(new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: tz }).format(d));
    return year === currentYear ? base : `${base}, ${year}`;
  };
  if (isSameDay(start, end, timezone)) return long(start);
  return `${long(start)} → ${long(end)}`;
}

/**
 * Event page time line: "5:00 – 7:00 PM" (same day) or "5:00 PM → 7:00 PM" (multi-day).
 */
export function formatEventPageTime(startIso: string, endIso: string, timezone?: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (isSameDay(start, end, timezone)) return formatTimeRange(startIso, endIso, timezone);
  const a = timeParts(start, timezone);
  const b = timeParts(end, timezone);
  return `${a.time} ${a.meridiem} → ${b.time} ${b.meridiem}`;
}

export type Semester = { term: "SPRING" | "SUMMER" | "FALL"; year: number };

/** Fall = Sep–Dec, Spring = Jan–May, Summer = Jun–Aug. */
export function semesterOf(iso: string, timezone?: string): Semester {
  const d = new Date(iso);
  const tz = tzOf(timezone);
  const month = Number(new Intl.DateTimeFormat("en-US", { month: "numeric", timeZone: tz }).format(d));
  const year = Number(new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: tz }).format(d));
  if (month <= 5) return { term: "SPRING", year };
  if (month <= 8) return { term: "SUMMER", year };
  return { term: "FALL", year };
}

export function semesterLabel(semester: Semester, isCurrent: boolean) {
  const base = `${semester.term} ${semester.year}`;
  return isCurrent ? `${base} · SO FAR` : base;
}

export function semesterKey(semester: Semester) {
  return `${semester.term}-${semester.year}`;
}
