// src/components/accounts/AccountHelpers.tsx
import { TH_WEAPON_BY_LEVEL } from "@/data/types";

import type { StructureAvailability } from "@/lib/categories";

export const Card = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section className="rounded-2xl border border-white/10 p-4">
      <div className="mb-6 text-lg font-semibold">{title}</div>
      {children}
    </section>
  );
};

export const KV = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) => {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <div className="text-white/60">{label}</div>
      <div className="text-right">
        <div className="text-white">{value}</div>
        {sub && <div className="text-xs text-white/40">{sub}</div>}
      </div>
    </div>
  );
};

export const Tag = ({ children, title }: { children: React.ReactNode; title?: string }) => {
  return (
    <span
      title={title}
      className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/80"
    >
      {children}
    </span>
  );
};

export const renderGroup = (title: string, entries?: { label: string; count: number }[]) => {
  if (!entries || entries.length === 0) return null;
  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase text-white/50">{title}</div>
      <div className="flex flex-wrap gap-2">
        {entries.map((e) => (
          <Tag key={e.label}>
            {e.label} × {e.count}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export const renderAvailability = (title: string, items?: StructureAvailability[]) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase text-white/50">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <Tag
            key={s.id}
            title={s.available ? `Max level at TH: ${s.maxLevelAtTH}` : "Not available at this TH"}
          >
            {s.label}{" "}
            {s.available && (
              <span className="text-white/70">Lv.{s.maxLevelAtTH}</span>
            )}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export const clamp = (n: number, min: number, max: number) => {
  return Math.min(Math.max(n, min), max);
};

export const formatDuration = (ms: number) => {
  ms = Math.max(0, ms);
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};

export const toReadable = (v?: number | null) => {
  if (v === null || v === undefined) return "—";
  return formatCompactNumber(v);
};

export const formatCompactNumber = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
};

export const getTHWeapon = (level: number) => TH_WEAPON_BY_LEVEL[level];