// src/data/types.ts

/** Generic duration string like "7d12h", "2h30m", "45m", "10s" */
export type DurationString = string;

/* ---------- Town Hall ---------- */
export interface TownHallRow {
  th: number;                      // 1..17
  hitpoints: number | null;
  buildCostGold: number | null;
  buildTime: DurationString | null;
  expGained: number | null;
  maxBuildings: number | null;
  maxTraps: number | null;
}

export interface TownHallFile {
  version: number;
  schema: string;                  // "town_hall_levels@1"
  note?: string;
  levels: TownHallRow[];
}

/* ---------- Clan Castle ---------- */
export interface ClanCastleLevelRow {
  level: number;                   // 1..13
  hitpoints: number;
  troopCapacity: number;
  spellCapacity: number;
  siegeMachineCapacity: number;    // 0, 1, 2
  labLevelCap: number;             // from your table
  buildCostElixir: number | null;
  buildTime: DurationString | null;
  expGained: number | null;
  thRequired: number;              // Town Hall requirement
}

export interface ClanCastleMachinesPerLevel {
  level: number;                   // CC level
  machines: string[];              // human-readable names
}

export interface ClanCastleFile {
  version: number;
  schema: string;                  // "clan_castle@1"
  note?: string;
  levels: ClanCastleLevelRow[];
  machinesByClanCastleLevel: ClanCastleMachinesPerLevel[];
}

/* ---------- (Optional) Structures (for later) ---------- */
export interface StructureDef {
  id: string;                      // "barracks", "archer_tower", ...
  label: string;                   // "Barracks"
  thMin: number;
  thMax: number;
  defaultDuration?: DurationString;
  byTownHall?: Record<string, DurationString>; // key = TH as string
}

export interface StructuresFile {
  version: number;
  schema?: string;                 // e.g., "structures@1"
  durationFormat?: string;
  structures: StructureDef[];
}

/* ---------- Resource Collectors (Gold Mine / Elixir Collector) ---------- */
export type ResourceKind = "gold" | "elixir" | "dark_elixir";

export interface CollectorLevelRow {
  level: number;
  capacity: number;               // storage capacity
  productionPerHour: number;      // units/hour
  hitpoints: number;
  boostCostGems: number | null;   // N/A -> null
  timeToFill: DurationString;     // e.g., "5h", "6h 15m"
  buildCostElixir: number;
  buildTime: DurationString;
  expGained: number;
  catchUpPoint: DurationString | null; // N/A -> null
  thRequired: number;
}

export interface CollectorSuperchargeRow {
  level: number;
  capacity: number;
  productionPerHour: number;
  hitpoints: number;
  boostCostGems: number;
  timeToFill: DurationString;
  buildCostElixir: number;
  buildTime: DurationString;
  expGained: number;
  catchUpPoint: DurationString | null;
  thRequired: number;
}

export interface ResourceCollectorsFile {
  version: number;
  schema: string;                 // "resource_collectors@1"
  appliesTo: ResourceKind[];      // ["gold","elixir"]
  levels: CollectorLevelRow[];    // base building levels
  superchargeLevels: CollectorSuperchargeRow[]; // optional: TH16+
}

/* ---------- Resource Storages (Gold / Elixir) ---------- */
export type StorageKind = "gold" | "elixir" | "dark_elixir";

export interface ResourceStorageLevelRow {
  level: number;
  storageCapacity: number;
  hitpoints: number;
  buildCostElixir: number;
  buildTime: DurationString;   // e.g., "12h", "3d", "12d 12h"
  expGained: number;
  thRequired: number;
}

export interface ResourceStoragesFile {
  version: number;
  schema: string;              // "resource_storages@1"
  appliesTo: StorageKind[];    // ["gold","elixir"]
  levels: ResourceStorageLevelRow[];
}

/* ---------- Army Camp ---------- */
export interface ArmyCampLevelRow {
  level: number;                // 1..13
  troopCapacity: number;
  hitpoints: number;
  buildCostElixir: number;
  buildTime: DurationString;    // e.g., "2d", "7d"
  expGained: number;
  thRequired: number;
}

