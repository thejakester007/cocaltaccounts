// src/lib/resources/capacity.ts
import type { Account, ResourceStoragesFile } from "@/data/types";

import { loadResourceStorages } from "./resourceStorages";
import { loadDarkElixirStorage } from "./darkElixirStorage";

export type StorageSpec = { level: number; storageCapacity: number }; // from your JSON rows
export type ResourceCaps = { goldMax: number; elixirMax: number; darkMax: number };

// Town Hall base caps (Gold & Elixir are identical → `reg`; Dark separate)
const TH_BASE: Record<number, { reg: number; dark: number }> = {
  1: { reg: 1_000, dark: 0 },
  2: { reg: 2_500, dark: 0 },
  3: { reg: 10_000, dark: 0 },
  4: { reg: 50_000, dark: 0 },
  5: { reg: 100_000, dark: 0 },
  6: { reg: 300_000, dark: 0 },
  7: { reg: 500_000, dark: 2_500 },
  8: { reg: 750_000, dark: 5_000 },
  9: { reg: 1_000_000, dark: 10_000 },
  10: { reg: 1_500_000, dark: 20_000 },
  11: { reg: 2_000_000, dark: 20_000 },
  12: { reg: 2_000_000, dark: 20_000 },
  13: { reg: 2_000_000, dark: 20_000 },
  14: { reg: 3_000_000, dark: 30_000 },
  15: { reg: 3_000_000, dark: 30_000 },
  16: { reg: 4_000_000, dark: 40_000 },
  17: { reg: 4_000_000, dark: 40_000 },
};

const toNum = (x: unknown) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
};

// ---- Lazy, module-scoped cache of the two JSONs ----
let _catalogs:
  | { regular: ResourceStoragesFile; dark: ResourceStoragesFile | null }
  | null = null;

async function ensureCatalogs() {
  if (_catalogs) return _catalogs;
  const [regular, dark] = await Promise.all([
    loadResourceStorages(),       // gold+elixir shared table
    loadDarkElixirStorage().catch(() => null), // in case it's not present yet
  ]);
  _catalogs = { regular, dark };
  return _catalogs;
}

// helpers to read capacity from the JSONs directly (no CapMap needed)
function capAtLevel(file: ResourceStoragesFile | null | undefined, level?: number): number {
  if (!file || !Number.isFinite(level as number)) return 0;
  const row = file.levels.find(r => toNum((r as any).level) === toNum(level));
  return row ? toNum((row as any).storageCapacity) : 0;
}

function sumCaps(file: ResourceStoragesFile, levels: number[] = []): number {
  if (!levels.length) return 0;
  let s = 0;
  for (const lvl of levels) s += capAtLevel(file, lvl);
  return s;
}

export async function getResourceCaps(params: {
  th: number | undefined;
  goldStorageLvls: number[];    // e.g., [11,11,10,10]
  elixirStorageLvls: number[];  // e.g., [11,11,10,10]
  darkStorageLvl: number;       // single building (Dark Elixir Storage)
}): Promise<ResourceCaps> {
  const base = TH_BASE[params.th ?? 0] ?? { reg: 0, dark: 0 };
  const { regular, dark } = await ensureCatalogs();

  // Gold & Elixir share the same per-level capacity table (regular)
  const goldMax = base.reg + sumCaps(regular, params.goldStorageLvls);
  const elixirMax = base.reg + sumCaps(regular, params.elixirStorageLvls);

  // Dark is a single building
  const darkMax = base.dark + capAtLevel(dark, params.darkStorageLvl);

  return { goldMax, elixirMax, darkMax };
}

// optional convenience for UI clamping
export function clampToCaps(value: number, key: "gold" | "elixir" | "dark_elixir", caps: ResourceCaps) {
  const max = key === "gold" ? caps.goldMax : key === "elixir" ? caps.elixirMax : caps.darkMax;
  const n = toNum(value);
  return Math.max(0, Math.min(n, max));
}

export const getDarkStorageLevel = (acc?: Account): number => {
  // TS-safe shim until you model `structures` on Account
  const lvl = (acc as any)?.structures?.resources?.darkStorage;
  return Number.isFinite(lvl) ? Number(lvl) : 1;
};