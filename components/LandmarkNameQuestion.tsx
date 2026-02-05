'use client';

import { useState } from 'react';
import { Landmark } from '@/types/landmark';
import { landmarkNames } from '@/data/landmarks';
import GuessInput from './GuessInput';
import styles from './CityQuestion.module.css';

interface LandmarkNameQuestionProps {
  landmark: Landmark;
  onGuess: (name: string) => void;
  onReveal: () => void;
  lastGuess: string | null;
  guessesUsed: number;
  maxGuesses: number;
}

export default function LandmarkNameQuestion({
  landmark,
  onGuess,
  onReveal,
  lastGuess,
  guessesUsed,
  maxGuesses,
}: LandmarkNameQuestionProps) {
  const [nameInput, setNameInput] = useState('');

  const guessesLeft = Math.max(0, maxGuesses - guessesUsed);
  const suffix =
    guessesLeft === 1 ? '1 guess left' : `${guessesLeft} guesses left`;

  return (
    <div className={styles.container}>
      <div className={styles.bonusCard}>
        <h3 className={styles.bonusTitle}>Round 1: Landmark</h3>
        <p className={styles.bonusText}>
          Look at the photo and try to guess the name of this landmark.
        </p>
        <GuessInput
          value={nameInput}
          onChange={setNameInput}
          onSubmit={onGuess}
          placeholder="Guess the landmark name..."
          onReveal={onReveal}
          buttonSuffix={suffix}
          suggestions={landmarkNames}
        />
        {lastGuess && (
          <p className={styles.landmarkFeedback}>
            <span>
              {lastGuess.trim().toLowerCase() === landmark.name.trim().toLowerCase() ? '✓' : '✗'}
            </span>{' '}
            You guessed <strong>{lastGuess}</strong>. This was guess{' '}
            <strong>{guessesUsed}</strong> of <strong>{maxGuesses}</strong>.
          </p>
        )}
      </div>
    </div>
  );
}

