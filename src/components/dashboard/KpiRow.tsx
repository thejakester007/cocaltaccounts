import React from "react";
import { formatMsShort } from "@/lib/duration";

export type BuildersBucket = { builders: number; accounts: number };

export type NextCompletion = {
  accountName: string;
  thLevel: number;
  label: string;        // e.g., "Barracks"
  remainingMs: number;  // ms until done
};

type KpiRowProps = {
  totalAccounts: number;

  // Builders-per-account distribution
  buildersDist: BuildersBucket[];

  // War participation
  warParticipants: number;
  warTotal: number;
  warTitle?: string; // default "In war right now"

  // Builder activity (active upgrades across THs)
  activeThWithUpgrades: number;
  totalThCount: number;
  activityTitle?: string; // default "Builder activity"

  // Next finishing upgrade (optional)
  nextCompletion?: NextCompletion;

  className?: string;
};

const KpiRow: React.FC<KpiRowProps> = ({
  totalAccounts,
  buildersDist,
  warParticipants,
  warTotal,
  warTitle = "In war right now",
  activeThWithUpgrades,
  totalThCount,
  activityTitle = "Builder activity",
  nextCompletion,
  className,
}) => {
  const idle = Math.max(0, totalThCount - activeThWithUpgrades);
  
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <KpiCard title="Total accounts" value={totalAccounts} />

      {/* Convert BuildersBucket[] → readable string BEFORE passing to KpiCard */}
      <KpiCard
        title="Builders per account"
        value={buildersDist.length ? formatBuildersDist(buildersDist) : "—"}
      />

      <KpiCard title={warTitle} value={`${warParticipants} / ${warTotal}`} />

      <KpiCard
        title={activityTitle}
        value={`${activeThWithUpgrades} / ${totalThCount} active${totalThCount ? ` (${idle} idle)` : ""}`}
      />

      <KpiCard
        title="Next completion"
        value={
          nextCompletion
            ? `TH ${nextCompletion.thLevel} – ${nextCompletion.accountName} (${nextCompletion.label} – ${formatMsShort(nextCompletion.remainingMs)} left)`
            : "—"
        }
      />
    </div>
  );
};

const KpiCard = ({ title, value }: { title: string; value: number | string }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-1 text-[13px] opacity-85">{title}</div>
      <div className="text-3xl font-bold leading-none">{value}</div>
    </div>
  );
};

const formatBuildersDist = (buckets: BuildersBucket[]) => {
  const s = [...buckets].sort((a, b) => b.builders - a.builders || b.accounts - a.accounts);
  return s.map(b => `${b.accounts}×${b.builders}`).join(", ");
}

export default KpiRow;