import React, { forwardRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSound } from '@/hooks/useSound';

interface PixelButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: any;
}

const PixelButton = forwardRef<React.ComponentRef<typeof TouchableOpacity>, PixelButtonProps>(
  (
    {
      title,
      onPress,
      icon,
      variant = 'primary',
      size = 'md',
      disabled = false,
      style,
    },
    ref
  ) => {
    const { colors } = useTheme();
    const playSound = useSound();

    const scale = new Animated.Value(1);
    const opacity = new Animated.Value(1);

    const variants = {
      primary: { bg: colors.fg, border: colors.fg, text: colors.bg },
      secondary: { bg: colors.bgSecondary, border: colors.fgDim, text: colors.fg },
      danger: { bg: colors.accent, border: colors.accentDim, text: colors.bg },
      ghost: { bg: 'transparent', border: colors.fgDim, text: colors.fgDim },
    };

    const sizes = {
      sm: { px: 12, py: 6, fontSize: 8, minWidth: 60 },
      md: { px: 20, py: 10, fontSize: 10, minWidth: 80 },
      lg: { px: 28, py: 14, fontSize: 12, minWidth: 100 },
    };

    const v = variants[variant];
    const s = sizes[size];

    const animatePressIn = () => {
      if (disabled) return;
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const animatePressOut = () => {
      if (disabled) return;
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.out(Easing.elastic(1.2)),
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const handlePressIn = () => {
      animatePressIn();
      playSound('click');
    };

    const handlePressOut = () => {
      animatePressOut();
    };

    const animatedStyle = {
      transform: [{ scale }],
      opacity,
    };

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={disabled ? 1 : 0.9}
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          {
            backgroundColor: disabled ? colors.grid : v.bg,
            borderColor: disabled ? colors.grid : v.border,
            paddingHorizontal: s.px,
            paddingVertical: s.py,
            minWidth: s.minWidth,
          },
          animatedStyle,
          style,
        ]}
        disabled={disabled}
      >
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.text,
              { color: disabled ? colors.grid : v.text, fontSize: s.fontSize },
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

PixelButton.displayName = 'PixelButton';

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'PressStart2P-Regular',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export { PixelButton };