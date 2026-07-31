import { Audio } from 'expo-av';
import { useCallback } from 'react';
import { useGameStore } from './useGameStore';

const SOUND_FILES = {
  move: require('../assets/sounds/move.wav'),
  win: require('../assets/sounds/win.wav'),
  draw: require('../assets/sounds/draw.wav'),
  click: require('../assets/sounds/click.wav'),
};

export type SoundKey = keyof typeof SOUND_FILES;

const soundPool = new Map<SoundKey, Audio.Sound[]>();
const MAX_POOL_SIZE = 4;

export async function preloadSounds() {
  await Promise.all(
    Object.entries(SOUND_FILES).map(async ([key, source]) => {
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
      soundPool.set(key as SoundKey, [sound]);
    })
  );
}

export function playSound(key: SoundKey, enabled: boolean) {
  if (!enabled) return;

  const pool = soundPool.get(key);
  if (!pool) return;

  // Round-robin: expo-av doesn't expose an easy "is this sound busy" check,
  // so we just replay the first sound in the pool.
  const sound = pool[0];

  if (!sound && pool.length < MAX_POOL_SIZE) {
    Audio.Sound.createAsync(SOUND_FILES[key]).then(({ sound: newSound }) => {
      pool.push(newSound);
    });
    return;
  }

  if (sound) {
    sound.replayAsync().catch(() => {});
  }
}

export function useSound() {
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  return useCallback((key: SoundKey) => playSound(key, soundEnabled), [soundEnabled]);
}
