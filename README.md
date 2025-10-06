# CoC Upgrade Tracker (Next.js)

*A minimal, local-first dashboard to track **Clash of Clans** alt accounts and see at a glance which upgrades have **finished** so you can start the next one.*

> **Status (Oct 6, 2025):** Shipping iteratively. Today the UI focuses on **Accounts** first; **Upgrades** and countdown groupings are coming next.

---

## ✨ What’s New

- **Data catalog** groundwork for upgrade timers:
  - **Defenses**: Cannon (JSON schema scaffold)
  - **Traps**: **Bomb**, **Skeleton Trap**, **Tornado Trap**, **Giga Bomb** (tables transcribed and normalized)
- **UI tweaks**
  - Sort control compacted & moved **before Name**
  - **Notes** hidden behind tooltip on name hover
  - Inline numeric editor extracted to `lib/helpers` (for reuse)
- **Housekeeping**
  - Project runs on **Windows** (no WSL required); README has Windows tips below

---

## 🚩 MVP Features

* **Accounts**: add/rename/archive.
* **Upgrades**: add by **finish time** or **duration**; optional notes + “planned next”.
* **Dashboard**:
  * **Finished** list (ready to act)
  * **Finishing soon** (≤ 6h)
  * **Accounts overview** with countdowns
* **Quick actions**: Mark complete • Nudge ±1h/±8h • Delete
* **Backup**: Export/Import as JSON
* **Storage**: Browser `localStorage` (no server)

> Scope is intentionally simple (not a Clash Ninja clone). Goal: **zero friction** signal for finished upgrades.

---

## 🧱 Tech Stack

* **Next.js** (App Router, TypeScript) + **Tailwind CSS**
* **Zustand** (state), **date-fns** (time)
* Optional: **sonner** (toasts), **lucide-react** (icons)

---

## 🚀 Quick Start (existing repo)

```bash
# install deps
npm install

# dev server
npm run dev
# ➜ http://localhost:3000
```

If scaffolding from scratch instead:

```bash
npx create-next-app@latest coc-upgrade-tracker   --typescript --eslint --tailwind --app --src-dir --import-alias @/*
cd coc-upgrade-tracker
npm i date-fns zustand sonner lucide-react
```

**Windows tips**
- If PowerShell blocks scripts: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
- If `npm` not found, install Node LTS from nodejs.org and reopen terminal/VS Code

---

## 📁 Suggested Structure

```
src/
  app/
    page.tsx              # Dashboard
    accounts/page.tsx     # Manage accounts
    upgrades/new/page.tsx # New upgrade form
  components/
    AccountCard.tsx
    UpgradeCard.tsx
    forms/
      AddAccountForm.tsx
      AddUpgradeForm.tsx
  lib/
    types.ts              # Account/Upgrade types
    store.ts              # Zustand store
    time.ts               # end-time/duration helpers (date-fns)
    persist.ts            # localStorage helpers
    helpers/
      InlineEditableNumber.tsx  # shared numeric input
  data/
    defenses/
      cannon.schema.json        # WIP schema
    traps/
      bomb.json                 # normalized levels
      skeleton-trap.json
      tornado-trap.json
      giga-bomb.json
```

---

## 🗃️ Data Model

```ts
export type Account = {
  id: string
  name: string
  note?: string
  isActive: boolean
}

export type Upgrade = {
  id: string
  accountId: string
  title: string
  note?: string
  startAt: string  // ISO
  endAt: string    // ISO
  plannedNext?: string
  done: boolean
}
```

---

## 📚 Data Catalog (WIP)

> Normalized per-level entries include: `level`, `costGold`, `buildTime`, `xp`, and item-specific fields like `damage`, `duration`, `spawnedUnits`, `thReq`.

- **Defenses**
  - `defenses/cannon.schema.json` — base schema for Cannon (fields: `dps`, `damagePerShot`, `hitpoints`, `costGold`, `buildTime`, `xp`, `thReq`)

- **Traps**
  - `traps/bomb.json` — fields: `level`, `damage`, `costGold`, `buildTime`, `xp`, `thReq`
  - `traps/skeleton-trap.json` — fields: `level`, `spawnedUnits`, `costGold`, `buildTime`, `xp`, `thReq`
  - `traps/tornado-trap.json` — fields: `durationSec`, `totalDamage`, `costGold`, `buildTime`, `xp`, `thReq`
  - `traps/giga-bomb.json` — fields: `level`, `damage`, `costGold`, `buildTime`, `xp`, `thReq`

---

## ✅ MVP Checklist & Progress

- [x] Create accounts
- [x] Persist via `localStorage`
- [x] Export / Import JSON
- [x] Compact sort UI & move before Name
- [x] Notes ➜ tooltip on hover
- [ ] Add upgrade (finish time or duration)
- [ ] Dashboard shows **Finished** & **Finishing soon**
- [ ] Mark complete / Nudge / Delete
- [ ] Countdown timers per upgrade on Accounts overview

---

## 🗺️ Roadmap (nice-to-haves)

* Notifications when an upgrade completes
* Tags & filters (Heroes/Defenses/Buildings/Spells)
* Search & sort
* PWA install
* iCal feed (subscribe from phone)
* Optional server persistence (Next Route Handlers + SQLite) for multi-device

---

## 🛠 Dev Notes

* Keep everything client-side first; introduce server only if/when you need sync.
* Normalize game data as flat level rows; derive countdowns from `buildTime` + chosen start/end fields.
* Prefer **single-file** helpers (per project style): constants in `ALL_CAPS`, variables lowerCamelCase.

---

## 🧾 Changelog

### 2025-10-06
- Added trap datasets: **bomb**, **skeleton-trap**, **tornado-trap**, **giga-bomb**
- Scaffolded **cannon** JSON schema
- Extracted **InlineEditableNumber** to `lib/helpers`
- Moved sort UI before Name; compressed control footprint
- Converted Notes to **tooltip on hover**
- Documented Windows setup tips

### 2025-10-05
- Initial accounts-only dashboard copy
- Local dev reliability fixes; moved workflow to Windows host

---

## 📜 License

MIT
