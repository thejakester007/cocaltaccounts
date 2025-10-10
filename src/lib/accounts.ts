import type { Account } from '@/data/types';

// LocalStorage key for accounts persistence
export const STORAGE_KEY = 'COCALT_ACCOUNTS_V1';

// Simple id generator
export const uid = () => Math.random().toString(36).slice(2, 10);

// Sort options for the <Select />
export const SORT_OPTIONS = [
  { id: 'created', label: 'Recent first' },
  { id: 'alpha', label: 'A → Z' },
] as const;

// Helper: coerce unknown JSON into an Account (used by Import JSON)
export function coerceAccount(x: any): Account | null {
  if (!x || typeof x !== 'object') return null;
  if (!x.label || typeof x.label !== 'string') return null;

  const makeId = () => uid();

  const a: Account = {
    id: typeof x.id === 'string' ? x.id : makeId(),
    label: x.label,
    level: typeof x.level === 'number' ? x.level : undefined,
    notes: typeof x.notes === 'string' && x.notes.trim() ? x.notes : undefined,
    activeUpgrade: x.activeUpgrade
      ? {
        id: typeof x.activeUpgrade?.id === 'string' ? x.activeUpgrade.id : makeId(),
        name: String(x.activeUpgrade?.name ?? 'Unnamed Upgrade'),
        endsAtIso: x.activeUpgrade?.endsAtIso ? String(x.activeUpgrade.endsAtIso) : undefined,
      }
      : null,
  };

  return a;
}
