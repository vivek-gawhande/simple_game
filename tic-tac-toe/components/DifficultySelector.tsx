import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PixelButton } from './PixelButton';
import { useTheme } from '@/hooks/useTheme';
import { DIFFICULTIES, type Difficulty, DIFFICULTY_LABELS, DIFFICULTY_DESCRIPTIONS } from '@/utils/constants';

interface DifficultySelectorProps {
  selected: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  compact?: boolean;
}

export function DifficultySelector({ selected, onChange, compact = false }: DifficultySelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={compact ? styles.containerCompact : styles.container}>
      {DIFFICULTIES.map((difficulty) => (
        <PixelButton
          key={difficulty}
          title={compact ? DIFFICULTY_LABELS[difficulty] : `${DIFFICULTY_LABELS[difficulty]}`}
          variant={selected === difficulty ? 'primary' : 'secondary'}
          size={compact ? 'sm' : 'md'}
          onPress={() => onChange(difficulty)}
          style={{
            ...styles.button,
            ...(compact ? styles.buttonCompact : {}),
          }}
        />
      ))}
      {!compact && (
        <Text style={[styles.description, { color: colors.fgDim }]}>
          {DIFFICULTY_DESCRIPTIONS[selected]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    alignItems: 'center',
  },
  containerCompact: {
    flexDirection: 'row',
    gap: 6,
  },
  button: {
    width: '100%',
  },
  buttonCompact: {
    minWidth: 70,
  },
  description: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 12,
  },
});