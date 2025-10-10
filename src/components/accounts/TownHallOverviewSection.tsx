"use client"

import React from "react";
import { formatMsShort } from "@/lib/duration";
import { renderAvailability, Card, KV, Tag } from "@/components/accounts/AccountHelpers";
import { useTHCategories } from "@/lib/hooks/useTHCategories";

import type { TownHallRow } from "@/data/types";
import StructureEditor from "./StructureEditor";

interface TownHallOverviewSectionProps {
  accountLevel?: number;
  townHallDetails: TownHallRow | null | undefined;
  nextTownHallDetails: TownHallRow | null | undefined;
  durationMs: number;
  children?: React.ReactNode;
};

const TownHallOverviewSection = ({
  accountLevel,
  townHallDetails,
  nextTownHallDetails,
  durationMs,
  children,
}: TownHallOverviewSectionProps) => {
  const nextLevel = (accountLevel ?? 0) + 1;

  // useMemo only for the derived input
  const thForCategories = React.useMemo<number | null>(
    () => townHallDetails?.th ?? accountLevel ?? null,
    [townHallDetails?.th, accountLevel]
  );

  const categories = useTHCategories(thForCategories);

  return (
    <section className="space-y-2 lg:col-span-4">
      {/* Current TH */}
      <Card title={`Town Hall ${accountLevel ?? "—"}`}>
        <div className="grid gap-2 text-sm">
          <KV label="Hitpoints" value={townHallDetails?.hitpoints ?? "—"} />
          <KV label="Max Buildings" value={townHallDetails?.maxBuildings ?? "—"} />
          <KV label="Max Traps" value={townHallDetails?.maxTraps ?? "—"} />
        </div>
      </Card>
      <div className="grid gap-6 xl:gap-8 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-4">
        {categories && categories.army.length > 0 && (
          <div className="min-w-0">
            <div>
              <div className="mt-6 text-md font-bold uppercase tracking-wide text-white/60">
                Army Structures
              </div>
            </div>
            <div className="grid gap-4">
              <div className="mt-4 grid gap-4">
                {/* Editors for all Army structures */}
                {categories.army.map((s) => (
                  <StructureEditor
                    key={s.id}
                    structureId={s.id}
                    structureName={s.label}
                    maxLevelAtTH={s.maxLevelAtTH}
                    countMaxAtTH={s.countMaxAtTH}
                  // initialBuiltCount / initialLevels can be injected when you wire persistence
                  // onChange={(state) => dispatch(updateStructure({ accountId, ...state }))}
                  />
                ))}
              </div>
            </div>
          </div>
        )}


        {categories && categories.traps.length > 0 && (
          <div className="min-w-0">
            <div>
              <div className="mt-6 text-md font-bold uppercase tracking-wide text-white/60">
                Traps
              </div>
            </div>
            <div className="grid gap-4">
              <div className="mt-4 grid gap-4">
                {/* Editors for all Army structures */}
                {categories.traps.map((s) => (
                  <StructureEditor
                    key={s.id}
                    structureId={s.id}
                    structureName={s.label}
                    maxLevelAtTH={s.maxLevelAtTH}
                    countMaxAtTH={s.countMaxAtTH}
                  // initialBuiltCount / initialLevels can be injected when you wire persistence
                  // onChange={(state) => dispatch(updateStructure({ accountId, ...state }))}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {categories && categories.resources.length > 0 && (
          <div className="min-w-0">
            <div>
              <div className="mt-6 text-md font-bold uppercase tracking-wide text-white/60">
                Resource Structures
              </div>
            </div>
            <div className="grid gap-4">
              <div className="mt-4 grid gap-4">
                {/* Editors for all Army structures */}
                {categories.resources.map((s) => (
                  <StructureEditor
                    key={s.id}
                    structureId={s.id}
                    structureName={s.label}
                    maxLevelAtTH={s.maxLevelAtTH}
                    countMaxAtTH={s.countMaxAtTH}
                  // initialBuiltCount / initialLevels can be injected when you wire persistence
                  // onChange={(state) => dispatch(updateStructure({ accountId, ...state }))}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {categories && categories.defenses.length > 0 && (
          <div className="min-w-0">
            <div>
              <div className="mt-6 text-md font-bold uppercase tracking-wide text-white/60">
                Defensive Structures
              </div>
            </div>
            <div className="grid gap-4">
              <div className="mt-4 grid gap-4">
                {/* Editors for all Army structures */}
                {categories.defenses.map((s) => (
                  <StructureEditor
                    key={s.id}
                    structureId={s.id}
                    structureName={s.label}
                    maxLevelAtTH={s.maxLevelAtTH}
                    countMaxAtTH={s.countMaxAtTH}
                  // initialBuiltCount / initialLevels can be injected when you wire persistence
                  // onChange={(state) => dispatch(updateStructure({ accountId, ...state }))}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section >
  )
};

export default TownHallOverviewSection;
