import type { MultiArcherTowerFile } from "@/data/types";

export async function loadMultiArcherTower(): Promise<MultiArcherTowerFile> {
  const res = await fetch("/data/defenses/multi_archer_tower.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load multi_archer_tower.json");
  return (await res.json()) as MultiArcherTowerFile;
}
