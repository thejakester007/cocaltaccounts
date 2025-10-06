import type { ScattershotFile } from "@/data/types";

export async function loadScattershot(): Promise<ScattershotFile> {
  const res = await fetch("/data/defenses/scattershot.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load scattershot.json");
  return (await res.json()) as ScattershotFile;
}
