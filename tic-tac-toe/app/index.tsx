import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { PixelButton } from '@/components/PixelButton';
import { CRTShader } from '@/components/CRTShader';
import { GRID_SIZES, DIFFICULTY_LABELS } from '@/utils/constants';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const crtStyles = CRTShader();

  const navigate = (mode: 'classic' | '4x4' | '5x5' | 'ai') => {
    const routes = {
      classic: '/game/classic',
      '4x4': '/game/grid-4x4',
      '5x5': '/game/grid-5x5',
      ai: '/game/ai',
    };
    router.push(routes[mode] as any);
  };

  const { width } = Dimensions.get('window');
  const buttonWidth = Math.min(width - 40, 320);
  const titleFontSize = Math.max(14, Math.min(28, Math.floor((width - 40) / 11)));
  const titleLetterSpacing = titleFontSize > 20 ? 6 : titleFontSize > 16 ? 3 : 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.crtOverlay} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.fg,
                fontSize: titleFontSize,
                letterSpacing: titleLetterSpacing,
                lineHeight: titleFontSize * 1.4,
              },
            ]}
          >
            TIC TAC TOE
          </Text>
          <Text style={[styles.subtitle, { color: colors.fgDim }]}>RETRO EDITION</Text>
        </View>

        <View style={[styles.modeCard, { borderColor: colors.grid }]}>
          <Text style={[styles.modeTitle, { color: colors.accent }]}>HUMAN VS HUMAN</Text>
          <View style={styles.buttonGrid}>
            <PixelButton
              title="CLASSIC 3×3"
              variant="primary"
              size="lg"
              onPress={() => navigate('classic')}
              style={{ width: buttonWidth }}
            />
            <PixelButton
              title="4×4 GRID"
              variant="secondary"
              size="lg"
              onPress={() => navigate('4x4')}
              style={{ width: buttonWidth }}
            />
            <PixelButton
              title="5×5 GRID"
              variant="secondary"
              size="lg"
              onPress={() => navigate('5x5')}
              style={{ width: buttonWidth }}
            />
          </View>
        </View>

        <View style={[styles.modeCard, { borderColor: colors.grid }]}>
          <Text style={[styles.modeTitle, { color: colors.accent }]}>VS AI</Text>
          <PixelButton
            title="PLAY VS AI"
            variant="danger"
            size="lg"
            onPress={() => navigate('ai')}
            style={{ width: buttonWidth }}
          />
        </View>

        <View style={[styles.modeCard, { borderColor: colors.grid }]}>
          <Text style={[styles.modeTitle, { color: colors.fgDim }]}>SETTINGS</Text>
          <PixelButton
            title="CUSTOMIZE"
            variant="ghost"
            size="lg"
            onPress={() => router.push('/settings')}
            style={{ width: buttonWidth }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.fgDim }]}>PRESS START 2P FONT</Text>
          <Text style={[styles.footerText, { color: colors.fgDim }]}>CHIPTUNE SFX • CRT EFFECTS</Text>
          <Text style={[styles.footerText, { color: colors.fgDim }]}>EXPO • REACT NATIVE • VERCEL</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 24,
  },
  crtOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  title: {
    fontFamily: 'PressStart2P-Regular',
    width: '100%',
    textTransform: 'uppercase',
    textAlign: 'center',
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: -4,
    textAlign: 'center',
  },
  modeCard: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 0,
    gap: 16,
  },
  modeTitle: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonGrid: {
    gap: 12,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});