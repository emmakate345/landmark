'use client';

import { useState, useEffect } from 'react';
import { getDailyLandmark } from '@/data/landmarks';
import { Landmark, GameState } from '@/types/landmark';
import GameBoard from '@/components/GameBoard';
import styles from './page.module.css';

export default function Home() {
  const [landmark, setLandmark] = useState<Landmark | null>(null);
  const [gameState, setGameState] = useState<GameState>({
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
  });

  useEffect(() => {
    try {
      const dailyLandmark = getDailyLandmark();
      setLandmark(dailyLandmark);
      setGameState(prev => ({ ...prev, currentLandmark: dailyLandmark }));
    } catch (error) {
      console.error('Error loading landmark:', error);
    }
  }, []);

  if (!landmark) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🏰 landmark</h1>
        <p className={styles.subtitle}>Guess the landmark, its country, and its city!</p>
      </header>
      <GameBoard landmark={landmark} gameState={gameState} setGameState={setGameState} />
    </div>
  );
}
