'use client';

import { useState, useRef, useEffect } from 'react';
import { getGameHistory, getCurrentStreak } from '@/lib/gameHistory';
import styles from './StatsButton.module.css';

export default function StatsButton() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(() => getGameHistory());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) setHistory(getGameHistory());
  }, [open]);

  const total = history.length;
  const streak = getCurrentStreak();
  const overallWins = history.filter(g => g.landmarkGuessed && g.countryGuessed && g.cityGuessed).length;
  const landmarkWins = history.filter(g => g.landmarkGuessed).length;
  const countryWins = history.filter(g => g.countryGuessed).length;
  const cityWins = history.filter(g => g.cityGuessed).length;

  const pct = (n: number) => (total === 0 ? '—' : `${Math.round((n / total) * 100)}%`);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Stats"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="statsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7eb8a3" />
              <stop offset="100%" stopColor="#6ba3b8" />
            </linearGradient>
          </defs>
          <rect x="4" y="14" width="4" height="6" rx="1" fill="url(#statsGrad)" />
          <rect x="10" y="10" width="4" height="10" rx="1" fill="url(#statsGrad)" />
          <rect x="16" y="6" width="4" height="14" rx="1" fill="url(#statsGrad)" />
        </svg>
      </button>
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Overall win %</span>
            <span className={styles.statValue}>{pct(overallWins)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Landmark win %</span>
            <span className={styles.statValue}>{pct(landmarkWins)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Country win %</span>
            <span className={styles.statValue}>{pct(countryWins)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>City win %</span>
            <span className={styles.statValue}>{pct(cityWins)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Current streak</span>
            <span className={styles.statValue}>{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
          {total > 0 && (
            <div className={styles.gamesPlayed}>{total} game{total !== 1 ? 's' : ''} played</div>
          )}
        </div>
      )}
    </div>
  );
}
