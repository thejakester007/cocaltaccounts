// src/lib/army.ts
import { loadJson as load } from "@/lib/fetch";
import type {
  ArmyCampFile,
  BarracksFile,
  DarkBarracksFile,
  HeroHallFile,
  LaboratoryFile,
  PetHouseFile,
  SpellFactoryFile,
  WorkshopFile,
} from "@/data/types";

export const ARMY_PATHS = {
  armyCamp: "/data/army/army_camp.json",
  barracks: "/data/army/barracks.json",
  darkBarracks: "/data/army/dark_barracks.json",
  heroHall: "/data/army/hero_hall.json",
  laboratory: "/data/army/laboratory.json",
  petHouse: "/data/army/pet_house.json",
  spellFactory: "/data/army/spell_factory.json",
  workshop: "/data/army/workshop.json",
} as const;

export const loadArmyCamp = () => load<ArmyCampFile>(ARMY_PATHS.armyCamp, "army_camp.json");
export const loadBarracks = () => load<BarracksFile>(ARMY_PATHS.barracks, "barracks.json");
export const loadDarkBarracks = () => load<DarkBarracksFile>(ARMY_PATHS.darkBarracks, "dark_barracks.json");
export const loadHeroHall = () => load<HeroHallFile>(ARMY_PATHS.heroHall, "hero_hall.json");
export const loadLaboratory = () => load<LaboratoryFile>(ARMY_PATHS.laboratory, "laboratory.json");
export const loadPetHouse = () => load<PetHouseFile>(ARMY_PATHS.petHouse, "pet_house.json");
export const loadSpellFactory = () => load<SpellFactoryFile>(ARMY_PATHS.spellFactory, "spell_factory.json");
export const loadWorkshop = () => load<WorkshopFile>(ARMY_PATHS.workshop, "workshop.json");

/** Load all army files in parallel (nice for category building). */
export async function loadArmyAll() {
  const [
    armyCamp,
    barracks,
    darkBarracks,
    heroHall,
    laboratory,
    petHouse,
    spellFactory,
    workshop,
  ] = await Promise.all([
    loadArmyCamp(),
    loadBarracks(),
    loadDarkBarracks(),
    loadHeroHall(),
    loadLaboratory(),
    loadPetHouse(),
    loadSpellFactory(),
    loadWorkshop(),
  ]);

  return {
    armyCamp,
    barracks,
    darkBarracks,
    heroHall,
    laboratory,
    petHouse,
    spellFactory,
    workshop,
  };
}
