const KEYS = {
  favorites: "cpo:favorites",
  recent: "cpo:recent",
  copyCounts: "cpo:copyCounts",
} as const;

const MAX_RECENT = 5;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFavorites(): string[] {
  return readJSON<string[]>(KEYS.favorites, []);
}

export function isFavorite(promptId: string): boolean {
  return getFavorites().includes(promptId);
}

export function toggleFavorite(promptId: string): boolean {
  const favorites = getFavorites();
  const idx = favorites.indexOf(promptId);
  let nowFavorite: boolean;
  if (idx === -1) {
    favorites.push(promptId);
    nowFavorite = true;
  } else {
    favorites.splice(idx, 1);
    nowFavorite = false;
  }
  writeJSON(KEYS.favorites, favorites);
  return nowFavorite;
}

export function getRecent(): string[] {
  return readJSON<string[]>(KEYS.recent, []);
}

export function addRecent(promptId: string): string[] {
  const recent = getRecent().filter((id) => id !== promptId);
  recent.unshift(promptId);
  const trimmed = recent.slice(0, MAX_RECENT);
  writeJSON(KEYS.recent, trimmed);
  return trimmed;
}

export function getCopyCounts(): Record<string, number> {
  return readJSON<Record<string, number>>(KEYS.copyCounts, {});
}

export function getCopyCount(promptId: string): number {
  return getCopyCounts()[promptId] ?? 0;
}

export function incrementCopyCount(promptId: string): number {
  const counts = getCopyCounts();
  counts[promptId] = (counts[promptId] ?? 0) + 1;
  writeJSON(KEYS.copyCounts, counts);
  return counts[promptId];
}
