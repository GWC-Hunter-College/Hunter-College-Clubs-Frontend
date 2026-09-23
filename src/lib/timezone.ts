const DEFAULT_TZ = "America/New_York";

function offsetMinutesAt(utcMs: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  return (asUtc - utcMs) / 60_000;
}

/**
 * Converts a "YYYY-MM-DD"/"HH:mm" pair, read as wall-clock time in `timeZone` (default
 * America/New_York — the app's display default), into a correct UTC ISO string. Used so a
 * typed time displays the same way everywhere regardless of the browser's own timezone,
 * instead of the native Date constructor's browser-local interpretation.
 */
export function wallTimeToUtcIso(date: string, time: string, timeZone = DEFAULT_TZ) {
  const naiveUtcMs = Date.parse(`${date}T${time}:00Z`);
  if (Number.isNaN(naiveUtcMs)) return null;
  const offset = offsetMinutesAt(naiveUtcMs, timeZone);
  return new Date(naiveUtcMs - offset * 60_000).toISOString();
}
