import type { TrapSkeletonTrapFile } from "@/data/types";

export async function loadSkeletonTrap(): Promise<TrapSkeletonTrapFile> {
  const res = await fetch("/data/traps/skeleton_trap.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load skeleton_trap.json");
  return (await res.json()) as TrapSkeletonTrapFile;
}
