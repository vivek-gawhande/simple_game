import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { type GridSize } from '@/utils/constants';

interface WinLineProps {
  line: number[] | null;
  size: GridSize;
  boardSize: number;
  color: string;
  visible: boolean;
}

export function WinLine({ line, size, boardSize, color, visible }: WinLineProps) {
  const { colors } = useTheme();
  const progress = new Animated.Value(0);

  useEffect(() => {
    if (visible && line && line.length >= 2) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      progress.setValue(0);
    }
  }, [visible, line]);

  if (!visible || !line || line.length < 2) return null;

  const cellSize = boardSize / size;
  const startRow = Math.floor(line[0] / size);
  const startCol = line[0] % size;
  const endRow = Math.floor(line[line.length - 1] / size);
  const endCol = line[line.length - 1] % size;

  const startX = startCol * cellSize + cellSize / 2;
  const startY = startRow * cellSize + cellSize / 2;
  const endX = endCol * cellSize + cellSize / 2;
  const endY = endRow * cellSize + cellSize / 2;

  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  const animatedStyle = {
    width: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, length],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.line,
          {
            left: startX,
            top: startY,
            transform: [{ rotate: `${angle}deg` }],
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  line: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    transformOrigin: 'left center',
  },
});