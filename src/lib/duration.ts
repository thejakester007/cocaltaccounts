// src/lib/duration.ts

/** "1d4h30m" → ms. Accepts "Xd Yh Zm Ws" in any combo/spaces. */
export function parseDurationToMs(input: string | null | undefined): number | null {
  if (!input) return null;
  const m = input.trim().match(/^(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?$/i);
  if (!m) return null;
  const [, d = "0", h = "0", mi = "0", s = "0"] = m;
  const ms = (+d) * 86400000 + (+h) * 3600000 + (+mi) * 60000 + (+s) * 1000;
  return ms >= 0 ? ms : null;
}

/** ms → "Xd Yh Zm" (compact, drops zero units) */
export function formatMsShort(ms: number): string {
  if (ms <= 0) return "0s";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, s && `${s}s`].filter(Boolean).join(" ");
}

/** Add a duration string to a Date (or now) and return ISO. */
export function isoPlus(duration: string, from: Date = new Date()): string {
  const ms = parseDurationToMs(duration) ?? 0;
  return new Date(from.getTime() + ms).toISOString();
}