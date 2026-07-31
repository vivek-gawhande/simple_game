export type Symbol = 'X' | 'O';
export type GridSize = 3 | 4 | 5;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CellValue = Symbol | null;
export type WinResult = { winner: Symbol; line: number[] } | null;

export const SYMBOLS = { X: 'X', O: 'O', EMPTY: null } as const;
export const GRID_SIZES = [3, 4, 5] as const;
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const DIFFICULTY_DEPTH = { easy: 2, medium: 4, hard: Infinity } as const;
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
};
export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: 'AI PLAYS RANDOMLY SOMETIMES',
  medium: 'AI PLAYS WITH LIMITED LOOKAHEAD',
  hard: 'AI PLAYS PERFECTLY — UNBEATABLE',
};

export type GameMode = 'classic' | '4x4' | '5x5' | 'ai';
