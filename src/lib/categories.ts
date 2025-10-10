// src/lib/categories.ts
import { loadArmyAll } from "./army";
import { maxLevelForTH, countForTH } from "./structures-availability";
import { loadResourcesAll } from "./resources";
import { loadDefensesAll } from "./defenses"
import { loadTrapsAll } from "./traps";

export interface StructureAvailability {
  id: string;
  label: string;
  maxLevelAtTH: number | null;
  countMaxAtTH: number | null;
  available: boolean;
}

export interface TownHallCategories {
  army: StructureAvailability[];
  resources: StructureAvailability[];
  defenses: StructureAvailability[];
  traps: StructureAvailability[];
}

export async function buildCategoriesForTH(th: number): Promise<TownHallCategories> {
  const {
    armyCamp,
    barracks,
    darkBarracks,
    heroHall,
    laboratory,
    petHouse,
    spellFactory,
    workshop,
  } = await loadArmyAll();

  const mk = (
    id: string,
    label: string,
    levels: { thRequired: number; level: number }[],
    countMaxAtTH: number | null // pass explicit count if we have it, otherwise null to default below
  ) => {
    const max = maxLevelForTH(levels, th);
    const available = !!max;
    return {
      id,
      label,
      maxLevelAtTH: max,
      countMaxAtTH: countMaxAtTH ?? (available ? 1 : null), // singletons default to 1 when available
      available,
    } as StructureAvailability;
  };

  // --- Army Structures ---
  const army: StructureAvailability[] = [
    // Army Camp: use table
    mk(
      "army_camp",
      "Army Camp",
      armyCamp.levels,
      countForTH(armyCamp.availabilityByTH, th)
    ),

    // Singletons (default count = 1 when available)
    mk("barracks", "Barracks", barracks.levels, null),
    mk("dark_barracks", "Dark Barracks", darkBarracks.levels, null),
    mk("laboratory", "Laboratory", laboratory.levels, null),
    mk("spell_factory", "Spell Factory", spellFactory.levels, null),
    mk("workshop", "Siege Workshop", workshop.levels, null),
    mk("hero_hall", "Hero Hall", heroHall.levels, null),
    mk("pet_house", "Pet House", petHouse.levels, null),
  ].sort((a, b) => a.label.localeCompare(b.label));

  const { collectors, storages, darkElixirDrill, darkElixirStorage } = await loadResourcesAll();

  const resources: StructureAvailability[] = [
    // Collectors (Gold Mine, Elixir Collector)
    ...collectors.map(c =>
      mk(c.id, c.label, c.levels, countForTH(c.availabilityByTH, th))
    ),

    // Storages (Gold Storage, Elixir Storage)
    ...storages.map(s =>
      mk(s.id, s.label, s.levels, countForTH(s.availabilityByTH, th))
    ),

    // Dark Elixir Drill (separate file)
    ...(darkElixirDrill
      ? [
        mk(
          darkElixirDrill.id,
          darkElixirDrill.label,
          darkElixirDrill.levels,
          countForTH(darkElixirDrill.availabilityByTH, th)
        ),
      ]
      : []),

    ...(darkElixirStorage
      ? [
        mk(
          darkElixirStorage.id,
          darkElixirStorage.label,
          darkElixirStorage.levels,
          null // no availabilityByTH -> mk() will set 1 if available
        ),
      ]
      : []),
  ].sort((a, b) => a.label.localeCompare(b.label));

  // --- DEFENSES ---
  const defensesList = await loadDefensesAll();

  const defenses: StructureAvailability[] = defensesList
    .map(d =>
      mk(
        d.id,
        d.label,
        d.levels,
        countForTH(d.availabilityByTH, th) // may be undefined; your helper handles it
      )
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  // --- TRAPS ---
  const trapsList = await loadTrapsAll();

  const traps: StructureAvailability[] = trapsList
    .map(t => mk(t.id, t.label, t.levels, countForTH(t.availabilityByTH, th)))
    .sort((a, b) => a.label.localeCompare(b.label));

  return { army, resources, defenses, traps };
}
