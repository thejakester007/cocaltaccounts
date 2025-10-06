import type { PetHouseFile } from "@/data/types";

export async function loadPetHouse(): Promise<PetHouseFile> {
  const res = await fetch("/data/army/pet_house.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load pet_house.json");
  return (await res.json()) as PetHouseFile;
}
