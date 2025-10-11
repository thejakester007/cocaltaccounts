import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, KV } from "./AccountHelpers";
import { setResources, setBuildersCount, setSixthBuilderUnlocked } from "@/store/accountStore";
import { formatMsShort } from "@/lib/duration";
import { Tag } from "./AccountHelpers";
import { getResourceCaps, clampToCaps, getDarkStorageLevel } from "@/lib/resources/capacity";

import BuildersPicker from "@/components/accounts/BuildersPicker";
import ResourceChip from "./ResourceChip";
import ResourceInput from "./ResourceInput";

import type { Account, TownHallRow, ResourceKind } from "@/data/types";

interface AccountContextCardProps {
  account: Account;
  nextTownHallDetails: TownHallRow;
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
  const dispatch = useDispatch();
  const [editableNote, setEditableNote] = useState<Boolean>(false);
  const [editResource, setEditResource] = useState<Boolean>(false);
  const [caps, setCaps] = useState<{ goldMax: number; elixirMax: number; darkMax: number }>({
    goldMax: 0, elixirMax: 0, darkMax: 0
  });

  const handleUpdateNote = () => {
    console.log('TODO: handleUpdateNote')
  };

  const handleUpdateResource = (key: ResourceKind, value: number) => {
    if (!account) return;
    const clamped = clampToCaps(value, key, caps);
    dispatch(setResources({ id: account.id, [key]: clamped }));
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const next = await getResourceCaps({
        th: account?.level,
        // pass real levels when you track them; until then, omit/empty arrays to use TH base only
        goldStorageLvls: [],
        elixirStorageLvls: [],
        darkStorageLvl: getDarkStorageLevel(account),
      });
      if (alive) setCaps(next);
    })();
    return () => { alive = false; };
  }, [account?.level]);

  return (
    <>
      <Card title="Account Context">
        <div className="grid gap-2 text-sm">
          <BuildersPicker
            value={Number(account.buildersCount ?? 2)}
            sixthUnlocked={!!account?.sixthBuilderUnlocked}
            onChange={(n) => {
              account && dispatch(setBuildersCount({ id: account.id, value: n }));
            }}
            onChangeSixth={(u) => {
              account && dispatch(setSixthBuilderUnlocked({ id: account.id, value: u }))
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
          {/* Resources row */}
          <div className="py-1">
            <div className="mb-1 flex items-center justify-between gap-3">
              <div className="text-white/60">Resources</div>
              {/* Optional: last sync */}
              {/* <div className="text-xs text-white/40">Updated 3h ago</div> */}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!editResource && (
                <React.Fragment>
                  <ResourceChip label="Gold" value={account?.gold ?? 0} />
                  <ResourceChip label="Elixir" value={account?.elixir ?? 0} />
                  <ResourceChip label="Dark" value={account?.darkElixir ?? 0} />
                  <button
                    onClick={() => setEditResource(true)}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs hover:bg-white/10"
                  >
                    Update Resources
                  </button>
                </React.Fragment>
              )}
            </div>
            {editResource && (
              <div className="flex flex-col gap-4">
                <ResourceInput label="Gold" value={account?.gold ?? 0} onChange={(n) => handleUpdateResource("gold", n)} />
                <ResourceInput label="Elixir" value={account?.elixir ?? 0} onChange={(n) => handleUpdateResource("elixir", n)} />
                <ResourceInput label="Dark" value={account?.darkElixir ?? 0} onChange={(n) => handleUpdateResource("dark_elixir", n)} />
                <div>
                  <button
                    onClick={() => setEditResource(false)}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs hover:bg-white/10"
                  >
                    Save
                  </button>
                </div>
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