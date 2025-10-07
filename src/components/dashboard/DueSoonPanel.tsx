import React from "react";

export type DueSoonItem = {
  id: string;
  accountName: string;
  thLevel: number;            // e.g., 15
  label: string;              // e.g., "Archer Tower (NW)" or "Laboratory"
  kind?: string;              // optional: "Archer Tower", "Laboratory", ...
  endsAtISO: string;          // ISO string
  remainingMs: number;        // ms until done (<= horizon)
  totalMs: number;            // full duration ms
};

type DueSoonPanelProps = {
  items?: DueSoonItem[];      // already filtered/sorted by caller
  horizonHours?: number;      // shown in header text if you want
  onBellClick?: (id: string) => void; // optional callback for bell button
  className?: string;
};

const DueSoonPanel: React.FC<DueSoonPanelProps> = ({
  items = [],
  horizonHours,
  onBellClick,
  className,
}) => {
  if (!items.length) {
    return (
      <EmptyState
        title="No upgrades finishing soon"
        subtitle={`When an upgrade is within the next ${horizonHours ?? 6} hours, it will show here with a live countdown.`}
        className={className}
      />
    );
  }

  return (
    <div className={`grid gap-3 ${className ?? ""}`}>
      {items.map((it) => {
        const pct = safePct(1 - clamp01(it.remainingMs / Math.max(1, it.totalMs)));
        const endsAt = new Date(it.endsAtISO);
        return (
          <div key={it.id} className="flex items-center gap-3 rounded-lg border border-white/10 p-3">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] opacity-90">
                  {`TH ${it.thLevel}`}
                </span>
                <strong className="text-base" title={it.accountName}>
                  {it.accountName}
                </strong>
                <span className="opacity-70">•</span>
                <span className="opacity-90" title={it.kind}>
                  {it.label}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" aria-label="progress">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex justify-between text-xs opacity-80">
                <span>{it.remainingMs <= 0 ? "Ready" : `${formatRemaining(it.remainingMs)} left`}</span>
                <span title={endsAt.toLocaleString()}>finishes at {endsAt.toLocaleTimeString()}</span>
              </div>
            </div>

            {onBellClick && (
              <button
                onClick={() => onBellClick(it.id)}
                title="Notify me"
                className="rounded-md border border-white/20 px-2 py-1 text-base hover:bg-white/10"
              >
                🔔
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* --- tiny presentational helpers --- */

const EmptyState: React.FC<{ title: string; subtitle?: string; className?: string }> = ({
  title,
  subtitle,
  className,
}) => (
  <div className={`py-3 opacity-90 ${className ?? ""}`}>
    <div className="mb-1">{title}</div>
    {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
  </div>
);

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const safePct = (n: number) => Number.isFinite(n) ? +(n * 100).toFixed(2) : 0;

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Ready";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default DueSoonPanel;