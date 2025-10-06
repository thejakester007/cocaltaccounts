import type { ResourceStoragesFile } from "@/data/types";

export async function loadDarkElixirStorage(): Promise<ResourceStoragesFile> {
  const res = await fetch("/data/resources/dark_elixir_storage.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dark_elixir_storage.json");
  return (await res.json()) as ResourceStoragesFile;
}
