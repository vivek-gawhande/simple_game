import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SYMBOLS, type Symbol } from '@/utils/constants';

interface ScoreBoardProps {
  scores: { X: number; O: number; draws: number; streak: number };
  currentPlayer: Symbol;
  winner: Symbol | 'draw' | null;
  onReset: () => void;
  onNewGame?: () => void;
}

export function ScoreBoard({
  scores,
  currentPlayer,
  winner,
  onReset,
  onNewGame,
}: ScoreBoardProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.scoresRow}>
        <View style={[styles.scoreBox, { borderColor: colors.xColor }]}>
          <Text style={[styles.label, { color: colors.xColor }]}>PLAYER X</Text>
          <Text style={[styles.value, { color: colors.xColor }]}>{scores.X}</Text>
          <Text style={[styles.smallLabel, { color: colors.xColor }]}>WINS</Text>
        </View>

        <View style={[styles.scoreBox, { borderColor: colors.fgDim }]}>
          <Text style={[styles.label, { color: colors.fgDim }]}>DRAWS</Text>
          <Text style={[styles.value, { color: colors.fgDim }]}>{scores.draws}</Text>
          <Text style={[styles.smallLabel, { color: colors.fgDim }]}>TOTAL</Text>
        </View>

        <View style={[styles.scoreBox, { borderColor: colors.oColor }]}>
          <Text style={[styles.label, { color: colors.oColor }]}>PLAYER O</Text>
          <Text style={[styles.value, { color: colors.oColor }]}>{scores.O}</Text>
          <Text style={[styles.smallLabel, { color: colors.oColor }]}>WINS</Text>
        </View>
      </View>

      {winner && (
        <View style={styles.statusContainer}>
          <Text style={[styles.status, { color: colors.winLine }]}>
            {winner === 'draw' ? 'DRAW!' : `${winner} WINS!`}
          </Text>
        </View>
      )}

      {!winner && (
        <View style={styles.turnContainer}>
          <Text style={[styles.turnLabel, { color: colors.fgDim }]}>TURN</Text>
          <Text
            style={[
              styles.turnValue,
              {
                color: currentPlayer === SYMBOLS.X ? colors.xColor : colors.oColor,
              },
            ]}
          >
            {currentPlayer}
          </Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        {onNewGame && (
          <TouchableOpacity onPress={onNewGame} activeOpacity={0.7}>
            <Text style={[styles.buttonText, { color: colors.fg }]}>NEW GAME</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onReset} activeOpacity={0.7}>
          <Text style={[styles.buttonText, { color: colors.accent }]}>RESET SCORES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  label: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  smallLabel: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statusContainer: {
    paddingVertical: 8,
  },
  status: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  turnContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  turnLabel: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  turnValue: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});