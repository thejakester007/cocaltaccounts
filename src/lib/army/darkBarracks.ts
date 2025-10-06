import type { DarkBarracksFile } from "@/data/types";

export async function loadDarkBarracks(): Promise<DarkBarracksFile> {
  const res = await fetch("/data/army/dark_barracks.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dark_barracks.json");
  return (await res.json()) as DarkBarracksFile;
}