export interface ArmyCampFile {
  version: number;
  schema: string;               // "army_camp@1"
  levels: ArmyCampLevelRow[];
}

/* ---------- Barracks ---------- */
export interface BarracksLevelRow {
  level: number;                 // 1..18
  unlockedUnit: string;          // e.g., "Barbarian", "Archer", "P.E.K.K.A"
  hitpoints: number;
  buildCostElixir: number;
  buildTime: DurationString;     // "10s", "1d 12h", "7d 4h", ...
  expGained: number;
  thRequired: number;
}

export interface BarracksFile {
  version: number;
  schema: string;                // "barracks@1"
  levels: BarracksLevelRow[];
}

/* ---------- Dark Barracks ---------- */
// Reuse the same row shape as Barracks
export type DarkBarracksLevelRow = BarracksLevelRow;

export interface DarkBarracksFile {
  version: number;
  schema: string;                // "dark_barracks@1"
  levels: DarkBarracksLevelRow[];
}

/* ---------- Spell Factory ---------- */
export interface SpellFactoryLevelRow {
  level: number;                    // 1..8
  hitpoints: number;
  spellsUnlocked: string[];         // can unlock multiple at a level
  storageCapacity: number;          // number of spells you can hold
  buildCostElixir: number;
  buildTime: DurationString;        // e.g., "2d", "7d"
  expGained: number;
  thRequired: number;
}

export interface SpellFactoryFile {
  version: number;
  schema: string;                   // "spell_factory@1"
  levels: SpellFactoryLevelRow[];
}

/* ---------- Dark Spell Factory ---------- */
export type DarkSpellFactoryLevelRow = SpellFactoryLevelRow;

export interface DarkSpellFactoryFile {
  version: number;
  schema: string;                 // "dark_spell_factory@1"
  levels: DarkSpellFactoryLevelRow[];
}

/* ---------- Laboratory ---------- */
export interface LaboratoryLevelRow {
  level: number;               // 1..15
  hitpoints: number;
  buildCostElixir: number;
  buildTime: DurationString;   // e.g., "1m", "1d 18h", "16d"
  expGained: number;
  thRequired: number;
}

export interface LaboratoryFile {
  version: number;
  schema: string;              // "laboratory@1"
  levels: LaboratoryLevelRow[];
}

/* ---------- Siege Workshop ---------- */
export interface WorkshopLevelRow {
  level: number;                 // 1..8
  unlockedMachine: string;       // e.g., "Wall Wrecker"
  capacity: number;              // number of siege machines you can store
  hitpoints: number;
  buildCostElixir: number;
  buildTime: DurationString;     // e.g., "7d 6h"
  expGained: number;
  thRequired: number;
}

export interface WorkshopFile {
  version: number;
  schema: string;                // "workshop@1"
  levels: WorkshopLevelRow[];
}

/* ---------- Hero Hall ---------- */
export interface HeroHallLevelRow {
  level: number;                 // 1..11
  unlockedHero: string | null;   // "Barbarian King", "Archer Queen", ... or null when none
  heroSlots: number;             // number of concurrent hero upgrade slots (from your table's "Ability Hero Slots")
  hitpoints: number;
  buildCostElixir: number;
  buildTime: DurationString;     // e.g., "7d 12h"
  expGained: number;
  thRequired: number;
}

export interface HeroHallFile {
  version: number;
  schema: string;                // "hero_hall@1"
  levels: HeroHallLevelRow[];
}

/* ---------- Pet House ---------- */
export interface PetHouseLevelRow {
  level: number;                 // 1..11
  unlockedPet: string;           // e.g., "L.A.S.S.I"
  hitpoints: number;
  buildCostElixir: number;
  buildTime: DurationString;     // e.g., "7d 12h"
  expGained: number;
  thRequired: number;
}

/** For per-House-level caps on each pet (optional, expandable). */
export interface PetHouseCapsRow {
  houseLevel: number;
  /** Map of pet name -> max pet level at this Pet House level. Include only known entries. */
  petMax: Record<string, number>;
}

export interface PetHouseFile {
  version: number;
  schema: string;                // "pet_house@1"
  levels: PetHouseLevelRow[];
  /** Optional progressive caps (fill as you verify). */
  maxLevelsByHouseLevel?: PetHouseCapsRow[];
}

