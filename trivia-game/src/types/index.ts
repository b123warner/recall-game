export interface Question {
  id: string;
  question: string;
  answers: string[];       // always 4 options
  correctIndex: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'api' | 'ai';
}

export interface Player {
  id: string;
  name: string;
}

export type GamePhase =
  | 'setup'
  | 'category-pick'
  | 'question'
  | 'answer-reveal'
  | 'score-update'
  | 'game-over';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  scores: Record<string, number>;    // keyed by player id
  currentQuestion: Question | null;
  questionQueue: Question[];
  currentPlayerIndex: number;        // whose turn it is to select an answer
  roundNumber: number;
  totalRounds: number;
  selectedAnswerIndex: number | null;
}
