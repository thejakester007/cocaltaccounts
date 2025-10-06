import type { MultiGearTowerFile } from "@/data/types";

export async function loadMultiGearTower(): Promise<MultiGearTowerFile> {
  const res = await fetch("/data/defenses/multi_gear_tower.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load multi_gear_tower.json");
  return (await res.json()) as MultiGearTowerFile;
}
