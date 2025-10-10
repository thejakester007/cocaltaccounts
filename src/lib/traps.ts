// src/lib/traps.ts
// Loads local trap JSON and normalizes into StructureData (same as resources/defenses).

import type { AvailabilityByTH } from "@/data/types";
import type { StructureData } from "./resources"; // type-only

interface TrapFile {
  version: number;
  schema: string; // e.g. "bomb@1"
  levels: Array<{ level: number; thRequired: number }>;
  availabilityByTH?: AvailabilityByTH[];
}

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return (await res.json()) as T;
}

const LABELS: Record<string, string> = {
  bomb: "Bomb",
  spring_trap: "Spring Trap",
  giant_bomb: "Giant Bomb",
  air_bomb: "Air Bomb",
  seeking_air_mine: "Seeking Air Mine",
  skeleton_trap: "Skeleton Trap",
  tornado_trap: "Tornado Trap",
  giga_bomb: "Giga Bomb", // you provided this in your trap data list
};

async function loadTrap(id: keyof typeof LABELS): Promise<StructureData> {
  const file = await loadJson<TrapFile>(`/data/traps/${id}.json`);
  return {
    id,
    label: LABELS[id],
    levels: file.levels.map(l => ({ level: l.level, thRequired: l.thRequired })),
    availabilityByTH: file.availabilityByTH,
  };
}

export async function loadTrapsAll(): Promise<StructureData[]> {
  const ids = [
    "bomb",
    "spring_trap",
    "giant_bomb",
    "air_bomb",
    "seeking_air_mine",
    "skeleton_trap",
    "tornado_trap",
    "giga_bomb",
  ] as const;

  return Promise.all(ids.map(loadTrap));
}
