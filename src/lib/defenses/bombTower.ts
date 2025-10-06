import type { BombTowerFile } from "@/data/types";

export async function loadBombTower(): Promise<BombTowerFile> {
  const res = await fetch("/data/defenses/bomb_tower.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load bomb_tower.json");
  return (await res.json()) as BombTowerFile;
}
