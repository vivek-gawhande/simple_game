import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SYMBOLS, type Symbol, type GridSize, type Difficulty, type CellValue, type GameMode } from '@/utils/constants';
import { createEmptyBoard, checkWin, checkDraw, makeMove, getNextPlayer } from '@/utils/gameLogic';

interface GameState {
  board: CellValue[];
  currentPlayer: Symbol;
  winner: Symbol | 'draw' | null;
  winningLine: number[] | null;
  gameActive: boolean;
  scores: { X: number; O: number; draws: number; streak: number };
  gridSize: GridSize;
  vsAI: boolean;
  difficulty: Difficulty;
  aiPlayer: Symbol;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  crtEnabled: boolean;
  theme: 'dark' | 'light';

  // Actions
  makeMove: (index: number) => void;
  resetGame: () => void;
  resetScores: () => void;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setGridSize: (size: GridSize) => void;
  setVsAI: (vsAI: boolean) => void;
  setAIPlayer: (player: Symbol) => void;
  togglePlayer: () => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  toggleCRT: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const initialState: Omit<GameState, keyof {
  makeMove: any;
  resetGame: any;
  resetScores: any;
  setMode: any;
  setDifficulty: any;
  setGridSize: any;
  setVsAI: any;
  setAIPlayer: any;
  togglePlayer: any;
  toggleSound: any;
  toggleHaptics: any;
  toggleCRT: any;
  setTheme: any;
}> = {
  board: createEmptyBoard(3),
  currentPlayer: 'X',
  winner: null,
  winningLine: null,
  gameActive: true,
  scores: { X: 0, O: 0, draws: 0, streak: 0 },
  gridSize: 3,
  vsAI: false,
  difficulty: 'medium',
  aiPlayer: 'O',
  soundEnabled: true,
  hapticsEnabled: true,
  crtEnabled: true,
  theme: 'dark',
};

const DIFFICULTY_DEPTH: Record<Difficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 9,
};

function getAIMove(board: CellValue[], size: GridSize, difficulty: Difficulty, player: Symbol): number {
  const depth = DIFFICULTY_DEPTH[difficulty];
  const opponent = player === SYMBOLS.X ? SYMBOLS.O : SYMBOLS.X;

  // Easy: 30% random
  if (difficulty === 'easy' && Math.random() < 0.3) {
    const empty = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) continue;

    board[i] = player;
    const score = minimax(board, size, depth - 1, false, -Infinity, Infinity, player, opponent);
    board[i] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}

function minimax(
  board: CellValue[],
  size: GridSize,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  player: Symbol,
  opponent: Symbol
): number {
  const winner = checkWinner(board, size);
  if (winner === player) return 10 - (9 - depth);
  if (winner === opponent) return -10 + (9 - depth);
  if (winner === 'draw' || depth === 0) return 0;

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) continue;
      board[i] = player;
      const score = minimax(board, size, depth - 1, false, alpha, beta, player, opponent);
      board[i] = null;
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) continue;
      board[i] = opponent;
      const score = minimax(board, size, depth - 1, true, alpha, beta, player, opponent);
      board[i] = null;
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

