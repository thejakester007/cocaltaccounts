import type { BuilderHutFile } from "@/data/types";

export async function loadBuilderHut(): Promise<BuilderHutFile> {
  const res = await fetch("/data/defenses/builder_hut.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load builder_hut.json");
  return (await res.json()) as BuilderHutFile;
}
