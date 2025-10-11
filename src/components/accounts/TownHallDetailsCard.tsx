"use client"

import React from "react";
import Image from "next/image";
import { KV, Card, getTHWeapon } from "./AccountHelpers";
import { getTownHallImageSrc } from "@/lib/images";

import type { TownHallRow, Account } from "@/data/types";
import type { TownHallCategories, StructureAvailability } from "@/lib/categories";

export type ResourceSnapshot = {
  gold?: number | null;
  elixir?: number | null;
  darkElixir?: number | null;
};

export interface TownHallDetailsCardProps {
  account: Account,
  townHallDetails: TownHallRow;
  army: number;
  resources: number;
  defenses: number;
  traps: number;
};

const TownHallDetailsCard: React.FC<TownHallDetailsCardProps> = ({
  account,
  townHallDetails,
  army,
  resources,
  defenses,
  traps
}) => {
  const sumCategory = (arr?: StructureAvailability[]) =>
    (arr ?? []).reduce((acc, it) => acc + (it.available ? (it.countMaxAtTH ?? 0) : 0), 0);

  const weapon = townHallDetails ? getTHWeapon(townHallDetails?.th) : null;

  const nonEmpty = [army, resources, defenses, traps]
    .filter(v => v > 0).length;

  const gridColsClass = nonEmpty === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4";

  // Meta Stats
  const IDLE_BUILDERS = 1;
  const IN_PROGRESS_BUILDERS = 2;
  const UPGRADABLE_STRUCTURES = 7;
  const EARLIEST_COMPLETION = "Army Camp — 4h 02m";

  return (
    <Card title={`Town Hall Details for ${account?.label}`}>
      <div className="grid xs:grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 md:gap-4 lg:gap-6">
        <div className="sm:col-span-2">
          <Image
            src={getTownHallImageSrc(account?.level)}
            alt={`Town Hall ${account ?? "—"}`}
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
        <div className="h-px w-full bg-white/10 sm:hidden my-4 md:my-0" />
        <div className="sm:col-span-4 lg:col-span-5">
          <KV label="Hitpoints" value={townHallDetails?.hitpoints ?? "—"} />
          {account && account.level && account.level > 11 && (
            <KV label="Town Hall Weapon" value={weapon?.name ?? "—"} />
          )}
          <KV
            label="Max Buildings (including Builder’s Huts and Townhall)"
            value={townHallDetails?.maxBuildings}
          />
          <KV label="Max Army Buildings" value={army} />
          <KV label="Max Resource Buildings" value={resources} />
          <KV label="Max Defense Buildings" value={defenses} />
          <KV label="Max Traps" value={townHallDetails?.maxTraps ?? "—"} />
        </div>
        <div className="h-px w-full bg-white/10 sm:col-span-6 lg:hidden my-4 md:my-0" />
        <div className="sm:col-span-6 lg:col-span-5">
          <KV label="Idle builders" value={IDLE_BUILDERS} />
          <KV label="In-progress builders" value={IN_PROGRESS_BUILDERS} />
          <KV label="Upgradable structures" value={UPGRADABLE_STRUCTURES} />
          <KV label="Earliest completion" value={EARLIEST_COMPLETION} />
        </div>
      </div>
    </Card>
  );
};

export default TownHallDetailsCard;