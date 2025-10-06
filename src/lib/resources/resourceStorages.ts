import type { ResourceStoragesFile } from "@/data/types";

export async function loadResourceStorages(): Promise<ResourceStoragesFile> {
  const res = await fetch("/data/resources/resource_storages.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load resource_storages.json");
  return (await res.json()) as ResourceStoragesFile;
}
