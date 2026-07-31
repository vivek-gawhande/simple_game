import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { DifficultySelector } from '@/components/DifficultySelector';
import { CRTShader } from '@/components/CRTShader';
import { useTheme, useSettings, useGameLogic } from '@/hooks';
import { GRID_SIZES, SYMBOLS, DIFFICULTIES, type Difficulty, type GridSize, DIFFICULTY_LABELS } from '@/utils/constants';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, theme: currentTheme, toggleCRT, setTheme } = useTheme();
  const { soundEnabled, hapticsEnabled, crtEnabled, toggleSound, toggleHaptics, toggleCRT: toggleCRTSetting } = useSettings();
  const { gridSize, vsAI, difficulty, setGridSize, setVsAI, setDifficulty } = useGameLogic();
  const crtStyles = CRTShader();

  const handleBack = () => {
    router.back();
  };

  const handleThemeToggle = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleGridSizeChange = (size: GridSize) => {
    setGridSize(size);
  };

  const handleVsAIToggle = () => {
    setVsAI(!vsAI);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={colors.bg === '#1a1a2e' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      <View style={styles.header}>
        <PixelButton variant="ghost" size="sm" onPress={handleBack} title="BACK" />
        <Text style={[styles.title, { color: colors.fg }]}>SETTINGS</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.crtOverlay} pointerEvents="none" />

        <View style={[styles.section, { borderColor: colors.grid }]}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>DISPLAY</Text>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.fg }]}>THEME</Text>
            <PixelButton
              variant={currentTheme === 'dark' ? 'primary' : 'secondary'}
              size="sm"
              onPress={handleThemeToggle}
              title={currentTheme.toUpperCase()}
              style={{ minWidth: 80 }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.fg }]}>CRT EFFECT</Text>
            <Switch
              value={crtEnabled}
              onValueChange={toggleCRT}
              trackColor={{ true: colors.xColor, false: colors.grid }}
              thumbColor={colors.fg}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.fg }]}>GRID SIZE</Text>
            <View style={styles.gridSizeButtons}>
              {GRID_SIZES.map((size) => (
                <PixelButton
                  key={size}
                  title={`${size}×${size}`}
                  variant={gridSize === size ? 'primary' : 'secondary'}
                  size="sm"
                  onPress={() => handleGridSizeChange(size)}
                  style={{ minWidth: 60, flex: 1 }}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.section, { borderColor: colors.grid }]}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>GAMEPLAY</Text>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.fg }]}>VS AI MODE</Text>
            <Switch
              value={vsAI}
              onValueChange={handleVsAIToggle}
              trackColor={{ true: colors.xColor, false: colors.grid }}
              thumbColor={colors.fg}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.fg }]}>AI DIFFICULTY</Text>
            <DifficultySelector
              selected={difficulty}
              onChange={(d: Difficulty) => setDifficulty(d)}
              compact
            />
          </View>
        </View>

        <View style={[styles.section, { borderColor: colors.grid }]}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>AUDIO & HAPTICS</Text>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.fg }]}>SOUND EFFECTS</Text>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ true: colors.xColor, false: colors.grid }}
              thumbColor={colors.fg}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.fg }]}>HAPTIC FEEDBACK</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ true: colors.xColor, false: colors.grid }}
              thumbColor={colors.fg}
            />
          </View>
        </View>

        <View style={[styles.section, { borderColor: colors.accent }]}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>ABOUT</Text>
          <View style={styles.aboutText}>
            <Text style={[styles.aboutLine, { color: colors.fgDim }]}>TIC TAC TOE RETRO EDITION</Text>
            <Text style={[styles.aboutLine, { color: colors.fgDim }]}>BUILT WITH EXPO + REACT NATIVE</Text>
            <Text style={[styles.aboutLine, { color: colors.fgDim }]}>PRESS START 2P FONT BY GOOGLE FONTS</Text>
            <Text style={[styles.aboutLine, { color: colors.fgDim }]}>CHIPTUNE SFX • CRT SHADER</Text>
            <Text style={[styles.aboutLine, { color: colors.fgDim }]}>DEPLOYABLE TO WEB, IOS, ANDROID</Text>
            <Text style={[styles.aboutLine, { color: colors.fgDim }]}>VERSION 1.0.0 • OPEN SOURCE</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
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
  section: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 0,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabel: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gridSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  aboutText: {
    gap: 4,
  },
  aboutLine: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});