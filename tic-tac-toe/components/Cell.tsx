import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSound } from '@/hooks/useSound';
import { SYMBOLS, type CellValue } from '@/utils/constants';

interface CellProps {
  value: CellValue;
  index: number;
  size: number;
  isWinning: boolean;
  isCurrentPlayer: boolean;
  onPress: (index: number) => void;
  disabled?: boolean;
}

const Cell = forwardRef<View, CellProps>(
  (
    {
      value,
      index,
      size,
      isWinning,
      isCurrentPlayer,
      onPress,
      disabled = false,
    },
    ref
  ) => {
    const { colors } = useTheme();
    const playSound = useSound();

    const scale = new Animated.Value(1);
    const opacity = new Animated.Value(1);
    const popAnim = new Animated.Value(0);

    const animatePress = () => {
      if (disabled) return;
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 40,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 40,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const animateRelease = () => {
      if (disabled) return;
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.out(Easing.elastic(1.5)),
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const animatePop = () => {
      Animated.sequence([
        Animated.timing(popAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(2)),
        }),
        Animated.timing(popAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ]).start();
    };

    React.useEffect(() => {
      if (value !== SYMBOLS.EMPTY) {
        animatePop();
        playSound('move');
      }
    }, [value]);

    const cellSize = Math.floor(size);
    const fontSize = Math.floor(cellSize * 0.55);

    const getColor = () => {
      if (value === SYMBOLS.X) return colors.xColor;
      if (value === SYMBOLS.O) return colors.oColor;
      return colors.fgDim;
    };

    const animatedStyle = {
      transform: [
        { scale },
        { scale: popAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) },
      ],
      opacity,
    };

    const isEmpty = value === SYMBOLS.EMPTY;
    const hoverGlow = isCurrentPlayer && isEmpty && !disabled;

    return (
      <TouchableOpacity
        ref={ref}
        onPress={() => {
          if (!disabled && isEmpty) {
            animatePress();
            playSound('click');
            setTimeout(() => animateRelease(), 50);
            onPress(index);
          }
        }}
        onPressIn={animatePress}
        onPressOut={animateRelease}
        activeOpacity={disabled ? 1 : 0.9}
        disabled={disabled}
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor: isWinning ? colors.winLine + '20' : hoverGlow ? colors.fg + '15' : 'transparent',
            borderColor: isWinning ? colors.winLine : colors.grid,
          },
          animatedStyle,
        ]}
        accessibilityRole="button"
        accessibilityLabel={isEmpty ? 'Empty cell' : `${value} at position ${index + 1}`}
      >
        <Animated.View style={styles.center}>
          <Text
            style={[
              styles.symbol,
              {
                color: getColor(),
                fontSize,
                textShadowColor: getColor() + '80',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              },
            ]}
          >
            {value !== SYMBOLS.EMPTY ? value : ''}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

Cell.displayName = 'Cell';

const styles = StyleSheet.create({
  cell: {
    borderWidth: 2,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontFamily: 'PressStart2P-Regular',
    lineHeight: 24,
    includeFontPadding: false,
  },
});

export { Cell };