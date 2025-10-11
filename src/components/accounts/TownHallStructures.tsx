import React from "react";
import clsx from "clsx"

import type { Account, TownHallRow } from "@/data/types";
import type { TownHallCategories } from "@/lib/categories";

import StructureEditor from "./StructureEditor";
import { Card } from "./AccountHelpers";

export interface TownHallStructuresProps {
  account: Account,
  townHallDetails: TownHallRow;
  categories: TownHallCategories;
  army: number;
  resources: number;
  defenses: number;
  traps: number;
  nonEmpty: number;
};

const TownHallStructures: React.FC<TownHallStructuresProps> = ({
  account,
  townHallDetails,
  categories,
  army,
  traps,
  resources,
  defenses,
  nonEmpty
}) => {
  const gridColsClass = nonEmpty === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4";

  return (
    <Card title={`Structure Availbility for TH${account?.level}`}>
      <div className={clsx("grid grid-cols-1 gap-4", gridColsClass)}>
        {army > 0 && (
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
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {traps > 0 && (
          <div className="min-w-0">
            <div>
              <div className="mt-6 text-md font-bold uppercase tracking-wide text-white/60">
                Traps
              </div>
            </div>
            <div className="grid gap-4">
              <div className="mt-4 grid gap-4">
                {/* Editors for all Army structures */}
                {categories.traps.map((s) => ((s.countMaxAtTH ?? 0) > 0) && (
                  <StructureEditor
                    key={s.id}
                    structureId={s.id}
                    structureName={s.label}
                    maxLevelAtTH={s.maxLevelAtTH}
                    countMaxAtTH={s.countMaxAtTH}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {resources > 0 && (
          <div className="min-w-0">
            <div>
              <div className="mt-6 text-md font-bold uppercase tracking-wide text-white/60">
                Resource Structures
              </div>
            </div>
            <div className="grid gap-4">
              <div className="mt-4 grid gap-4">
                {/* Editors for all Army structures */}
                {categories.resources.map((s) => ((s.countMaxAtTH ?? 0) > 0) && (
                  <StructureEditor
                    key={s.id}
                    structureId={s.id}
                    structureName={s.label}
                    maxLevelAtTH={s.maxLevelAtTH}
                    countMaxAtTH={s.countMaxAtTH}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {defenses > 0 && (
          <div className="min-w-0">
            <div>
              <div className="mt-6 text-md font-bold uppercase tracking-wide text-white/60">
                Defensive Structures
              </div>
            </div>
            <div className="grid gap-4">
              <div className="mt-4 grid gap-4">
                {/* Editors for all Army structures */}
                {categories.defenses.map((s) => ((s.countMaxAtTH ?? 0) > 0) && (
                  <StructureEditor
                    key={s.id}
                    structureId={s.id}
                    structureName={s.label}
                    maxLevelAtTH={s.maxLevelAtTH}
                    countMaxAtTH={s.countMaxAtTH}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TownHallStructures;