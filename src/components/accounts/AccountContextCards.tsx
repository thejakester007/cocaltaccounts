import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, KV } from "./AccountHelpers";

import type { Account, TownHallRow } from "@/data/types";

import { formatMsShort } from "@/lib/duration";
import { Tag } from "./AccountHelpers";

import BuildersPicker from "@/components/accounts/BuildersPicker";

interface AccountContextCardProps {
  account: Account | undefined;
  nextTownHallDetails: TownHallRow | null | undefined;
  durationMs: number;
  onPlanUpgrade?: () => void;
  children?: React.ReactNode;
};


const AccountContextCards = ({
  account,
  nextTownHallDetails,
  durationMs,
  onPlanUpgrade,
  children,
}: AccountContextCardProps) => {
  const [editableNote, setEditableNote] = useState<Boolean>(false);

  const handleUpdateNote = () => {
    console.log('note handler')
  };

  return (
    <>
      <Card title="Account Context">
        <div className="grid gap-2 text-sm">
          <BuildersPicker
            value={account?.buildersCount ?? 2}
            sixthUnlocked={!!account?.sixthBuilderUnlocked}
            onChange={(n) => {
              // persist both fields in your store
              // dispatch(updateAccount({ id: account.id, buildersCount: n }))
            }}
            onChangeSixth={(u) => {
              // dispatch(updateAccount({ id: account.id, sixthBuilderUnlocked: u }))
            }}
          />
          <div>
            <div className="py-1">
              {/* Top row: label + current status */}
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="text-white/60">War Status</div>
                <div className={`text-sm ${account?.inWar ? "text-green-300" : "text-red-300"}`}>
                  {account?.inWar ? "In War" : "Not In War"}
                </div>
              </div>

              {/* Control: checkbox below the status */}
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={account?.inWar}
                  onChange={() => console.log('todo update inwar status')}
                  className="h-3.5 w-3.5 accent-white/80"
                />
                Currently participating in war
              </label>
            </div>
          </div>
          <div className="py-1">
            <div className="mb-1 text-white/60">Notes: </div>

            {editableNote ? (
              <div>
                <textarea
                  value={account?.notes ?? ""}
                  onChange={handleUpdateNote}
                  placeholder={account?.notes}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80 placeholder:text-white/30"
                />
                <button
                  onClick={() => console.log('on save TODO')}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10">
                  Save
                </button>
                <button
                  onClick={() => setEditableNote(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm text-white/70" onClick={() => setEditableNote(true)}>
                {account?.notes && account?.notes.trim().length ? account?.notes : (
                  <span className="text-white/40">{account?.notes}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Upgrade to next TH */}
      <Card title={`Upgrade to TH${nextTownHallDetails?.th}`}>
        <div className="grid gap-2 text-sm">
          <KV
            label="Time to upgrade"
            value={formatMsShort(durationMs || 0)}
          />
          <KV
            label="Cost (Gold)"
            value={nextTownHallDetails?.buildCostGold?.toLocaleString() ?? "—"}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
            disabled={!nextTownHallDetails}
            onClick={onPlanUpgrade}
          >
            Plan Upgrade
          </button>
          <span className="text-xs text-white/50">Requires 1 free builder</span>
        </div>
      </Card>

      {/* Unlocks (placeholder by default; slot in real tags later) */}
      <Card title={`Unlocks at TH${nextTownHallDetails?.th}`}>
        {children ? (
          children
        ) : (
          <div className="flex flex-col gap-2 items-start">
            <Tag>+1 Trap Slot</Tag>
            <Tag>Higher Army Camp Lvl</Tag>
            <Tag>New Defense Tier</Tag>
          </div>
        )}
      </Card>
    </>
  );
};

export default AccountContextCards;