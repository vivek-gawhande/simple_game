import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { CRTShader } from '@/components/CRTShader';
import { useTheme } from '@/hooks/useTheme';

export default function GameLayout() {
  const { colors } = useTheme();
  const crtStyles = CRTShader();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg, flex: 1 },
      }}
    >
      <Stack.Screen name="classic" />
      <Stack.Screen name="grid-4x4" />
      <Stack.Screen name="grid-5x5" />
      <Stack.Screen name="ai" />
    </Stack>
  );
}