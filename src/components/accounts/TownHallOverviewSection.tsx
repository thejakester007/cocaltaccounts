"use client"

import React from "react";
import TownHallDetailsCard from "./TownHallDetailsCard";
import TownHallStructures from "./TownHallStructures";

import type { Account, TownHallRow } from "@/data/types";
import type { StructureAvailability } from "@/lib/categories";

import { useTHCategories } from "@/lib/hooks/useTHCategories";
import { getTHWeapon, Card } from "./AccountHelpers";

interface TownHallOverviewSectionProps {
  account: Account;
  townHallDetails: TownHallRow | null;
  builderHutsAtTH?: number; // NEW: pass how many builder huts exist at this TH (default 0)
  children?: React.ReactNode;
};

const TownHallOverviewSection = ({
  account,
  townHallDetails,
  builderHutsAtTH
}: TownHallOverviewSectionProps) => {
  if (!townHallDetails) return null;

  const nextLevel = (account?.level ?? 0) + 1;

  // useMemo only for the derived input
  const thForCategories = React.useMemo<number | null>(
    () => townHallDetails?.th ?? account?.level ?? null,
    [townHallDetails?.th, account?.level]
  );

  const categories = useTHCategories(thForCategories);

  if (!categories) {
    return null;
  }

  const sumCategory = (arr?: StructureAvailability[]) =>
    (arr ?? []).reduce((acc, it) => acc + (it.available ? (it.countMaxAtTH ?? 0) : 0), 0);

  const army = (categories?.army ?? []).reduce((s, i) => s + (i.available ? (i.countMaxAtTH ?? 0) : 0), 0);
  const resources = (categories?.resources ?? []).reduce((s, i) => s + (i.available ? (i.countMaxAtTH ?? 0) : 0), 0);
  const defenses = (categories?.defenses ?? []).reduce((s, i) => s + (i.available ? (i.countMaxAtTH ?? 0) : 0), 0);
  const traps = Math.max(0, townHallDetails?.maxTraps ?? 0);

  const nonEmpty = [army, resources, defenses, traps]
    .filter(v => v > 0).length;

  return (
    <section className="space-y-2 lg:col-span-3 md:col-span-2">
      <TownHallDetailsCard
        account={account}
        townHallDetails={townHallDetails}
        army={army}
        resources={resources}
        defenses={defenses}
        traps={traps}
      />
      <TownHallStructures
        account={account}
        townHallDetails={townHallDetails}
        categories={categories}
        army={army}
        resources={resources}
        defenses={defenses}
        traps={traps}
        nonEmpty={nonEmpty}
      />
    </section>
  )
};

export default TownHallOverviewSection;
