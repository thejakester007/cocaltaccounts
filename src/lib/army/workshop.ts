import type { WorkshopFile } from "@/data/types";

export async function loadWorkshop(): Promise<WorkshopFile> {
  const res = await fetch("/data/army/workshop.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load workshop.json");
  return (await res.json()) as WorkshopFile;
}
