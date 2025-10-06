import type { ArcherTowerFile } from "@/data/types";

export async function loadArcherTower(): Promise<ArcherTowerFile> {
  const res = await fetch("/data/defenses/archer_tower.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load archer_tower.json");
  return (await res.json()) as ArcherTowerFile;
}
