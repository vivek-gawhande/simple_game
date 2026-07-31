import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useTheme, preloadSounds } from '@/hooks';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const loadAssets = async () => {
      await Font.loadAsync({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
      });
      await preloadSounds();
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    };
    loadAssets();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.bg }]}>
        <Text style={[styles.splashText, { color: colors.fg }]}>TIC TAC TOE</Text>
        <ActivityIndicator size="large" color={colors.accent} style={styles.spinner} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg, flex: 1 },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Tic Tac Toe' }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  splashText: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 24,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  spinner: {
    marginTop: 10,
  },
});