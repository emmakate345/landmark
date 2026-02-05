import { getTodayDateStrEastern } from './dateUtils';

export interface GameResult {
  date: string;
  landmarkId: string;
  landmarkGuessed: boolean;
  countryGuessed: boolean;
  cityGuessed: boolean;
}

const HISTORY_KEY = 'landmark-game-history';

export function getGameHistory(): GameResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function getPrevDateStr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Current streak: consecutive days (from today backward) with full wins. Only day-of games count (past puzzles are never recorded). */
export function getCurrentStreak(): number {
  if (typeof window === 'undefined') return 0;
  const history = getGameHistory();
  const byDate = new Map(history.map(g => [g.date, g]));

  let streak = 0;
  let current = getTodayDateStrEastern();

  while (true) {
    const entry = byDate.get(current);
    if (!entry || !(entry.landmarkGuessed && entry.countryGuessed && entry.cityGuessed)) break;
    streak++;
    current = getPrevDateStr(current);
  }

  return streak;
}

export function recordGameResult(
  landmarkId: string,
  landmarkGuessed: boolean,
  countryGuessed: boolean,
  cityGuessed: boolean
) {
  if (typeof window === 'undefined') return;
  try {
    const date = getTodayDateStrEastern();
    const history = getGameHistory();
    const withoutToday = history.filter(g => g.date !== date);
    const updated = [
      ...withoutToday,
      { date, landmarkId, landmarkGuessed, countryGuessed, cityGuessed },
    ];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}
