import type { SpellTowerFile } from "@/data/types";

export async function loadSpellTower(): Promise<SpellTowerFile> {
  const res = await fetch("/data/defenses/spell_tower.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load spell_tower.json");
  return (await res.json()) as SpellTowerFile;
}
