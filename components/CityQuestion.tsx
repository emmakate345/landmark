'use client';

import { useState } from 'react';
import { Landmark } from '@/types/landmark';
import { cities } from '@/data/cities';
import { normalizeForMatch } from '@/lib/stringUtils';
import GuessInput from './GuessInput';
import styles from './CityQuestion.module.css';

interface CityQuestionProps {
  landmark: Landmark;
  onGuess: (city: string) => void;
  onReveal?: () => void;
  lastGuess: string | null;
  guessesUsed: number;
  maxGuesses: number;
  countryFound: boolean;
}

export default function CityQuestion({
  landmark,
  onGuess,
  onReveal,
  lastGuess,
  guessesUsed,
  maxGuesses,
  countryFound,
}: CityQuestionProps) {
  const [cityInput, setCityInput] = useState('');

  const guessesLeft = Math.max(0, maxGuesses - guessesUsed);
  const suffix =
    guessesLeft === 1 ? '1 guess left' : `${guessesLeft} guesses left`;

  return (
    <div className={styles.container}>
      <div className={styles.bonusCard}>
        <h3 className={styles.bonusTitle}>Round 3: City</h3>
        <p className={styles.bonusText}>
          {countryFound ? (
            <>
              Great job! You found the country. Now, can you guess which city in{' '}
              <strong>{landmark.country}</strong> <strong>{landmark.name}</strong> is located in?
            </>
          ) : (
            <>
              You didn&apos;t find the country, but can you guess which city in{' '}
              <strong>{landmark.country}</strong> <strong>{landmark.name}</strong> is located in?
            </>
          )}
        </p>
        <GuessInput
          value={cityInput}
          onChange={setCityInput}
          onSubmit={onGuess}
          placeholder="Guess the city..."
          suggestions={cities}
          onReveal={onReveal}
          buttonSuffix={suffix}
          accentInsensitive
        />
        {lastGuess && (
          <p className={styles.landmarkFeedback}>
            <span>
              {normalizeForMatch(lastGuess) === normalizeForMatch(landmark.city) ? '✓' : '✗'}
            </span>{' '}
            You guessed <strong>{lastGuess}</strong>. This was guess{' '}
            <strong>{guessesUsed}</strong> of <strong>{maxGuesses}</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