/* ---------- Cannon ---------- */
export interface CannonLevelRow {
  level: number;                 // 1..21
  damagePerSecond: number;       // DPS
  damagePerShot?: number;        // optional, if known
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // "3h 30m", "1d 12h", etc.
  expGained: number;
  thRequired: number;
}

export interface CannonGearUpInfo {
  gearUpCostGold: number;        // 1_000_000
  gearUpTime: DurationString;    // "2d"
  homeCannonLevelRequired: number; // 7
  doubleCannonLevelRequired: number; // 4
}

export interface CannonFile {
  version: number;
  schema: string;                // "cannon@1"
  levels: CannonLevelRow[];
  gearUp?: CannonGearUpInfo;
}

/* ---------- Archer Tower ---------- */
export interface ArcherTowerLevelRow {
  level: number;                 // 1..21
  damagePerSecond: number;
  damagePerShot?: number;        // optional
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // "1d 12h", etc.
  expGained: number;
  thRequired: number;
}

export interface ArcherTowerGearUpInfo {
  gearUpCostGold: number;        // e.g., 3_000_000
  gearUpTime: DurationString;    // e.g., "7d"
  homeArcherTowerLevelRequired: number;    // 10
  builderBaseArcherTowerLevelRequired: number; // 6
}

export interface ArcherTowerFile {
  version: number;
  schema: string;                // "archer_tower@1"
  levels: ArcherTowerLevelRow[];
  gearUp?: ArcherTowerGearUpInfo;
}

