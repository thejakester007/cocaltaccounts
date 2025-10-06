import type { WizardTowerFile } from "@/data/types";

export async function loadWizardTower(): Promise<WizardTowerFile> {
  const res = await fetch("/data/defenses/wizard_tower.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load wizard_tower.json");
  return (await res.json()) as WizardTowerFile;
}
