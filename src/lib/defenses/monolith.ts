import type { MonolithFile } from "@/data/types";

export async function loadMonolith(): Promise<MonolithFile> {
  const res = await fetch("/data/defenses/monolith.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load monolith.json");
  return (await res.json()) as MonolithFile;
}
