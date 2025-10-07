// src/components/dashboard/AccountsPanel.tsx

import React from "react";

export type AccountRow = {
  id: string;
  name: string;
  level: number;            // Town Hall level, e.g., 16
  buildersCount?: number;   // optional, manual input
  activeUpgrades?: number;  // optional, derived
  nextCompletionISO?: string | null; // optional, nearest endsAt
  isActive?: boolean;       // optional; defaults to true
};

type AccountsPanelProps = {
  accounts?: AccountRow[];        // already sorted/filtered by caller
  emptyTitle?: string;
  emptySubtitle?: string;
  rightSlot?: React.ReactNode;    // e.g., an “Add” button
  className?: string;
};

const AccountsPanel: React.FC<AccountsPanelProps> = ({
  accounts = [],
  emptyTitle = "No accounts yet",
  emptySubtitle = "Connect this panel to your Redux accounts slice to render your roster.",
  rightSlot,
  className,
}) => {
  if (!accounts.length) {
    return (
      <div className={className}>
        <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
      </div>
    );
  }

  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      {/* header row */}
      <div className="grid grid-cols-12 gap-2 px-2 py-1 text-xs opacity-70">
        <div className="col-span-5">Account</div>
        <div className="col-span-2">Builders</div>
        <div className="col-span-2">Active upgrades</div>
        <div className="col-span-3">Next completion</div>
      </div>

      {/* rows */}
      {accounts.map((a) => {
        const active = a.isActive ?? true;
        return (
          <div
            key={a.id}
            className={`grid grid-cols-12 items-center gap-2 rounded-md border border-white/10 px-2 py-2 text-sm ${active ? "opacity-95" : "opacity-60"
              }`}
          >
            <div className="col-span-5 flex items-center gap-2">
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px]">{`TH ${a.level}`}</span>
              <span className="truncate" title={a.name}>{a.name}</span>
              {!active && <span className="opacity-70">• archived</span>}
            </div>

            <div className="col-span-2">
              <span title="Builders">🛠 {a.buildersCount ?? 0}</span>
            </div>

            <div className="col-span-2">
              <span title="Active upgrades">⬆️ {a.activeUpgrades ?? 0}</span>
            </div>

            <div className="col-span-3">
              <span title={a.nextCompletionISO ?? ""}>
                ⏱ {a.nextCompletionISO ? new Date(a.nextCompletionISO).toLocaleTimeString() : "—"}
              </span>
            </div>
          </div>
        );
      })}

      {/* optional right-side slot (e.g., + Add) */}
      {rightSlot ? <div className="mt-2 flex justify-end">{rightSlot}</div> : null}
    </div>
  );
};

/* --- tiny presentational helper --- */

const EmptyState: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="py-3 opacity-90">
    <div className="mb-1">{title}</div>
    {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
  </div>
);

export default AccountsPanel;
