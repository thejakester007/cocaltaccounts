// src/lib/townhall.ts
import type { TownHallFile } from "@/data/types";

/** Load /data/town_hall_levels.json from public */
export async function loadTownHall(): Promise<TownHallFile> {
  const res = await fetch("/data/resources/town_hall_levels.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load town_hall_levels.json");
  return (await res.json()) as TownHallFile;
}

/** "1d4h30m" -> ms (shared simple parser) */
export function parseDurationToMs(input: string | null | undefined): number | null {
  if (!input) return null;
  const m = input.match(/^(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?$/i);
  if (!m) return null;
  const d = parseInt(m[1] || "0", 10);
  const h = parseInt(m[2] || "0", 10);
  const mi = parseInt(m[3] || "0", 10);
  const s = parseInt(m[4] || "0", 10);
  const ms = d * 86400000 + h * 3600000 + mi * 60000 + s * 1000;
  return ms >= 0 ? ms : null;
}
