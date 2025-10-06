import type { LaboratoryFile } from "@/data/types";

export async function loadLaboratory(): Promise<LaboratoryFile> {
  const res = await fetch("/data/army/laboratory.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load laboratory.json");
  return (await res.json()) as LaboratoryFile;
}
