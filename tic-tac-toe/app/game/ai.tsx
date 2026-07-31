import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { DifficultySelector } from '@/components/DifficultySelector';
import { GameBoard } from '@/components/GameBoard';
import { WinLine } from '@/components/WinLine';
import { ScoreBoard } from '@/components/ScoreBoard';
import { CRTShader } from '@/components/CRTShader';
import { useGameLogic, useTheme, useSound } from '@/hooks';
import { SYMBOLS, type GridSize, type Difficulty, DIFFICULTY_LABELS } from '@/utils/constants';

export default function AIGame() {
  const router = useRouter();
  const { colors } = useTheme();
  const playSound = useSound();
  const crtStyles = CRTShader();
  const [showDifficulty, setShowDifficulty] = useState(false);

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
    setVsAI,
    setDifficulty,
    setAiPlayer,
    setGridSize,
  } = useGameLogic();

  useEffect(() => {
    setVsAI(true);
    setAiPlayer(SYMBOLS.O);
    setGridSize(3);
  }, [setVsAI, setAiPlayer, setGridSize]);

  useEffect(() => {
    if (winner && winner !== 'draw') {
      playSound('win');
    } else if (winner === 'draw') {
      playSound('draw');
    }
  }, [winner, playSound]);

  const handleCellPress = (index: number) => {
    if (!gameOver && board[index] === SYMBOLS.EMPTY && currentPlayer !== aiPlayer) {
      makeMove(index);
      playSound('move');
    }
  };

  const handleNewGame = () => {
    // Randomize AI player for new game
    setAiPlayer(Math.random() < 0.5 ? SYMBOLS.X : SYMBOLS.O);
    resetGame();
    playSound('click');
  };

  const handleResetScores = () => {
    playSound('click');
  };

  const handleBack = () => {
    router.back();
    playSound('click');
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
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
        <Text style={[styles.title, { color: colors.fg }]}>VS AI • {DIFFICULTY_LABELS[difficulty]}</Text>
        <PixelButton
          variant="secondary"
          size="sm"
          onPress={() => setShowDifficulty(!showDifficulty)}
          title="DIFFICULTY"
        />
      </View>

      {showDifficulty && (
        <View style={[styles.difficultyOverlay, { backgroundColor: colors.bg }]}>
          <View style={[styles.difficultyPanel, { borderColor: colors.grid }]}>
            <Text style={[styles.difficultyTitle, { color: colors.accent }]}>SELECT DIFFICULTY</Text>
            <DifficultySelector
              selected={difficulty}
              onChange={handleDifficultyChange}
              compact
            />
            <PixelButton
              variant="primary"
              size="md"
              onPress={() => setShowDifficulty(false)}
              title="CONFIRM"
              style={{ marginTop: 16, width: '100%' }}
            />
          </View>
        </View>
      )}

      <View style={styles.gameArea}>
        <View style={styles.boardWrapper}>
          <GameBoard
            board={board}
            size={currentSize}
            winningLine={winningLine}
            currentPlayer={currentPlayer}
            onCellPress={handleCellPress}
            disabled={gameOver || currentPlayer === aiPlayer}
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
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
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
  difficultyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 20,
  },
  difficultyPanel: {
    width: '100%',
    maxWidth: 320,
    padding: 24,
    borderWidth: 2,
    borderRadius: 0,
    gap: 16,
  },
  difficultyTitle: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
});