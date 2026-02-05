'use client';

import { useState, useEffect } from 'react';
import { Landmark, GameState } from '@/types/landmark';
import { countries } from '@/data/countries';
import { normalizeForMatch } from '@/lib/stringUtils';
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
  onPlayPastPuzzle?: () => void;
  onBackToToday?: () => void;
  isPastPuzzle?: boolean;
}

export default function GameBoard({
  landmark,
  gameState,
  setGameState,
  onPlayPastPuzzle,
  onBackToToday,
  isPastPuzzle = false,
}: GameBoardProps) {
  const [countryInput, setCountryInput] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'native' | 'clipboard' | null>(null);
  const [viewIndex, setViewIndex] = useState(0);

  const roundOrder: Array<'landmark' | 'country' | 'city'> = ['landmark', 'country', 'city'];
  const currentIndex = roundOrder.indexOf(gameState.currentRound);
  const effectiveViewIndex = Math.min(viewIndex, currentIndex);
  const roundToShow: 'landmark' | 'country' | 'city' = roundOrder[effectiveViewIndex];
  const backSteps = currentIndex - effectiveViewIndex;

  // Sync viewIndex when advancing to a new round (e.g. game completes)
  useEffect(() => {
    setViewIndex(prev => Math.min(prev, currentIndex));
  }, [currentIndex]);

  // When loading a completed game (refresh or back to today), show completion screen
  useEffect(() => {
    if (gameState.gameComplete) {
      setViewIndex(2);
    }
  }, [gameState.gameComplete]);

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
    setViewIndex(1);
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
    setViewIndex(2);
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
    const isCorrect = normalizeForMatch(cityGuess) === normalizeForMatch(landmark.city);
    
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
        cityRevealed: true,
        gameComplete: true,
      };
    });
  };

  const handleViewLastRoundClick = () => {
    setViewIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextRoundClick = () => {
    // If we are currently viewing a previous round, step forward one round at a time.
    if (effectiveViewIndex < currentIndex) {
      setViewIndex(prev => Math.min(currentIndex, prev + 1));
      return;
    }

    // From the live country round, Next should advance to the city round when finished.
    if (gameState.currentRound === 'country' && countryFinished) {
      handleGoToCityRound();
    }
  };

  const handleShareResults = async () => {
    setShareMethod(null);
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
      timeZone: 'America/New_York',
    });

    const shareUrl = 'https://landmarkgame.vercel.app/';
    const shareText = [
      `landmark puzzle #${landmark.id} – ${dateStr}`,
      '',
      landmarkLine,
      countryLine,
      cityLine,
      '',
      `Total guesses: ${totalGuesses}`,
      '',
      shareUrl,
    ].join('\n');

    try {
      // Use native share sheet when available (iOS, Android) – shows Messages, WhatsApp, etc.
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `landmark puzzle #${landmark.id}`,
          text: shareText,
          url: shareUrl, // Enables link preview in Messages, WhatsApp, etc.
        });
        setShareMethod('native');
        setShareCopied(true);
        setTimeout(() => {
          setShareCopied(false);
          setShareMethod(null);
        }, 2000);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareMethod('clipboard');
        setShareCopied(true);
        setTimeout(() => {
          setShareCopied(false);
          setShareMethod(null);
        }, 2000);
      }
    } catch {
      // User cancelled share or clipboard failed – ignore
    }
  };

  return (
    <div className={styles.gameBoard}>
      <div className={styles.landmarkSection}>
        <LandmarkDisplay landmark={landmark} />
      </div>

      <div className={styles.gameInfo}>
        <div className={styles.stats}>
          {effectiveViewIndex >= 1 && (gameState.landmarkGuessed || gameState.landmarkRevealed || gameState.landmarkGuesses >= 5) && (
            <div className={`${styles.stat}${!gameState.landmarkGuessed ? ` ${styles.statNotFound}` : ''}`}>
              <span className={styles.statLabel}>Status:</span>
              <span className={gameState.landmarkGuessed ? styles.statValueSuccess : styles.statValueSmall}>
                {gameState.landmarkGuessed ? '✓ Landmark found' : '✗ Landmark not found'}
              </span>
            </div>
          )}
          {effectiveViewIndex >= 2 && (gameState.countryGuessed || gameState.countryRevealed || gameState.guesses.length >= 5) && (
            <div className={`${styles.stat}${!gameState.countryGuessed ? ` ${styles.statNotFound}` : ''}`}>
              <span className={styles.statLabel}>Status:</span>
              <span className={gameState.countryGuessed ? styles.statValueSuccess : styles.statValueSmall}>
                {gameState.countryGuessed ? '✓ Country found' : '✗ Country not found'}
              </span>
            </div>
          )}
          {effectiveViewIndex >= 2 && (gameState.cityGuessed || gameState.cityRevealed || gameState.cityGuesses >= 5) && (
            <div className={`${styles.stat}${!gameState.cityGuessed ? ` ${styles.statNotFound}` : ''}`}>
              <span className={styles.statLabel}>Status:</span>
              <span className={gameState.cityGuessed ? styles.statValueSuccess : styles.statValueSmall}>
                {gameState.cityGuessed ? '✓ City found' : '✗ City not found'}
              </span>
            </div>
          )}
        </div>

        {roundToShow === 'landmark' && !(gameState.gameComplete && effectiveViewIndex === 2) && (
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
                {gameState.gameComplete && effectiveViewIndex < 2 && (
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

        {roundToShow === 'country' && !(gameState.gameComplete && effectiveViewIndex === 2) && (
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

        {roundToShow === 'country' && !(gameState.gameComplete && effectiveViewIndex === 2) && (
          <div className={styles.nextRoundContainer}>
            {effectiveViewIndex > 0 && (
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

        {roundToShow === 'city' && !(gameState.gameComplete && effectiveViewIndex === 2) && (
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

        {roundToShow === 'city' && !(gameState.gameComplete && effectiveViewIndex === 2) && (
          <div className={styles.nextRoundContainer}>
            {effectiveViewIndex > 0 && (
              <button
                type="button"
                className={styles.nextRoundButton}
                onClick={handleViewLastRoundClick}
              >
                ← View last round
              </button>
            )}
            {gameState.currentRound === 'city' && backSteps > 0 && (
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


        {gameState.gameComplete && effectiveViewIndex === 2 && (
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
                <div className={styles.shareCopied}>
                  {shareMethod === 'native' ? 'Shared!' : 'Copied to clipboard – paste into a text to share.'}
                </div>
              )}
            </div>
          </div>
        )}

        {gameState.gameComplete && effectiveViewIndex === 2 && (
          <div className={styles.completionFooter}>
            <p className={styles.completionFooterText}>
              {isPastPuzzle ? 'Play another past puzzle or return to today.' : 'Come back tomorrow for a new landmark!'}
            </p>
            <div className={styles.completionFooterButtons}>
              {effectiveViewIndex > 0 && (
                <button
                  type="button"
                  className={styles.nextRoundButton}
                  onClick={handleViewLastRoundClick}
                >
                  ← View last round
                </button>
              )}
              {onPlayPastPuzzle && (
                <button
                  type="button"
                  className={styles.nextRoundButton}
                  onClick={onPlayPastPuzzle}
                >
                  Play past puzzles
                </button>
              )}
            </div>
          </div>
        )}

        {isPastPuzzle && onBackToToday && (
          <div className={styles.backToTodayFooter}>
            <button
              type="button"
              className={styles.backToTodayButton}
              onClick={onBackToToday}
            >
              ← Back to today
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
