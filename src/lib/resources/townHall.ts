// src/lib/resources/townhall.ts
import type { TownHallFile, TownHallRow } from "@/data/types";
import { buildCategoriesForTH, type TownHallCategories } from "@/lib/categories";

export type CategoryKey = "Army" | "Resources" | "Defenses" | "Traps";

export interface StructureEntry {
  id: string;
  label: string;
  count: number;
}

export type THCategoryGroups = Record<CategoryKey, StructureEntry[]>;

export type TownHallRowWithCategories = TownHallRow & {
  categories: THCategoryGroups;
};

/** Load /data/town_hall_levels.json from public */
export async function loadTownHall(): Promise<TownHallFile> {
  const res = await fetch("/data/resources/town_hall_levels.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load town_hall_levels.json");
  return (await res.json()) as TownHallFile;
}

/** fetch a single Town Hall row for a given TH (e.g., 7). */
export async function getTownHallRow(th: number | undefined): Promise<TownHallRow | null> {
  if (!Number.isFinite(th)) throw new Error("Invalid Town Hall number");
  const data = await loadTownHall();
  if (!data) return null;
  return data.levels.find(r => r.th === th) ?? null;
}

/** Enriched shape for the UI (Town Hall row + derived categories). */
export type TownHallWithCategories = TownHallRow & {
  categories: TownHallCategories;
};

/** UI-friendly accessor — returns base row + categories derived from JSON files. */
export async function getTownHallRowWithCategories(th: number): Promise<TownHallWithCategories | null> {
  const row = await getTownHallRow(th);
  if (!row) return null;
  const categories = await buildCategoriesForTH(th); // derives from thRequired in each JSON
  return { ...row, categories };
}
