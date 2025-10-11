// src/components/accounts/ArmyCampEditor.tsx
"use client";

import React from "react";

export interface StructureEditorProps {
  structureId: string;
  structureName: string;
  maxLevelAtTH: number | null;
  countMaxAtTH: number | null;
  initialBuiltCount?: number;
  initialLevels?: number[];
  getUpgradeDuration?: (args: { structureId: string; fromLevel: number }) => number;
  getBuildDuration?: (args: { structureId: string }) => number;
  canStartWork?: () => boolean;
  onChange?: (state: { id: string; builtCount: number; levels: number[] }) => void;
}

type UpgState = { endAt: number } | null;

const StructureEditor = ({
  structureId,
  structureName,
  maxLevelAtTH,
  countMaxAtTH,
  initialBuiltCount,
  initialLevels,
  getUpgradeDuration,
  getBuildDuration,
  canStartWork,
  onChange,
}: StructureEditorProps) => {
  if (maxLevelAtTH == null) return null;
  const maxCount = countMaxAtTH ?? 1;
  const isSingleton = maxCount === 1;

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="mb-2">
        <div className="text-xs font-semibold uppercase text-white/60 pb-2">{structureName}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
          <div
            className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2 py-0.5"
            title="Maximum level available at this Town Hall"
          >
            Max Lv {maxLevelAtTH ?? "—"}
          </div>

          {!isSingleton && typeof maxCount === "number" && (
            <div
              className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2 py-0.5"
              title="Maximum number of this structure at this Town Hall"
            >
              Max {maxCount} {maxCount > 1 ? "structures" : "structure"}
            </div>
          )}

          {/* Set + Build */}
          <div className="ml-auto flex items-center gap-2">
            {!isSingleton && (
              <button
                type="button"
                onClick={() => console.log('startBuild')}
                // disabled={builtCount >= maxCount || (canStartWork && !canStartWork())}
                // className={`rounded-full px-3 py-1 text-xs font-medium border
                //   ${builtCount >= maxCount
                //     ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30"
                //     : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"}`}
                // title={builtCount >= maxCount ? "All structures built for this TH" : "Build a new structure (Lv 1)"}
              >
                Build
              </button>
            )}

            {/* <button
              type="button"
              onClick={() => setEditMode((v) => !v)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 hover:bg-white/[0.08]"
              title="Set the number of structures and their levels"
            >
              {editMode ? "Done" : "Set"}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureEditor;