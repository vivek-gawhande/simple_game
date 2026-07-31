import { GridSize, Symbol, CellValue, WinResult } from './constants';

export function createEmptyBoard(size: GridSize): CellValue[] {
  return new Array(size * size).fill(null);
}

export function getEmptyCells(board: CellValue[]): number[] {
  return board.map((cell, idx) => (cell === null ? idx : -1)).filter((idx) => idx !== -1);
}

function checkLine(
  board: CellValue[],
  size: GridSize,
  indices: number[]
): Symbol | null {
  const first = board[indices[0]];
  if (!first) return null;
  if (indices.every((i) => board[i] === first)) return first;
  return null;
}

function getWinningLines(size: GridSize): number[][] {
  const lines: number[][] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    lines.push(Array.from({ length: size }, (_, c) => r * size + c));
  }

  // Columns
  for (let c = 0; c < size; c++) {
    lines.push(Array.from({ length: size }, (_, r) => r * size + c));
  }

  // Main diagonal
  lines.push(Array.from({ length: size }, (_, i) => i * size + i));

  // Anti-diagonal
  lines.push(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)));

  return lines;
}

export function checkWin(board: CellValue[], size: GridSize): WinResult {
  const lines = getWinningLines(size);

  for (const line of lines) {
    const winner = checkLine(board, size, line);
    if (winner) {
      return { winner, line };
    }
  }
  return null;
}

export function checkDraw(board: CellValue[], size: GridSize): boolean {
  return board.every((cell) => cell !== null) && !checkWin(board, size);
}

export function makeMove(
  board: CellValue[],
  index: number,
  player: Symbol
): CellValue[] {
  const newBoard = [...board];
  if (newBoard[index] === null) {
    newBoard[index] = player;
  }
  return newBoard;
}

export function getNextPlayer(current: Symbol): Symbol {
  return current === 'X' ? 'O' : 'X';
}

export function getRowCol(index: number, size: GridSize): [number, number] {
  return [Math.floor(index / size), index % size];
}

export function getIndex(row: number, col: number, size: GridSize): number {
  return row * size + col;
}