import { create } from 'zustand';
import type { GameState, GamePhase, Player, Question } from '../types';

interface GameStore extends GameState {
  // Setup actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setTotalRounds: (rounds: number) => void;

  // State machine transitions
  setPhase: (phase: GamePhase) => void;
  startGame: () => void;

  // Gameplay actions — dispatchable from any source (click, keyboard, WebSocket in Phase 3)
  loadQuestions: (questions: Question[]) => void;
  selectAnswer: (index: number) => void;
  advanceRound: () => void;

  // Reset
  resetGame: () => void;
}

const initialState: GameState = {
  phase: 'setup',
  players: [],
  scores: {},
  currentQuestion: null,
  questionQueue: [],
  currentPlayerIndex: 0,
  roundNumber: 0,
  totalRounds: 10,
  selectedAnswerIndex: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  addPlayer: (name) => {
    const id = crypto.randomUUID();
    set((state) => ({
      players: [...state.players, { id, name }],
      scores: { ...state.scores, [id]: 0 },
    }));
  },

  removePlayer: (id) => {
    set((state) => {
      const scores = { ...state.scores };
      delete scores[id];
      return {
        players: state.players.filter((p) => p.id !== id),
        scores,
      };
    });
  },

  setTotalRounds: (rounds) => set({ totalRounds: rounds }),

  setPhase: (phase) => set({ phase }),

  startGame: () => {
    set({ phase: 'category-pick', roundNumber: 1, currentPlayerIndex: 0 });
  },

  loadQuestions: (questions) => {
    const [current, ...rest] = questions;
    set({
      currentQuestion: current ?? null,
      questionQueue: rest,
      phase: 'question',
      selectedAnswerIndex: null,
    });
  },

  selectAnswer: (index) => {
    set({ selectedAnswerIndex: index, phase: 'answer-reveal' });
  },

  advanceRound: () => {
    const { players, currentPlayerIndex, questionQueue, roundNumber, totalRounds, scores, currentQuestion, selectedAnswerIndex } = get();

    // Award point if correct
    const updatedScores = { ...scores };
    if (
      currentQuestion &&
      selectedAnswerIndex === currentQuestion.correctIndex &&
      players.length > 0
    ) {
      const activePlayerId = players[currentPlayerIndex].id;
      updatedScores[activePlayerId] = (updatedScores[activePlayerId] ?? 0) + 1;
    }

    const nextRound = roundNumber + 1;
    const isGameOver = nextRound > totalRounds;

    if (isGameOver) {
      set({ scores: updatedScores, phase: 'game-over' });
      return;
    }

    const [nextQuestion, ...remaining] = questionQueue;
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

    set({
      scores: updatedScores,
      currentQuestion: nextQuestion ?? null,
      questionQueue: remaining,
      currentPlayerIndex: nextPlayerIndex,
      roundNumber: nextRound,
      selectedAnswerIndex: null,
      phase: 'category-pick',
    });
  },

  resetGame: () => set({ ...initialState }),
}));
