//component/StorageHelper.tsx

"use client";
// ============================================================================
// TYPES
// ============================================================================

type StorageKey = string;

interface StatusUpdate {
  date: string;
  [key: string]: unknown;
}

interface StorageHelper {
  get: (key: StorageKey) => string | null;
  set: (key: StorageKey, value: string) => void;
  getArray: <T = unknown>(key: StorageKey, defaultValue?: T[]) => T[];
  setArray: <T = unknown>(key: StorageKey, value: T[]) => void;
}

// ============================================================================
// SHARED STORAGE UTILITIES
// ============================================================================

export const createStorageHelper = (prefix: string): StorageHelper => {
  const inMemoryStorage: Record<string, unknown> = {};

  return {
    get: (key) =>
      (inMemoryStorage[`${prefix}_${key}`] as string | undefined) ?? null,

    set: (key, value) => {
      inMemoryStorage[`${prefix}_${key}`] = value;
    },

    getArray: <T,>(key: string, defaultValue: T[] = []): T[] => {
      return (inMemoryStorage[`${prefix}_${key}`] as T[]) ?? defaultValue;
    },

    setArray: <T,>(key: string, value: T[]) => {
      inMemoryStorage[`${prefix}_${key}`] = value;
    },
  };
};

export const saveStatusUpdate = (
  storage: StorageHelper,
  update: Omit<StatusUpdate, "date">
): void => {
  const newUpdate: StatusUpdate = {
    ...update,
    date: new Date().toISOString(),
  };

  const current = storage.getArray<StatusUpdate>("statusUpdates");
  const updated = [newUpdate, ...current].slice(0, 50);

  storage.setArray("statusUpdates", updated);
};

export const getRecentUpdates = (storage: StorageHelper): StatusUpdate[] => {
  const updates = storage.getArray<StatusUpdate>("statusUpdates");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return updates.filter(
    (u) => new Date(u.date) >= sevenDaysAgo
  );
};

export const saveToHistory = (
  storage: StorageHelper,
  key: StorageKey,
  value: string
): void => {
  if (!value || !value.trim()) return;

  const current = storage.getArray<string>(key);

  if (!current.includes(value)) {
    const updated = [value, ...current].slice(0, 10);
    storage.setArray(key, updated);
  }
};
