import type { BarracksFile } from "@/data/types";

export async function loadBarracks(): Promise<BarracksFile> {
  const res = await fetch("/data/army/barracks.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load barracks.json");
  return (await res.json()) as BarracksFile;
}
