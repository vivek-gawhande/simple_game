import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Cell } from './Cell';
import { useTheme } from '@/hooks';
import { SYMBOLS, type Symbol, type CellValue, type GridSize } from '@/utils/constants';

interface GameBoardProps {
  board: CellValue[];
  size: GridSize;
  winningLine: number[] | null;
  currentPlayer: Symbol;
  onCellPress: (index: number) => void;
  disabled?: boolean;
}

export function GameBoard({
  board,
  size,
  winningLine,
  currentPlayer,
  onCellPress,
  disabled = false,
}: GameBoardProps) {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const boardSize = Math.min(width - 40, 360);
  const containerBorderWidth = styles.container.borderWidth;
  const cellSize = (boardSize - containerBorderWidth * 2) / size;

  const winningSet = useMemo(() => new Set(winningLine || []), [winningLine]);

  return (
    <View
      style={[
        styles.container,
        { width: boardSize, height: boardSize },
        { borderColor: colors.grid },
      ]}
    >
      {board.map((cell, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        return (
          <Cell
            key={index}
            value={cell}
            index={index}
            size={cellSize}
            isWinning={winningSet.has(index)}
            isCurrentPlayer={cell === null && currentPlayer === SYMBOLS.X}
            onPress={() => onCellPress(index)}
            disabled={disabled || cell !== null || winningLine !== null}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderRadius: 0,
    overflow: 'hidden',
  },
});