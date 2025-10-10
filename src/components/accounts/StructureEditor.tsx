// src/components/accounts/ArmyCampEditor.tsx
"use client";

import React from "react";
import { formatDuration, clamp } from "./AccountHelpers";

export interface StructureEditorProps {
  structureId: string;
  structureName: string;
  /** Highest upgrade level allowed at this TH; if null => not available at this TH */
  maxLevelAtTH: number | null;
  /** How many of this structure are allowed at this TH; if null => will default to 1 when available */
  countMaxAtTH: number | null;

  /** Optional initial state (for persistence later) */
  initialBuiltCount?: number;     // e.g., 2
  initialLevels?: number[];       // e.g., [5,4]

  /** Compute duration (ms) to upgrade FROM current level to next level */
  getUpgradeDuration?: (args: { structureId: string; fromLevel: number }) => number;

  /** Compute duration (ms) to BUILD a new instance (to Level 1) */
  getBuildDuration?: (args: { structureId: string }) => number;

  /** Optionally gate starting work (e.g., no free builders) */
  canStartWork?: () => boolean;

  /** Notify parent when user changes anything */
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
  // Not available at this TH — don't render anything
  if (maxLevelAtTH == null) return null;

  // Default to 1 when available but no explicit count is defined (e.g., Barracks, Lab, etc.)
  const maxCount = countMaxAtTH ?? 1;
  const isSingleton = maxCount === 1;

  // Guard (it can be 0 for some edge cases, but usually >=1 here)
  if (maxCount <= 0) return null;

  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [builtCount, setBuiltCount] = React.useState<number>(() =>
    isSingleton ? 1 : Math.min(maxCount, initialBuiltCount ?? 1)
  );

  const [levels, setLevels] = React.useState<number[]>(() => {
    const len = Math.max(Math.min(builtCount, maxCount), 0) || 1;
    const base = Array.from({ length: len }, () => 1);
    if (initialLevels?.length) {
      for (let i = 0; i < Math.min(base.length, initialLevels.length); i++) {
        base[i] = clamp(initialLevels[i], 1, maxLevelAtTH);
      }
    }
    return base.slice(0, Math.max(builtCount, 0));
  });

  /** upgrading or building per instance (building is just “upgrading” from Lv 0 → Lv 1 visually) */
  const [upgrading, setUpgrading] = React.useState<UpgState[]>(
    () => Array.from({ length: isSingleton ? 1 : builtCount }, () => null)
  );

  /** live remaining ms (per instance) for display */
  const [remaining, setRemaining] = React.useState<number[]>(
    () => Array.from({ length: isSingleton ? 1 : builtCount }, () => 0)
  );

  // Keep arrays in sync with builtCount / maxLevel changes
  React.useEffect(() => {
    setLevels((prev) => {
      const next = prev.slice(0, builtCount);
      while (next.length < builtCount) next.push(1);
      for (let i = 0; i < next.length; i++) next[i] = clamp(next[i], 1, maxLevelAtTH!);
      return next;
    });

    setUpgrading((prev) => {
      const next = prev.slice(0, builtCount);
      while (next.length < builtCount) next.push(null);
      return next;
    });

    setRemaining((prev) => {
      const next = prev.slice(0, builtCount);
      while (next.length < builtCount) next.push(0);
      return next;
    });
  }, [builtCount, maxLevelAtTH]);

  // Ticker for countdowns
  React.useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setRemaining((prev) => {
        const next = prev.slice();
        for (let i = 0; i < upgrading.length; i++) {
          const upg = upgrading[i];
          next[i] = upg ? Math.max(0, upg.endAt - now) : 0;
        }
        return next;
      });

