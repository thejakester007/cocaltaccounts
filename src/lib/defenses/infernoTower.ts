import type { InfernoTowerFile } from "@/data/types";

export async function loadInfernoTower(): Promise<InfernoTowerFile> {
  const res = await fetch("/data/defenses/inferno_tower.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load inferno_tower.json");
  return (await res.json()) as InfernoTowerFile;
}
