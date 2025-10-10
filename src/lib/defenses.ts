// src/lib/defenses.ts
import type { AvailabilityByTH } from "@/data/types";
import type { StructureData } from "./resources";

interface DefenseFile {
  version: number;
  schema: string;
  levels: Array<{ level: number; thRequired: number }>;
  availabilityByTH?: AvailabilityByTH[];
}

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return (await res.json()) as T;
}

const LABELS: Record<string, string> = {
  archer_tower: "Archer Tower",
  cannon: "Cannon",
  mortar: "Mortar",
  air_defense: "Air Defense",
  wizard_tower: "Wizard Tower",
  air_sweeper: "Air Sweeper",
  hidden_tesla: "Hidden Tesla",
  bomb_tower: "Bomb Tower",
  x_bow: "X-Bow",
  inferno_tower: "Inferno Tower",
  scattershot: "Scattershot",
  spell_tower: "Spell Tower",
};

async function loadDefense(id: keyof typeof LABELS): Promise<StructureData> {
  const file = await loadJson<DefenseFile>(`/data/defenses/${id}.json`);
  return {
    id,
    label: LABELS[id],
    levels: file.levels.map(l => ({ level: l.level, thRequired: l.thRequired })),
    availabilityByTH: file.availabilityByTH,
  };
}

export async function loadDefensesAll(): Promise<StructureData[]> {
  const ids = [
    "archer_tower",
    "cannon",
    "mortar",
    "air_defense",
    "wizard_tower",
    "air_sweeper",
    "hidden_tesla",
    "bomb_tower",
    "x_bow",
    "inferno_tower",
    "scattershot",
    "spell_tower",
  ] as const;

  return Promise.all(ids.map(loadDefense));
}
