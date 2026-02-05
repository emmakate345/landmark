export interface Landmark {
  id: string;
  name: string;
  country: string;
  city: string;
  continent: string;
  imageUrl: string;
  description?: string;
}

export interface GameState {
  currentLandmark: Landmark | null;
  // Country round
  guesses: string[];
  hintUsed: boolean;
  countryGuessed: boolean;
  countryRevealed?: boolean;
  // City round
  cityGuess: string | null;
  cityGuessed: boolean;
  cityRevealed?: boolean;
  gameComplete: boolean;
  // Three‑round flow
  currentRound: 'landmark' | 'country' | 'city';
  // Landmark name round
  landmarkGuess: string | null;
  landmarkGuessed: boolean;
  landmarkGuesses: number;
  landmarkGuessHistory: string[];
  landmarkRevealed?: boolean;
  // City guesses count (country guesses are length of guesses[])
  cityGuesses: number;
  cityGuessHistory: string[];
  // UI: allow viewing previous round summary
  showPreviousRound: boolean;
}
