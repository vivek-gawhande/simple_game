import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const [isOpen, setIsOpen] = useState(false);

  if (compact) {
    return (
      <View style={styles.dropdownContainer}>
        <PixelButton
          title={`${DIFFICULTY_LABELS[selected]} ${isOpen ? '▴' : '▾'}`}
          variant="secondary"
          size="sm"
          onPress={() => setIsOpen((open) => !open)}
          style={styles.dropdownTrigger}
        />
        {isOpen && (
          <View
            style={[
              styles.dropdownList,
              { backgroundColor: colors.bg, borderColor: colors.grid },
            ]}
          >
            {DIFFICULTIES.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                onPress={() => {
                  onChange(difficulty);
                  setIsOpen(false);
                }}
                style={[
                  styles.dropdownOption,
                  difficulty === selected && { backgroundColor: colors.bgSecondary },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    { color: difficulty === selected ? colors.accent : colors.fg },
                  ]}
                >
                  {DIFFICULTY_LABELS[difficulty]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {DIFFICULTIES.map((difficulty) => (
        <PixelButton
          key={difficulty}
          title={DIFFICULTY_LABELS[difficulty]}
          variant={selected === difficulty ? 'primary' : 'secondary'}
          size="md"
          onPress={() => onChange(difficulty)}
          style={styles.button}
        />
      ))}
      <Text style={[styles.description, { color: colors.fgDim }]}>
        {DIFFICULTY_DESCRIPTIONS[selected]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  description: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 12,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownTrigger: {
    minWidth: 110,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    borderWidth: 2,
    zIndex: 100,
    elevation: 10,
    minWidth: 110,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownOptionText: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
