import type { ArmyCampFile } from "@/data/types";

export async function loadArmyCamp(): Promise<ArmyCampFile> {
  const res = await fetch("/data/army/army_camp.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load army_camp.json");
  return (await res.json()) as ArmyCampFile;
}
