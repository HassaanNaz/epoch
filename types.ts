
export interface HistoricalEvent {
  eventName: string;
  year: number;
  description: string;
  era: string;
  funFact: string;
}

export type GameScreen = 'start' | 'game' | 'leaderboard' | 'gameOver';

export type GameMode = 'classic' | 'modern' | 'ancient' | 'blitz';

export interface GameState {
  screen: GameScreen;
  mode: GameMode;
  score: number;
  lives: number;
  streak: number;
  eventA: HistoricalEvent | null;
  eventB: HistoricalEvent | null;
  isRevealing: boolean;
  lastGuessResult: 'correct' | 'wrong' | null;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  mode: GameMode;
  date: string;
}
