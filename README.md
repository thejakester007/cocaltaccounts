# CoC Upgrade Tracker (Next.js)

*A minimal, local-first dashboard to track **Clash of Clans** alt accounts and see at a glance which upgrades have **finished** so you can start the next one.*

---

## 🚩 MVP Features

* **Accounts**: add/rename/archive.
* **Upgrades**: add by **finish time** or **duration**; optional notes + "planned next".
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
npx create-next-app@latest coc-upgrade-tracker \
  --typescript --eslint --tailwind --app --src-dir --import-alias @/*
cd coc-upgrade-tracker
npm i date-fns zustand sonner lucide-react
```

---

## 📁 Suggested Structure

```
src/
  app/
    page.tsx            # Dashboard
    accounts/page.tsx   # Manage accounts
    upgrades/new/page.tsx
  components/
    AccountCard.tsx
    UpgradeCard.tsx
    forms/
      AddAccountForm.tsx
      AddUpgradeForm.tsx
  lib/
    types.ts            # Account/Upgrade types
    store.ts            # Zustand store
    time.ts             # helpers for end-time/duration
    persist.ts          # localStorage helpers
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

## ✅ MVP Checklist

* [ ] Create accounts
* [ ] Add upgrade (finish time or duration)
* [ ] Dashboard shows **Finished** & **Finishing soon**
* [ ] Mark complete / Nudge / Delete
* [ ] Persist via `localStorage`
* [ ] Export / Import JSON

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

* For speed in WSL, keep the repo under Linux home (`~/...`) and open via `\\wsl$` from Windows.
* Keep everything client‑side first; introduce server only if/when you need sync.

---

## 📜 License

MIT
