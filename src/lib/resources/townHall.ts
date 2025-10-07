// src/lib/townhall.ts
import type { TownHallFile } from "@/data/types";

/** Load /data/town_hall_levels.json from public */
export async function loadTownHall(): Promise<TownHallFile> {
  const res = await fetch("/data/resources/town_hall_levels.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load town_hall_levels.json");
  return (await res.json()) as TownHallFile;
}