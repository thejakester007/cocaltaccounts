import type { ResourceCollectorsFile } from "@/data/types";

export async function loadResourceCollectors(): Promise<ResourceCollectorsFile> {
  const res = await fetch("/data/resources/resource_collectors.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load resource_collectors.json");
  return (await res.json()) as ResourceCollectorsFile;
}