function checkWinner(board: CellValue[], size: GridSize): Symbol | 'draw' | null {
  const lines: number[][] = [];

  for (let r = 0; r < size; r++) {
    const line: number[] = [];
    for (let c = 0; c < size; c++) line.push(r * size + c);
    lines.push(line);
  }
  for (let c = 0; c < size; c++) {
    const line: number[] = [];
    for (let r = 0; r < size; r++) line.push(r * size + c);
    lines.push(line);
  }
  const diag1: number[] = [];
  for (let i = 0; i < size; i++) diag1.push(i * size + i);
  lines.push(diag1);

  const diag2: number[] = [];
  for (let i = 0; i < size; i++) diag2.push(i * size + (size - 1 - i));
  lines.push(diag2);

  for (const line of lines) {
    const first = board[line[0]];
    if (first === null) continue;
    if (line.every((idx) => board[idx] === first)) return first;
  }

  if (board.every((c) => c !== null)) return 'draw';
  return null;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      makeMove: (index: number) => {
        const state = get();
        if (!state.gameActive || state.winner || state.board[index] !== null) return;

        const newBoard = makeMove(state.board, index, state.currentPlayer);
        const win = checkWin(newBoard, state.gridSize);
        const draw = !win && checkDraw(newBoard, state.gridSize);

        let updates: Partial<GameState> = {
          board: newBoard,
          currentPlayer: getNextPlayer(state.currentPlayer),
        };

        if (win) {
          const winnerSymbol = win.winner;
          updates = {
            ...updates,
            winner: winnerSymbol,
            winningLine: win.line.flat(),
            scores: {
              ...state.scores,
              [winnerSymbol === 'X' ? 'X' : 'O']: state.scores[winnerSymbol === 'X' ? 'X' : 'O'] + 1,
              streak: state.currentPlayer === winnerSymbol ? state.scores.streak + 1 : 1,
            },
            gameActive: false,
          };
        } else if (draw) {
          updates = {
            ...updates,
            winner: 'draw',
            scores: { ...state.scores, draws: state.scores.draws + 1, streak: 0 },
            gameActive: false,
          };
        } else {
          updates = {
            ...updates,
            scores: { ...state.scores, streak: 0 },
          };
        }

        set(updates);

        // AI move
        if (state.vsAI && !updates.winner && updates.currentPlayer === state.aiPlayer) {
          setTimeout(() => {
            const aiState = get();
            if (!aiState.gameActive || aiState.winner) return;

            const move = getAIMove(aiState.board, aiState.gridSize, aiState.difficulty, aiState.aiPlayer);
            if (move !== -1) {
              get().makeMove(move);
            }
          }, 300);
        }
      },

      resetGame: () => {
        const { gridSize } = get();
        set({
          board: createEmptyBoard(gridSize),
          currentPlayer: SYMBOLS.X,
          winner: null,
          winningLine: null,
          gameActive: true,
        });
      },

      resetScores: () => set({ scores: { X: 0, O: 0, draws: 0, streak: 0 } }),

      setMode: (mode: GameMode) => {
        const modeConfig: Record<GameMode, { vsAI: boolean; gridSize: GridSize }> = {
          classic: { vsAI: false, gridSize: 3 },
          '4x4': { vsAI: false, gridSize: 4 },
          '5x5': { vsAI: false, gridSize: 5 },
          ai: { vsAI: true, gridSize: 3 },
        };
        const config = modeConfig[mode];
        set({
          vsAI: config.vsAI,
          gridSize: config.gridSize,
          board: createEmptyBoard(config.gridSize),
          currentPlayer: SYMBOLS.X,
          winner: null,
          winningLine: null,
          gameActive: true,
        });
      },

      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),

      setGridSize: (size: GridSize) => {
        set({
          gridSize: size,
          board: createEmptyBoard(size),
          currentPlayer: SYMBOLS.X,
          winner: null,
          winningLine: null,
          gameActive: true,
        });
      },

      setVsAI: (vsAI: boolean) => set({ vsAI }),

      setAIPlayer: (player: Symbol) => set({ aiPlayer: player }),

      togglePlayer: () => set((s) => ({ currentPlayer: getNextPlayer(s.currentPlayer) })),

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
      toggleCRT: () => set((s) => ({ crtEnabled: !s.crtEnabled })),
      setTheme: (theme: 'dark' | 'light') => set({ theme }),
    }),
    {
      name: 'tictactoe-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        gridSize: state.gridSize,
        vsAI: state.vsAI,
        difficulty: state.difficulty,
        aiPlayer: state.aiPlayer,
        scores: state.scores,
        soundEnabled: state.soundEnabled,
        hapticsEnabled: state.hapticsEnabled,
        crtEnabled: state.crtEnabled,
        theme: state.theme,
      }),
    }
  )
);

// Selector hooks
export const useGameLogic = () => {
  const {
    board,
    gridSize,
    currentPlayer,
    winner,
    winningLine,
    gameActive,
    vsAI,
    difficulty,
    aiPlayer,
    scores,
    makeMove,
    resetGame,
    resetScores,
    setGridSize,
    setVsAI,
    setDifficulty,
    setAIPlayer,
  } = useGameStore();

  return {
    board,
    gridSize,
    currentPlayer,
    winner,
    winningLine,
    gameOver: !gameActive,
    vsAI,
    difficulty,
    aiPlayer,
    scores,
    makeMove,
    resetGame,
    resetScores,
    setGridSize,
    setVsAI,
    setDifficulty,
    setAiPlayer: setAIPlayer,
  };
};

export const useAI = () => {
  const { difficulty, aiPlayer, vsAI } = useGameStore();
  return { difficulty, aiPlayer, vsAI };
};

export const useSettings = () => {
  const {
    soundEnabled,
    hapticsEnabled,
    crtEnabled,
    theme,
    toggleSound,
    toggleHaptics,
    toggleCRT,
    setTheme,
  } = useGameStore();
  return {
    soundEnabled,
    hapticsEnabled,
    crtEnabled,
    theme,
    toggleSound,
    toggleHaptics,
    toggleCRT,
    setTheme,
  };
};