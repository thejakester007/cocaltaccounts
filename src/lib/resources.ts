// src/lib/resources.ts
// Loads local resource structure JSON and normalizes into a simple shape
// used by buildCategoriesForTH.

import type {
  AvailabilityByTH,
  ResourceCollectorsFile,
  ResourceStoragesFile,
  CollectorLevelRow,
  CollectorSuperchargeRow,
  ResourceStorageLevelRow,
} from "@/data/types";

// ---- normalized shape consumed by categories.ts
export interface StructureData {
  id: string;                                     // e.g., "gold_mine"
  label: string;                                  // e.g., "Gold Mine"
  levels: Array<{ level: number; thRequired: number }>;
  availabilityByTH?: AvailabilityByTH[];
}

// ---- local fetch helper
async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return (await res.json()) as T;
}

// ---- small helpers
function allLevelsWithTH<T extends { level: number; thRequired: number }>(
  base: T[],
  extra?: T[] | null
): T[] {
  return extra && extra.length ? [...base, ...extra] : base;
}

const LABELS: Record<string, string> = {
  gold_mine: "Gold Mine",
  elixir_collector: "Elixir Collector",
  dark_elixir_drill: "Dark Elixir Drill",
  gold_storage: "Gold Storage",
  elixir_storage: "Elixir Storage",
  // You said to skip clan castle / dark elixir storage from the category list,
  // so no labels are needed here for those (but add if you decide to surface them).
};

// ---- collectors (gold + elixir) in /data/resources/resource_collectors.json
async function loadCollectors(): Promise<StructureData[]> {
  const file = await loadJson<ResourceCollectorsFile>("/data/resources/resource_collectors.json");

  // Merge base + supercharge for max-level-at-TH computation
  const merged: (CollectorLevelRow | CollectorSuperchargeRow)[] =
    allLevelsWithTH(file.levels, file.superchargeLevels);

  // file.appliesTo e.g. ["gold","elixir"] -> create a StructureData per kind
  return file.appliesTo.map((kind) => {
    const id = kind === "gold" ? "gold_mine" : "elixir_collector";
    return {
      id,
      label: LABELS[id],
      levels: merged.map((l) => ({ level: l.level, thRequired: l.thRequired })),
      availabilityByTH: file.availabilityByTH,
    };
  });
}

// ---- storages (gold + elixir) in /data/resources/resource_storages.json
async function loadStorages(): Promise<StructureData[]> {
  const file = await loadJson<ResourceStoragesFile>("/data/resources/resource_storages.json");

  return file.appliesTo.map((kind) => {
    const id = kind === "gold" ? "gold_storage" : "elixir_storage";
    return {
      id,
      label: LABELS[id],
      levels: file.levels.map((l: ResourceStorageLevelRow) => ({
        level: l.level,
        thRequired: l.thRequired,
      })),
      availabilityByTH: file.availabilityByTH,
    };
  });
}

// ---- dark elixir drill (separate file) in /data/resources/dark_elixir_drill.json
interface DarkElixirDrillFile {
  version: number;
  schema: string; // "dark_elixir_drill@1"
  levels: Array<{ level: number; thRequired: number }>;
  availabilityByTH?: AvailabilityByTH[];
}

// ---- dark elixir storage (separate file) in /data/resources/dark_elixir_storage.json
interface DarkElixirStorageFile {
  version: number;
  schema: string; // "dark_elixir_storage@1"
  levels: Array<{ level: number; thRequired: number }>;
}

async function loadDarkElixirDrill(): Promise<StructureData> {
  const file = await loadJson<DarkElixirDrillFile>("/data/resources/dark_elixir_drill.json");
  return {
    id: "dark_elixir_drill",
    label: LABELS["dark_elixir_drill"],
    levels: file.levels,
    availabilityByTH: file.availabilityByTH,
  };
}

async function loadDarkElixirStorage(): Promise<StructureData> {
  const file = await loadJson<DarkElixirDrillFile>("/data/resources/dark_elixir_storage.json");
  return {
    id: "dark_elixir_storage",
    label: "Dark Elixir Storage",
    levels: file.levels
  };
}

// ---- public API used by categories.ts
export async function loadResourcesAll(): Promise<{
  collectors: StructureData[]; // gold_mine, elixir_collector (and optionally dark_elixir_drill if you merge it there)
  storages: StructureData[];   // gold_storage, elixir_storage
  darkElixirDrill?: StructureData;
  darkElixirStorage?: StructureData;
}> {
  const [collectors, storages, darkElixirDrill, darkElixirStorage] = await Promise.all([
    loadCollectors(),
    loadStorages(),
    loadDarkElixirDrill(),
    loadDarkElixirStorage()
  ]);

  return { collectors, storages, darkElixirDrill, darkElixirStorage };
}
