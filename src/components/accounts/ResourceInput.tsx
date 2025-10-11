import React from "react";

export interface ResourceInputProps {
  label: string;
  value: number;
  onChange: (n: number) => void
}

const ResourceInput: React.FC<ResourceInputProps> = ({
  label,
  value,
  onChange
}) => {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1">
      <span className="text-xs text-white/60 w-12">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            const v = Number(value ?? 0);                // coerce
            const safe = Number.isFinite(v) ? v : 0;     // guard NaN
            onChange(Math.max(0, safe - 10000));
          }}
          className="h-6 w-6 rounded bg-white/10"
        >-</button>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          className="w-28 bg-transparent text-sm tabular-nums outline-none"
        />
        <button onClick={() => onChange((Number(value) || 0) + 10000)} className="h-6 w-6 rounded bg-white/10">+</button>
      </div>
    </label>
  );
}

export default ResourceInput;