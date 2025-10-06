import type { ResourceCollectorsFile } from "@/data/types";

export async function loadDarkElixirDrill(): Promise<ResourceCollectorsFile> {
  const res = await fetch("/data/resources/dark_elixir_drill.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dark_elixir_drill.json");
  return (await res.json()) as ResourceCollectorsFile;
}
