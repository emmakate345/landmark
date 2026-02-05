'use client';

import styles from './GuessHistory.module.css';

interface GuessHistoryProps {
  guesses: string[];
  correctCountry: string;
}

export default function GuessHistory({ guesses, correctCountry }: GuessHistoryProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Your Guesses:</h3>
      <div className={styles.guessList}>
        {guesses.map((guess, index) => {
          const isCorrect = guess.toLowerCase() === correctCountry.toLowerCase();
          const guessNumber = index + 1;
          return (
            <div
              key={index}
              className={styles.guessItem}
            >
              <span className={isCorrect ? styles.guessIconCorrect : styles.guessIconIncorrect}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <span>
                Guess {guessNumber}: {guess}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
