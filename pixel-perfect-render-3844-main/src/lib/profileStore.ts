// Local-only MVP storage. Profiles are append-only versions (V1, V2...), never overwritten.
export type Version<T> = { version: number; createdAt: string; data: T };

function read<T>(key: string): Version<T>[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

export function getVersions<T>(key: string) {
  return read<T>(key);
}

export function addVersion<T>(key: string, data: T): Version<T> {
  const list = read<T>(key);
  const v = { version: list.length + 1, createdAt: new Date().toISOString(), data };
  localStorage.setItem(key, JSON.stringify([...list, v]));
  return v;
}

export const INNATE_KEY = "le.innate";
export const ACQUIRED_KEY = "le.acquired";
