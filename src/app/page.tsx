import React from "react";
import SectionHeader from "@/components/common/SectionHeader";
import DueSoonPanel from "@/components/dashboard/DueSoonPanel";
import AccountsPanel from "@/components/dashboard/AccountsPanel";
import KpiRowContainer from "@/components/dashboard/KpiRowContainer";

const Page = () => {
  return (
    <div className="px-5 pb-10 pt-5 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <KpiRowContainer />

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <SectionHeader title="Upgrades finishing soon" actionHref="/accounts" actionText="Manage accounts →" />
        <DueSoonPanel />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <SectionHeader title="Accounts" actionHref="/accounts" actionText="View all" />
        <AccountsPanel />
      </section>
    </div>
  );
};

export default Page;