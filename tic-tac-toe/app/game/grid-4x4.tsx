import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { GameBoard } from '@/components/GameBoard';
import { WinLine } from '@/components/WinLine';
import { ScoreBoard } from '@/components/ScoreBoard';
import { CRTShader } from '@/components/CRTShader';
import { useGameLogic, useTheme, useSound } from '@/hooks';
import { SYMBOLS, type GridSize } from '@/utils/constants';

export default function Grid4x4Game() {
  const router = useRouter();
  const { colors } = useTheme();
  const playSound = useSound();
  const crtStyles = CRTShader();

  const {
    board,
    gridSize,
    currentPlayer,
    winner,
    winningLine,
    gameOver,
    scores,
    vsAI,
    difficulty,
    aiPlayer,
    makeMove,
    resetGame,
    resetScores,
    setVsAI,
    setDifficulty,
    setGridSize,
  } = useGameLogic();

  useEffect(() => {
    setVsAI(false);
    setDifficulty('medium');
    setGridSize(4);
  }, [setVsAI, setDifficulty, setGridSize]);

  useEffect(() => {
    if (winner && winner !== 'draw') {
      playSound('win');
    } else if (winner === 'draw') {
      playSound('draw');
    }
  }, [winner, playSound]);

  const handleCellPress = (index: number) => {
    if (!gameOver && board[index] === SYMBOLS.EMPTY) {
      makeMove(index);
      playSound('move');
    }
  };

  const handleNewGame = () => {
    resetGame();
    playSound('click');
  };

  const handleResetScores = () => {
    resetScores();
    playSound('click');
  };

  const handleBack = () => {
    router.back();
    playSound('click');
  };

  const currentSize = gridSize as GridSize;
  const { width } = Dimensions.get('window');
  const boardSize = Math.min(width - 40, 360);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={colors.bg === '#1a1a2e' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      <View style={styles.header}>
        <PixelButton variant="ghost" size="sm" onPress={handleBack} title="BACK" />
        <Text style={[styles.title, { color: colors.fg }]}>GRID 4×4</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.gameArea}>
        <View style={styles.boardWrapper}>
          <GameBoard
            board={board}
            size={currentSize}
            winningLine={winningLine}
            currentPlayer={currentPlayer}
            onCellPress={handleCellPress}
            disabled={gameOver || (vsAI && currentPlayer === aiPlayer)}
          />
          <WinLine
            line={winningLine}
            size={currentSize}
            boardSize={boardSize}
            color={colors.winLine}
            visible={!!winner && winner !== 'draw'}
          />
        </View>

        <ScoreBoard
          scores={scores}
          currentPlayer={currentPlayer}
          winner={winner}
          onReset={handleResetScores}
          onNewGame={handleNewGame}
        />
      </View>

      <View style={[styles.crtOverlay, crtStyles.overlay]} pointerEvents="none" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  boardWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  crtOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1000,
  },
});