/* ---------- Mortar ---------- */
export interface MortarLevelRow {
  level: number;                 // 1..17
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface MortarSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface MortarGearUpInfo {
  gearUpCostGold: number;
  gearUpTime: DurationString;
  homeMortarLevelRequired: number;
  multiMortarLevelRequired: number;
}

export interface MortarFile {
  version: number;
  schema: string;                // "mortar@1"
  levels: MortarLevelRow[];
  superchargeLevels?: MortarSuperchargeRow[];
  gearUp?: MortarGearUpInfo;
}

/* ---------- Air Defense ---------- */
export interface AirDefenseLevelRow {
  level: number;                 // 1..15
  damagePerSecond: number;
  damagePerShot?: number;        // your table’s “Damage per Attack”
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface AirDefenseSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface AirDefenseFile {
  version: number;
  schema: string;                // "air_defense@1"
  levels: AirDefenseLevelRow[];
  superchargeLevels?: AirDefenseSuperchargeRow[];
}

/* ---------- Wizard Tower ---------- */
export interface WizardTowerLevelRow {
  level: number;                 // 1..17
  damagePerSecond: number;
  damagePerShot?: number;        // splash tower, your table includes it
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface WizardTowerSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface WizardTowerFile {
  version: number;
  schema: string;                // "wizard_tower@1"
  levels: WizardTowerLevelRow[];
  superchargeLevels?: WizardTowerSuperchargeRow[];
}

/* ---------- Air Sweeper ---------- */
export interface AirSweeperLevelRow {
  level: number;               // 1..7
  pushStrengthTiles: number;   // e.g., 1.6 = "1.6 tiles"
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;   // "4h", "2d", ...
  expGained: number;
  thRequired: number;
}

export interface AirSweeperFile {
  version: number;
  schema: string;              // "air_sweeper@1"
  levels: AirSweeperLevelRow[];
}

/* ---------- Hidden Tesla ---------- */
export interface HiddenTeslaLevelRow {
  level: number;                 // 1..16
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface HiddenTeslaSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface HiddenTeslaFile {
  version: number;
  schema: string;                // "hidden_tesla@1"
  levels: HiddenTeslaLevelRow[];
  superchargeLevels?: HiddenTeslaSuperchargeRow[];
}

/* ---------- Bomb Tower ---------- */
export interface BombTowerLevelRow {
  level: number;                 // 1..12
  damagePerSecond: number;
  damagePerShot?: number;
  deathDamage: number;           // damage when destroyed
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface BombTowerSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface BombTowerFile {
  version: number;
  schema: string;                // "bomb_tower@1"
  levels: BombTowerLevelRow[];
  superchargeLevels?: BombTowerSuperchargeRow[];
}

/* ---------- X-Bow ---------- */
export interface XBowLevelRow {
  level: number;                 // 1..12
  damagePerSecond: number;
  damagePerShot?: number;        // provided in your table
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // e.g., "7d 12h"
  expGained: number;
  thRequired: number;
}

export interface XBowSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface XBowFile {
  version: number;
  schema: string;                // "x_bow@1"
  levels: XBowLevelRow[];
  superchargeLevels?: XBowSuperchargeRow[];
}

/* ---------- Inferno Tower (single-target) ---------- */
export interface InfernoTowerLevelRow {
  level: number;                 // 1..11
  // DPS ramp
  dpsInitial: number;            // e.g., 30
  dpsAfter1_5s: number;          // e.g., 80
  dpsAfter5_25s: number;         // e.g., 800
  // Damage-per-hit ramp
  dphInitial: number;            // e.g., 3.84
  dphAfter1_5s: number;          // e.g., 10.24
  dphAfter5_25s: number;         // e.g., 102.4
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // "7d 18h", etc.
  expGained: number;
  thRequired: number;
}

export interface InfernoTowerSuperchargeRow {
  level: number;                 // 1..n
  dpsInitial: number;
  dpsAfter1_5s: number;
  dpsAfter5_25s: number;
  dphInitial: number;
  dphAfter1_5s: number;
  dphAfter5_25s: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface InfernoTowerFile {
  version: number;
  schema: string;                // "inferno_tower@1"
  levels: InfernoTowerLevelRow[];
  superchargeLevels?: InfernoTowerSuperchargeRow[];
}

/* ---------- Eagle Artillery ---------- */
export interface EagleArtilleryLevelRow {
  level: number;                 // 1..7
  damagePerHit: number;          // splash shell damage
  damagePerSecond: number;       // DPS (from table)
  shockwaveDamage: number;       // extra shockwave splash
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // "9d 12h", etc.
  expGained: number;
  thRequired: number;
}

export interface EagleArtilleryFile {
  version: number;
  schema: string;                // "eagle_artillery@1"
  levels: EagleArtilleryLevelRow[];
}

/* ---------- Scattershot ---------- */
export interface ScattershotLevelRow {
  level: number;                 // 1..6
  damagePerSecond: number;
  // Ranged values from the table
  damagePerShotMin: number;
  damagePerShotMax: number;
  splashDamageMin: number;
  splashDamageMax: number;

  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // e.g., "8d 12h"
  expGained: number;
  thRequired: number;
}

export interface ScattershotSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShotMin: number;
  damagePerShotMax: number;
  splashDamageMin: number;
  splashDamageMax: number;

  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface ScattershotFile {
  version: number;
  schema: string;                // "scattershot@1"
  levels: ScattershotLevelRow[];
  superchargeLevels?: ScattershotSuperchargeRow[];
}

/* ---------- Builder Hut ---------- */
export interface BuilderHutLevelRow {
  level: number;                 // 1..7
  damagePerSecond?: number | null;
  damagePerShot?: number | null;
  repairPerSecond?: number | null;
  repairPerHit?: number | null;
  hitpoints: number;
  buildCostGold: number | null;  // L1 = null (varies / non-upgrade)
  buildTime: DurationString | null; // L1 = null
  expGained: number;
  thRequired: number;
}

export interface BuilderHutSuperchargeRow {
  level: number;                 // 1..n
  damagePerSecond: number;
  damagePerShot: number;
  repairPerSecond: number;
  repairPerHit: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface BuilderHutFile {
  version: number;
  schema: string;                // "builder_hut@1"
  levels: BuilderHutLevelRow[];
  superchargeLevels?: BuilderHutSuperchargeRow[];
}

/* ---------- Spell Tower ---------- */
export interface SpellTowerLevelRow {
  level: number;                 // 1..3
  unlocksSpell: "Rage" | "Poison" | "Invisibility"; // unlock at this level
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // e.g., "7d"
  expGained: number;
  thRequired: number;            // 15 for all rows (per your table)
}

export interface SpellTowerFile {
  version: number;
  schema: string;                // "spell_tower@1"
  levels: SpellTowerLevelRow[];
}

/* ---------- Monolith ---------- */
export interface MonolithLevelRow {
  level: number;                 // 1..4
  baseDamagePerSecond: number;   // from table
  baseDamagePerShot: number;     // from table
  bonusDamagePerShotPct: number; // 0.11 = 11%
  hitpoints: number;
  buildCostDarkElixir: number;   // DE cost
  buildTime: DurationString;     // e.g., "7d", "15d 18h"
  expGained: number;
  thRequired: number;
}

export interface MonolithSuperchargeRow {
  level: number;                 // 1..n
  baseDamagePerSecond: number;
  baseDamagePerShot: number;
  bonusDamagePerShotPct: number; // fraction form
  hitpoints: number;
  buildCostDarkElixir: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface MonolithFile {
  version: number;
  schema: string;                // "monolith@1"
  levels: MonolithLevelRow[];
  superchargeLevels?: MonolithSuperchargeRow[];
}

/* ---------- Multi-Archer Tower ---------- */
export interface MultiArcherTowerLevelRow {
  level: number;                 // 1..3
  dpsPerArcher: number;          // "Damage per Second per Archer"
  damagePerShot: number;         // per arrow
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;     // e.g., "9d", "15d 12h"
  expGained: number;
  thRequired: number;            // 16+ per your table
}

export interface MultiArcherTowerSuperchargeRow {
  level: number;                 // 1..n
  dpsPerArcher: number;
  damagePerShot: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface MultiArcherTowerFile {
  version: number;
  schema: string;                // "multi_archer_tower@1"
  levels: MultiArcherTowerLevelRow[];
  superchargeLevels?: MultiArcherTowerSuperchargeRow[];
}

/* ---------- Ricochet Cannon ---------- */
export interface RicochetCannonLevelRow {
  level: number;               // 1..3
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;   // e.g., "15d 12h"
  expGained: number;
  thRequired: number;
}

export interface RicochetCannonSuperchargeRow {
  level: number;               // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface RicochetCannonFile {
  version: number;
  schema: string;              // "ricochet_cannon@1"
  levels: RicochetCannonLevelRow[];
  superchargeLevels?: RicochetCannonSuperchargeRow[];
}

/* ---------- Multi-Gear Tower ---------- */
export interface MultiGearTowerLevelRow {
  level: number;               // 1..2
  damagePerSecond: number;
  damagePerShot?: number;      // provided in table
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;   // e.g., "15d"
  expGained: number;
  thRequired: number;          // 17 per your data
}

export interface MultiGearTowerSuperchargeRow {
  level: number;               // 1..n
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface MultiGearTowerFile {
  version: number;
  schema: string;              // "multi_gear_tower@1"
  levels: MultiGearTowerLevelRow[];
  superchargeLevels?: MultiGearTowerSuperchargeRow[];
}

/* ---------- Fire Spitter ---------- */
export interface FireSpitterLevelRow {
  level: number;
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface FireSpitterSuperchargeRow {
  level: number;
  damagePerSecond: number;
  damagePerShot?: number;
  hitpoints: number;
  buildCostGold: number;
  buildTime: DurationString;
  expGained: number;
  thRequired: number;
}

export interface FireSpitterFile {
  version: number;
  schema: string;                // "fire_spitter@1"
  levels: FireSpitterLevelRow[];
  superchargeLevels?: FireSpitterSuperchargeRow[];
}

/* ---------- Trap: Bomb ---------- */
export interface TrapBombLevelRow {
  level: number;                 // 1..13
  damage: number;
  buildCostGold: number | null;  // cost can exist even if time/XP are N/A
  buildTime: DurationString | null; // null for instant / N/A
  expGained: number | null;      // null when N/A
  thRequired: number;
}

export interface TrapBombFile {
  version: number;
  schema: string;                // "bomb@1"
  levels: TrapBombLevelRow[];
}

/* ---------- Trap: Spring ---------- */
export interface TrapSpringLevelRow {
  level: number;                    // 1..12
  springCapacity: number;           // how much weight it can fling
  damage: number;                   // some levels deal damage (0 at L1)
  buildCostGold: number | null;     // may exist even if time/XP are N/A
  buildTime: DurationString | null; // null for instant / N/A
  expGained: number | null;         // null when N/A
  thRequired: number;
}

export interface TrapSpringFile {
  version: number;
  schema: string;                   // "spring_trap@1"
  levels: TrapSpringLevelRow[];
}

/* ---------- Trap: Giant Bomb ---------- */
export interface TrapGiantBombLevelRow {
  level: number;                      // 1..11
  damage: number;
  damageRadiusTiles: number;          // 3 | 3.5 | 4
  buildCostGold: number | null;       // may exist even if time/XP are N/A
  buildTime: DurationString | null;   // null for instant / N/A
  expGained: number | null;           // null when N/A
  thRequired: number;
}

export interface TrapGiantBombFile {
  version: number;
  schema: string;                      // "giant_bomb@1"
  levels: TrapGiantBombLevelRow[];
}

/* ---------- Trap: Air Bomb ---------- */
export interface TrapAirBombLevelRow {
  level: number;                    // 1..12
  damage: number;
  buildCostGold: number | null;     // may exist even if time/XP are N/A
  buildTime: DurationString | null; // null for instant / N/A
  expGained: number | null;         // null when N/A
  thRequired: number;
}

export interface TrapAirBombFile {
  version: number;
  schema: string;                   // "air_bomb@1"
  levels: TrapAirBombLevelRow[];
}

/* ---------- Trap: Seeking Air Mine ---------- */
export interface TrapSeekingAirMineLevelRow {
  level: number;                    // 1..7
  damage: number;
  buildCostGold: number | null;     // may exist even if time/XP are N/A
  buildTime: DurationString | null; // null for instant / N/A
  expGained: number | null;         // null when N/A
  thRequired: number;
}

export interface TrapSeekingAirMineFile {
  version: number;
  schema: string;                   // "seeking_air_mine@1"
  levels: TrapSeekingAirMineLevelRow[];
}

/* ---------- Trap: Skeleton Trap ---------- */
export interface TrapSkeletonTrapLevelRow {
  level: number;                    // 1..4
  spawnedUnits: number;             // number of skeletons spawned
  buildCostGold: number | null;     // may exist even if time/XP are N/A
  buildTime: DurationString | null; // null for instant / N/A
  expGained: number | null;         // null when N/A
  thRequired: number;
}

export interface TrapSkeletonTrapFile {
  version: number;
  schema: string;                   // "skeleton_trap@1"
  levels: TrapSkeletonTrapLevelRow[];
}

/* ---------- Trap: Tornado Trap ---------- */
export interface TrapTornadoTrapLevelRow {
  level: number;                    // 1..3
  durationSeconds: number;          // e.g., 5 | 6 | 7
  totalDamage: number;              // cumulative damage over full duration
  buildCostGold: number | null;     // may exist even if time/XP are N/A
  buildTime: DurationString | null; // null for instant / N/A
  expGained: number | null;         // null when N/A
  thRequired: number;
}

export interface TrapTornadoTrapFile {
  version: number;
  schema: string;                   // "tornado_trap@1"
  levels: TrapTornadoTrapLevelRow[];
}

/* ---------- Trap: Giga Bomb ---------- */
export interface TrapGigaBombLevelRow {
  level: number;                    // 1..3
  damage: number;
  buildCostGold: number | null;     // may exist even if time/XP are N/A
  buildTime: DurationString | null; // null for instant / N/A
  expGained: number | null;         // null when N/A
  thRequired: number;
}

export interface TrapGigaBombFile {
  version: number;
  schema: string;                   // "giga_bomb@1"
  levels: TrapGigaBombLevelRow[];
}

// ---- Accounts domain types ----
export type Upgrade = {
  id: string;
  name: string;
  endsAtIso?: string;
};

export type Account = {
  id: string;
  label: string;
  level: number | undefined;
  activeUpgrade?: Upgrade | null;
  notes?: string;
  // (optional props we’ll use later for KPIs)
  buildersCount?: number;
  inWar?: boolean;
};

export type SortMode = 'created' | 'alpha';