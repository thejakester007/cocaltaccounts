import type { TrapSpringFile } from "@/data/types";

export async function loadTrapSpring(): Promise<TrapSpringFile> {
  const res = await fetch("/data/traps/spring_trap.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load trap_spring.json");
  return (await res.json()) as TrapSpringFile;
}
