'use client';

import { useState } from 'react';
import { Landmark, GameState } from '@/types/landmark';
import { countries } from '@/data/countries';
import LandmarkDisplay from './LandmarkDisplay';
import GuessInput from './GuessInput';
import LandmarkNameQuestion from './LandmarkNameQuestion';
import CityQuestion from './CityQuestion';
import GuessHistory from './GuessHistory';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  landmark: Landmark;
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

export default function GameBoard({ landmark, gameState, setGameState }: GameBoardProps) {
  const [countryInput, setCountryInput] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [backSteps, setBackSteps] = useState(0);

  const roundOrder: Array<'landmark' | 'country' | 'city'> = ['landmark', 'country', 'city'];
  const currentIndex = roundOrder.indexOf(gameState.currentRound);
  const viewIndex = Math.max(0, currentIndex - backSteps);
  const roundToShow: 'landmark' | 'country' | 'city' = roundOrder[viewIndex];

  const countryFinished =
    gameState.countryGuessed ||
    gameState.countryRevealed ||
    gameState.guesses.length >= 5;

  const handleLandmarkGuess = (guess: string) => {
    const normalize = (s: string) =>
      s.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

    setGameState(prev => {
      if (prev.gameComplete || prev.currentRound !== 'landmark') return prev;

      const isCorrect = normalize(guess) === normalize(landmark.name);
      const newLandmarkGuesses = prev.landmarkGuesses + 1;
      const newHistory = [...prev.landmarkGuessHistory, guess];

      if (isCorrect) {
        return {
          ...prev,
          landmarkGuess: guess,
          landmarkGuessed: true,
          landmarkGuesses: newLandmarkGuesses,
          landmarkGuessHistory: newHistory,
        };
      }

      // Still in landmark round (even if out of guesses, UI will handle transition)
      return {
        ...prev,
        landmarkGuess: guess,
        landmarkGuessed: false,
        landmarkGuesses: newLandmarkGuesses,
        landmarkGuessHistory: newHistory,
      };
    });
  };

  const handleLandmarkReveal = () => {
    setGameState(prev => {
      if (prev.gameComplete || prev.currentRound !== 'landmark') return prev;
      return {
        ...prev,
        landmarkRevealed: true,
      };
    });
  };

  const handleGoToCountryRound = () => {
    setBackSteps(0);
    setGameState(prev => {
      if (
        prev.gameComplete ||
        prev.currentRound !== 'landmark' ||
        (!prev.landmarkGuessed && !prev.landmarkRevealed && prev.landmarkGuesses < 5)
      ) {
        return prev;
      }
      return {
        ...prev,
        currentRound: 'country',
        showPreviousRound: false,
      };
    });
  };

  const handleCountryGuess = (guess: string) => {
    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedCountry = landmark.country.toLowerCase();

    setGameState(prev => {
      if (prev.gameComplete || prev.currentRound !== 'country') return prev;

      const isCorrect = normalizedGuess === normalizedCountry;
      const newGuesses = [...prev.guesses, guess];

      // Stay in the country round; UI + Next button handle progression.
      return {
        ...prev,
        guesses: newGuesses,
        countryGuessed: isCorrect,
      };
    });

    setCountryInput('');
  };

  const handleCountryReveal = () => {
    setGameState(prev => {
      if (prev.gameComplete || prev.currentRound !== 'country') return prev;
      return {
        ...prev,
        countryRevealed: true,
        showPreviousRound: false,
      };
    });
  };

  const handleGoToCityRound = () => {
    setBackSteps(0);
    setGameState(prev => {
      const maxAttemptsReached = prev.guesses.length >= 5;
      const countryFinishedState =
        prev.countryGuessed || prev.countryRevealed || maxAttemptsReached;

      if (prev.gameComplete || prev.currentRound !== 'country' || !countryFinishedState) {
        return prev;
      }
      return {
        ...prev,
        currentRound: 'city',
        showPreviousRound: false,
      };
    });
  };

  const handleCityGuess = (cityGuess: string) => {
    const normalize = (s: string) =>
      s.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    const isCorrect = normalize(cityGuess) === normalize(landmark.city);
    
    setGameState(prev => {
      if (prev.gameComplete || prev.currentRound !== 'city') return prev;

      const attempts = prev.cityGuesses + 1;
      const newHistory = [...prev.cityGuessHistory, cityGuess];

      if (isCorrect) {
        return {
          ...prev,
          cityGuess: cityGuess,
          cityGuessed: true,
          cityGuesses: attempts,
          cityGuessHistory: newHistory,
          gameComplete: true,
        };
      }

      if (attempts >= 5) {
        // Out of guesses: end game and reveal via summary
        return {
          ...prev,
          cityGuess: cityGuess,
          cityGuessed: false,
          cityGuesses: attempts,
          cityGuessHistory: newHistory,
          gameComplete: true,
        };
      }

      // Still in city round, allow more guesses
      return {
        ...prev,
        cityGuess: cityGuess,
        cityGuessed: false,
        cityGuesses: attempts,
        cityGuessHistory: newHistory,
      };
    });
  };

  const handleCityReveal = () => {
    setGameState(prev => {
      if (prev.gameComplete || prev.currentRound !== 'city') return prev;
      return {
        ...prev,
        cityGuess: null,
        cityGuessed: false,
        gameComplete: true,
      };
    });
  };

  const handleViewLastRoundClick = () => {
    const maxSteps = gameState.gameComplete ? 2 : currentIndex;
    if (maxSteps <= 0) return;
    setBackSteps(prev => Math.min(maxSteps, prev + 1));
  };

  const handleNextRoundClick = () => {
    // If we are currently viewing a previous round, step forward in history.
    if (backSteps > 0) {
      setBackSteps(prev => Math.max(0, prev - 1));
      return;
    }

    // From the live country round, Next should advance to the city round when finished.
    if (gameState.currentRound === 'country' && countryFinished) {
      handleGoToCityRound();
    }
  };

  const handleShareResults = async () => {
    const maxPerRound = 5;
    const landmarkLine = `Landmark: ${
      gameState.landmarkGuessed ? gameState.landmarkGuesses : 'X'
    }/${maxPerRound} ${gameState.landmarkGuessed ? '✅' : '❌'}`;

    const countryAttempts = Math.min(gameState.guesses.length, maxPerRound);
    const countryLine = `Country: ${
      gameState.countryGuessed ? countryAttempts : 'X'
    }/${maxPerRound} ${gameState.countryGuessed ? '✅' : '❌'}`;

    const cityLine = `City: ${
      gameState.cityGuessed ? gameState.cityGuesses : 'X'
    }/${maxPerRound} ${gameState.cityGuessed ? '✅' : '❌'}`;

    const totalGuesses =
      gameState.landmarkGuesses + gameState.guesses.length + gameState.cityGuesses;

    const today = new Date();
    const dateStr = today.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const shareText = [
      `landmark puzzle #${landmark.id} – ${dateStr}`,
      '',
      landmarkLine,
      countryLine,
      cityLine,
      '',
      `Total guesses: ${totalGuesses}`,
    ].join('\n');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className={styles.gameBoard}>
      <div className={styles.landmarkSection}>
        <LandmarkDisplay landmark={landmark} />
      </div>

      <div className={styles.gameInfo}>
        <div className={styles.stats}>
          {gameState.countryGuessed && (
            <div className={styles.stat}>
              <span className={styles.statLabel}>Status:</span>
              <span className={styles.statValueSuccess}>✓ Country Found!</span>
            </div>
          )}
        </div>

        {roundToShow === 'landmark' && !(gameState.gameComplete && viewIndex === 2) && (
          <>
            {(!gameState.landmarkGuessed && gameState.landmarkGuesses < 5 && !gameState.landmarkRevealed && !gameState.gameComplete) ? (
              <LandmarkNameQuestion
                landmark={landmark}
                onGuess={handleLandmarkGuess}
                onReveal={handleLandmarkReveal}
                lastGuess={gameState.landmarkGuess}
                guessesUsed={gameState.landmarkGuesses}
                maxGuesses={5}
              />
            ) : (
              <div className={styles.landmarkResult}>
                <p className={styles.landmarkResultTitle}>
                  {gameState.landmarkGuessed ? (
                    <>
                      You correctly guessed the landmark in{' '}
                      <strong>{gameState.landmarkGuesses}</strong>{' '}
                      {gameState.landmarkGuesses === 1 ? 'guess' : 'guesses'}!
                    </>
                  ) : gameState.landmarkRevealed ? (
                    <>
                      You revealed the answer. The correct answer is:
                    </>
                  ) : (
                    <>
                      Out of guesses. The correct answer is:
                    </>
                  )}
                </p>
                <p className={styles.landmarkResultName}>
                  <strong>{landmark.name}</strong>
                </p>
              </div>
            )}
            {gameState.landmarkGuessHistory.length > 0 && (
              <div className={styles.landmarkGuessHistory}>
                {gameState.landmarkGuessHistory.map((g, idx) => {
                  const isLast = idx === gameState.landmarkGuessHistory.length - 1;
                  const isCorrect = gameState.landmarkGuessed && isLast;
                  const guessNumber = idx + 1;
                  return (
                    <div key={idx} className={styles.landmarkGuessItem}>
                      <span
                        className={
                          isCorrect
                            ? styles.landmarkGuessIconCorrect
                            : styles.landmarkGuessIconIncorrect
                        }
                      >
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span>
                        Guess {guessNumber}: {g}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {(gameState.landmarkGuessed ||
              gameState.landmarkGuesses >= 5 ||
              gameState.landmarkRevealed) && (
              <div className={styles.nextRoundContainer}>
                {gameState.gameComplete && viewIndex < 2 && (
                  <button
                    type="button"
                    className={styles.nextRoundButton}
                    onClick={handleNextRoundClick}
                  >
                    Next round →
                  </button>
                )}
                {!gameState.gameComplete && (
                  <button
                    type="button"
                    className={styles.nextRoundButton}
                    onClick={handleGoToCountryRound}
                  >
                    Next round
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {roundToShow === 'country' && !(gameState.gameComplete && viewIndex === 2) && (
          <>
            {!gameState.countryGuessed &&
            !gameState.countryRevealed &&
            gameState.guesses.length < 5 ? (
              <div className={styles.countryCard}>
                <h3 className={styles.countryTitle}>Round 2: Country</h3>
                <p className={styles.countryText}>
                  Can you guess which country <strong>{landmark.name}</strong> is located in?
                </p>
                <GuessInput
                  value={countryInput}
                  onChange={setCountryInput}
                  onSubmit={handleCountryGuess}
                  placeholder="Guess the country..."
                  disabled={false}
                  suggestions={countries}
                  onReveal={handleCountryReveal}
                  buttonSuffix={
                    (() => {
                      const used = Math.min(gameState.guesses.length, 5);
                      const left = Math.max(0, 5 - used);
                      return left === 1 ? '1 guess left' : `${left} guesses left`;
                    })()
                  }
                />
              </div>
            ) : (
              <div className={styles.landmarkResult}>
                <p className={styles.landmarkResultTitle}>
                  {gameState.countryGuessed ? (
                    <>
                      You correctly guessed the country in{' '}
                      <strong>{Math.min(gameState.guesses.length, 5)}</strong>{' '}
                      {Math.min(gameState.guesses.length, 5) === 1 ? 'guess' : 'guesses'}!
                    </>
                  ) : gameState.countryRevealed ? (
                    <>You revealed the answer. The correct country is:</>
                  ) : (
                    <>Out of guesses. The correct country is:</>
                  )}
                </p>
                <p className={styles.landmarkResultName}>
                  <strong>{landmark.country}</strong>
                </p>
              </div>
            )}
          </>
        )}

        {gameState.guesses.length > 0 && roundToShow === 'country' && (
          <GuessHistory guesses={gameState.guesses} correctCountry={landmark.country} />
        )}

        {roundToShow === 'country' && !(gameState.gameComplete && viewIndex === 2) && (
          <div className={styles.nextRoundContainer}>
            {viewIndex > 0 && (
              <button
                type="button"
                className={styles.nextRoundButton}
                onClick={handleViewLastRoundClick}
              >
                ← View last round
              </button>
            )}
            {(gameState.gameComplete || countryFinished || backSteps > 0) && (
              <button
                type="button"
                className={styles.nextRoundButton}
                onClick={handleNextRoundClick}
              >
                Next round →
              </button>
            )}
          </div>
        )}

        {roundToShow === 'city' && !(gameState.gameComplete && viewIndex === 2) && (
          <>
            <CityQuestion
              landmark={landmark}
              onGuess={handleCityGuess}
              onReveal={handleCityReveal}
              lastGuess={gameState.cityGuess}
              guessesUsed={gameState.cityGuesses}
              maxGuesses={5}
              countryFound={gameState.countryGuessed}
            />
            {gameState.cityGuessHistory.length > 0 && (
              <div className={styles.landmarkGuessHistory}>
                {gameState.cityGuessHistory.map((g, idx) => {
                  const isLast = idx === gameState.cityGuessHistory.length - 1;
                  const isCorrect = gameState.cityGuessed && isLast && gameState.gameComplete;
                  const guessNumber = idx + 1;
                  return (
                    <div key={idx} className={styles.landmarkGuessItem}>
                      <span
                        className={
                          isCorrect
                            ? styles.landmarkGuessIconCorrect
                            : styles.landmarkGuessIconIncorrect
                        }
                      >
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span>
                        Guess {guessNumber}: {g}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!gameState.gameComplete && gameState.currentRound !== 'landmark' && (
          <div className={styles.nextRoundContainer}>
            {viewIndex > 0 && (
              <button
                type="button"
                className={styles.nextRoundButton}
                onClick={handleViewLastRoundClick}
              >
                ← View last round
              </button>
            )}
            {(
              (gameState.currentRound === 'country' && (backSteps > 0 || countryFinished)) ||
              (gameState.currentRound === 'city' && backSteps > 0)
            ) && (
              <button
                type="button"
                className={styles.nextRoundButton}
                onClick={handleNextRoundClick}
              >
                Next round
              </button>
            )}
          </div>
        )}


        {gameState.gameComplete && viewIndex === 2 && (
          <div className={styles.completionMessage}>
            <h2 className={styles.completionTitle}>Game complete.</h2>
            <p className={styles.completionText}>
              Today's landmark is <strong>{landmark.name}</strong> in{' '}
              <strong>{landmark.city}</strong>, <strong>{landmark.country}</strong>
            </p>
            <div className={styles.completionRounds}>
              <p><strong>Landmark name:</strong> {gameState.landmarkGuessed ? 'Correct' : 'Not found'}</p>
              <p><strong>Country:</strong> {gameState.countryGuessed ? 'Correct' : 'Not found'}</p>
              <p><strong>City:</strong> {gameState.cityGuessed ? 'Correct' : 'Not found'}</p>
            </div>
            <p className={styles.completionStats}>
              Total guesses:{' '}
              <strong>
                {gameState.landmarkGuesses + gameState.guesses.length + gameState.cityGuesses}
              </strong>
            </p>
            <div className={styles.shareActions}>
              <button
                type="button"
                className={styles.shareButton}
                onClick={handleShareResults}
              >
                Share results
              </button>
              {shareCopied && (
                <div className={styles.shareCopied}>Copied to clipboard – paste into a text to share.</div>
              )}
            </div>
            <div className={styles.nextRoundContainer}>
              {viewIndex > 0 && (
                <button
                  type="button"
                  className={styles.nextRoundButton}
                  onClick={handleViewLastRoundClick}
                >
                  ← View last round
                </button>
              )}
              {backSteps > 0 && (
                <button
                  type="button"
                  className={styles.nextRoundButton}
                  onClick={handleNextRoundClick}
                >
                  Next round →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