      // Autocomplete when done (both upgrades & builds)
      setUpgrading((prev) => {
        const copy = prev.slice();
        let changed = false;

        for (let i = 0; i < copy.length; i++) {
          const upg = copy[i];
          if (upg && upg.endAt <= now) {
            // finish
            setLevels((lvPrev) => {
              const lvNext = lvPrev.slice();
              // if this was a normal upgrade, +1; if it was a build, we already set Lv 1 at start
              const capped = Math.min(lvNext[i] + 1, maxLevelAtTH ?? lvNext[i]);
              // detect “build” by checking if we marked the slot with 0; we’re not using 0 in UI, so skip.
              // Simpler: always +1 if < max; when building we started at Lv 1 but did not increment here.
              // To guarantee correct behavior, only increment if a flag is set; but we can infer:
              // If countdown started via startUpgrade(), we increment; via startBuild(), we do NOT.
              // We'll attach a symbol on window to track upgrade slots—too hacky.
              // Instead, store a tiny tag in upgrading array (extend type).
              return lvNext;
            });
            copy[i] = null;
            changed = true;
          }
        }
        return changed ? copy : prev;
      });
    };

    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [upgrading, maxLevelAtTH]);

  // Bubble up changes (optional)
  React.useEffect(() => {
    onChange?.({ id: structureId, builtCount, levels });
  }, [structureId, builtCount, levels, onChange]);

  // Upgrade specific instance to next level
  const startUpgrade = (idx: number) => {
    if (upgrading[idx]) return;
    const current = levels[idx];
    if (current >= (maxLevelAtTH ?? current)) return;
    if (canStartWork && !canStartWork()) return;

    const ms =
      getUpgradeDuration?.({ structureId, fromLevel: current }) ??
      60_000; // fallback: 60s

    setUpgrading((prev) => {
      const next = prev.slice();
      next[idx] = { endAt: Date.now() + ms };
      return next;
    });

    // When the timer completes, we increment. We can increment immediately on completion in the ticker,
    // but to ensure we +1 (since above ticker no longer increments), we add a timeout as a safety.
    window.setTimeout(() => {
      setLevels((lvPrev) => {
        const copy = lvPrev.slice();
        if (copy[idx] < (maxLevelAtTH ?? copy[idx])) copy[idx] = copy[idx] + 1;
        return copy;
      });
    }, ms + 10);
  };

  // Build a new instance (Lv 1) and run a build countdown
  const startBuild = () => {
    if (isSingleton) return;
    if (builtCount >= maxCount) return;
    if (canStartWork && !canStartWork()) return;

    const ms =
      getBuildDuration?.({ structureId }) ??
      60_000; // fallback: 60s

    const newIndex = builtCount; // slot to append
    setBuiltCount((c) => c + 1);

    // Ensure arrays grow then mark upgrading for the new slot
    setLevels((prev) => {
      const next = prev.slice();
      next.push(1); // building finishes at Level 1
      return next;
    });

    // Wait a microtask to ensure arrays are expanded, then set upgrading for that index
    queueMicrotask(() => {
      setUpgrading((prev) => {
        const next = prev.slice();
        next[newIndex] = { endAt: Date.now() + ms };
        return next;
      });
    });
  };

  const cancelUpgradeOrBuild = (idx: number) => {
    setUpgrading((prev) => {
      const next = prev.slice();
      next[idx] = null;
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="mb-2">
        {/* label on its own line */}
        <div className="text-xs font-semibold uppercase text-white/60 pb-2">{structureName}</div>

        {/* pills + actions */}
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
                onClick={startBuild}
                disabled={builtCount >= maxCount || (canStartWork && !canStartWork())}
                className={`rounded-full px-3 py-1 text-xs font-medium border
                  ${builtCount >= maxCount
                    ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30"
                    : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"}`}
                title={builtCount >= maxCount ? "All structures built for this TH" : "Build a new structure (Lv 1)"}
              >
                Build
              </button>
            )}

            <button
              type="button"
              onClick={() => setEditMode((v) => !v)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 hover:bg-white/[0.08]"
              title="Set the number of structures and their levels"
            >
              {editMode ? "Done" : "Set"}
            </button>
          </div>
        </div>
      </div>

      {/* Count row (only when editing & multi-instance) */}
      {!isSingleton && (
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-white/70">{structureName}</span>
          {editMode ? (
            <input
              type="number"
              min={0}
              max={maxCount}
              value={builtCount}
              onChange={(e) => {
                const v = clamp(Number(e.target.value) || 0, 0, maxCount);
                setBuiltCount(v);
              }}
              className="w-12 rounded-md border border-white/10 bg-transparent px-2 py-1 text-white/80"
              aria-label={`${structureName} Count`}
              title={`How many ${structureName.toLowerCase()} you’ve built at this TH (max ${maxCount})`}
            />
          ) : builtCount}
          <span className="text-xs text-white/50">of {maxCount}</span>
        </div>
      )}

      {/* Level rows */}
      <div className="grid gap-2">
        {Array.from({ length: builtCount }).map((_, idx) => {
          const lv = levels[idx];
          const isMax = lv >= (maxLevelAtTH ?? lv);
          const upg = upgrading[idx];

          return (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2"
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="text-white/70">
                  {maxCount > 1 ? `${structureName} ${idx + 1} ` : ""}
                </span>

                <select
                  value={lv}
                  disabled={!!upg || !editMode}
                  onChange={(e) => {
                    const nextLv = clamp(Number(e.target.value) || 1, 1, maxLevelAtTH!);
                    setLevels((prev) => {
                      const copy = prev.slice();
                      copy[idx] = nextLv;
                      return copy;
                    });
                  }}
                  className={`ml-2 w-20 rounded-md border border-white/10 bg-transparent px-2 py-1 text-white/80 ${upg ? "opacity-60" : ""}`}
                  aria-label={`${structureName} ${idx + 1} Level`}
                  title={`Max level at this TH: ${maxLevelAtTH}`}
                >
                  {Array.from({ length: maxLevelAtTH! }, (_, i) => i + 1).map((lvOpt) => (
                    <option key={lvOpt} value={lvOpt} className="bg-[#0b0f14]">
                      Lv {lvOpt}
                    </option>
                  ))}
                </select>

                {upg && (
                  <span
                    className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-100"
                    title="Work in progress"
                  >
                    ⏳ {formatDuration(remaining[idx])}
                  </span>
                )}

                {!upg && isMax && <span className="text-xs text-emerald-400/80">Maxed</span>}
              </div>

              {/* Upgrade control (hidden when not editing to reduce clutter, but easy to show if you prefer) */}
              {editMode && (
                <div className="flex items-center gap-2">
                  {!upg ? (
                    <button
                      type="button"
                      disabled={isMax || (canStartWork && !canStartWork())}
                      onClick={() => startUpgrade(idx)}
                      className={`relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium
                        ${isMax
                          ? "cursor-not-allowed border border-white/10 bg-white/[0.03] text-white/30"
                          : "border border-sky-400/30 bg-gradient-to-r from-sky-600/30 via-cyan-500/20 to-blue-600/20 hover:from-sky-600/40 hover:to-blue-600/30 text-sky-100"}`}
                      title={isMax ? "Already at max level" : `Upgrade to Lv ${lv + 1}`}
                    >
                      {!isMax && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-300/80" aria-hidden />}
                      {isMax ? "Max" : `Upgrade → Lv ${lv + 1}`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cancelUpgradeOrBuild(idx)}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 hover:bg-white/10"
                      title="Cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {builtCount < maxCount && (
          <div className="text-xs text-white/50">
            Tip: You can build {maxCount - builtCount} more {structureName.toLowerCase()}
            {maxCount - builtCount === 1 ? "" : "s"} at this TH.
          </div>
        )}
      </div>
    </div>
  );
};

export default StructureEditor;