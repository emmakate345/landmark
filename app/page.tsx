'use client';

import { useState, useEffect } from 'react';
import { getDailyLandmark, getRandomPastLandmark, getAvailablePastPuzzleIds } from '@/data/landmarks';
import { getTodayDateStrEastern } from '@/lib/dateUtils';
import { Landmark, GameState } from '@/types/landmark';
import { recordGameResult } from '@/lib/gameHistory';
import GameBoard from '@/components/GameBoard';
import StatsButton from '@/components/StatsButton';
import styles from './page.module.css';

const STORAGE_KEY = 'landmark-game-state';


function loadSavedState(landmarkId: string): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { date, landmarkId: savedId, state } = JSON.parse(raw);
    if (date !== getTodayDateStrEastern() || savedId !== landmarkId) return null;
    return state;
  } catch {
    return null;
  }
}

function saveState(landmarkId: string, state: GameState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayDateStrEastern(),
      landmarkId,
      state,
    }));
  } catch {
    // Ignore storage errors
  }
}

const initialGameState: GameState = {
  currentLandmark: null,
  guesses: [],
  hintUsed: false,
  countryGuessed: false,
  countryRevealed: false,
  cityGuess: null,
  cityGuessed: false,
  gameComplete: false,
  currentRound: 'landmark',
  landmarkGuess: null,
  landmarkGuessed: false,
  landmarkGuesses: 0,
  landmarkGuessHistory: [],
  landmarkRevealed: false,
  cityGuesses: 0,
  cityGuessHistory: [],
  showPreviousRound: false,
};

export default function Home() {
  const [landmark, setLandmark] = useState<Landmark | null>(null);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isPastPuzzle, setIsPastPuzzle] = useState(false);
  const [playedPastPuzzleIds, setPlayedPastPuzzleIds] = useState<Set<string>>(new Set());
  const [showAllPlayedMessage, setShowAllPlayedMessage] = useState(false);

  useEffect(() => {
    if (!isPastPuzzle) {
      try {
        const dailyLandmark = getDailyLandmark();
        setLandmark(dailyLandmark);

        const saved = loadSavedState(dailyLandmark.id);
        if (saved) {
          setGameState({ ...saved, currentLandmark: dailyLandmark });
        } else {
          setGameState(prev => ({ ...prev, currentLandmark: dailyLandmark }));
        }
      } catch (error) {
        console.error('Error loading landmark:', error);
      }
    }
  }, [isPastPuzzle]);

  useEffect(() => {
    if (landmark && gameState.currentLandmark && !isPastPuzzle) {
      saveState(landmark.id, gameState);
      if (gameState.gameComplete) {
        recordGameResult(
          landmark.id,
          gameState.landmarkGuessed,
          gameState.countryGuessed,
          gameState.cityGuessed
        );
      }
    }
  }, [landmark, gameState, isPastPuzzle]);

  const handlePlayPastPuzzle = () => {
    const availableIds = getAvailablePastPuzzleIds();
    if (availableIds.length === 0) {
      setShowAllPlayedMessage(true);
      return;
    }

    const played = new Set(playedPastPuzzleIds);
    // Always exclude current landmark when viewing a past puzzle (safety for state timing)
    if (isPastPuzzle && landmark) {
      played.add(landmark.id);
    }
    if (played.size >= availableIds.length) {
      setShowAllPlayedMessage(true);
      return;
    }

    const pastLandmark = getRandomPastLandmark(played);
    if (!pastLandmark) {
      setShowAllPlayedMessage(true);
      return;
    }

    setPlayedPastPuzzleIds(prev => new Set(prev).add(pastLandmark.id));
    setLandmark(pastLandmark);
    setGameState({
      ...initialGameState,
      currentLandmark: pastLandmark,
    });
    setIsPastPuzzle(true);
  };

  const handleBackToToday = () => {
    setShowAllPlayedMessage(false);
    const dailyLandmark = getDailyLandmark();
    const saved = loadSavedState(dailyLandmark.id);
    setLandmark(dailyLandmark);
    setGameState(
      saved
        ? { ...saved, currentLandmark: dailyLandmark }
        : { ...initialGameState, currentLandmark: dailyLandmark }
    );
    setIsPastPuzzle(false);
  };

  if (!landmark) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (showAllPlayedMessage) {
    return (
      <div className={styles.container}>
        <div className={styles.allPlayedMessage}>
          <h2 className={styles.allPlayedTitle}>You&apos;ve played all available past puzzles!</h2>
          <p className={styles.allPlayedText}>
            Come back tomorrow for more. A new puzzle is added to the archive each day.
          </p>
          <button
            type="button"
            className={styles.allPlayedButton}
            onClick={handleBackToToday}
          >
            ← Back to today
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>🏰 landmark</h1>
          <div className={styles.statsButton}>
            <StatsButton />
          </div>
        </div>
        <p className={styles.subtitle}>Guess the landmark, its country, and its city!</p>
      </header>
      <GameBoard
        landmark={landmark}
        gameState={gameState}
        setGameState={setGameState}
        onPlayPastPuzzle={handlePlayPastPuzzle}
        onBackToToday={handleBackToToday}
        isPastPuzzle={isPastPuzzle}
      />
    </div>
  );
}
