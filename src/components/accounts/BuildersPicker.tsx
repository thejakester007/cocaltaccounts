"use client";

import React from "react";

export default function BuildersPicker({
  value,
  sixthUnlocked,
  onChange,
  onChangeSixth,
  min = 1,
}: {
  value: number;                         // current builders count (1..5 or 6)
  sixthUnlocked: boolean;                // OTTO / 6th builder unlocked
  onChange?: (n: number) => void;        // when count changes
  onChangeSixth?: (unlocked: boolean) => void; // when checkbox toggles
  min?: number;                          // default 1
}) {
  const [local, setLocal] = React.useState<number>(value ?? min);
  const [unlocked, setUnlocked] = React.useState<boolean>(!!sixthUnlocked);

  // keep in sync with parent props
  React.useEffect(() => setLocal(value ?? min), [value, min]);
  React.useEffect(() => setUnlocked(!!sixthUnlocked), [sixthUnlocked]);

  const max = unlocked ? 6 : 5;
  const clamp = (n: number) => Math.min(Math.max(n, min), max);

  // ensure count respects current cap
  React.useEffect(() => {
    if (local > max) {
      const next = clamp(local);
      setLocal(next);
      onChange?.(next);
    }
  }, [max]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 py-1">
        <div className="text-white/60 pt-1">Builders</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
            aria-label="Decrease builders"
            onClick={() => {
              const v = clamp(local - 1);
              setLocal(v);
              onChange?.(v);
            }}
          >
            −
          </button>

          <input
            type="number"
            min={min}
            max={max}
            value={local}
            onChange={(e) => {
              const n = clamp(Number(e.target.value) || min);
              setLocal(n);
              onChange?.(n);
            }}
            className="w-16 rounded-md border border-white/10 bg-transparent px-2 py-1 text-white/80 text-right"
            aria-label="Builders count"
            title={`Builders (${min}-${max}${unlocked ? "" : ", 6th requires unlock"})`}
          />

          <button
            type="button"
            className="rounded-md border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
            aria-label="Increase builders"
            onClick={() => {
              const v = clamp(local + 1);
              setLocal(v);
              onChange?.(v);
            }}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 py-1">
        <div></div>
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input
            type="checkbox"
            checked={unlocked}
            onChange={(e) => {
              const u = e.target.checked;
              setUnlocked(u);
              onChangeSixth?.(u);
              // if turning off and count was 6, clamp to 5
              if (!u && local > 5) {
                setLocal(5);
                onChange?.(5);
              }
            }}
            className="h-3.5 w-3.5 accent-white/80"
          />
          6th builder unlocked
        </label>
      </div>
    </div>
  );
}
