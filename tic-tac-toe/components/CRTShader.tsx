import { StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  crtOverlay: {
    ...absoluteFill,
    pointerEvents: 'none',
    zIndex: 1000,
  },
});

export function CRTShader() {
  const { crtEnabled, colors } = useTheme();

  const overlay = [
    {
      ...absoluteFill,
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        ${colors.scanline} 2px,
        ${colors.scanline} 4px
      )`,
      pointerEvents: 'none' as const,
      opacity: crtEnabled ? 1 : 0,
    },
    {
      ...absoluteFill,
      backgroundImage: `radial-gradient(ellipse at center, transparent 50%, ${colors.vignette} 100%)`,
      pointerEvents: 'none' as const,
      opacity: crtEnabled ? 1 : 0,
    },
  ];

  return { crtEnabled, overlay };
}

export const useCRTStyles = CRTShader;

// Web-specific CRT styles (CSS custom properties)
export const webCRTStyles = `
:root {
  --crt-scanline-color: rgba(0, 255, 136, 0.08);
  --crt-vignette-color: rgba(0, 0, 0, 0.6);
}

.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.crt-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--crt-scanline-color) 2px,
    var(--crt-scanline-color) 4px
  );
  opacity: 1;
  animation: scanline-flicker 0.15s infinite linear;
}

.crt-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    var(--crt-vignette-color) 100%
  );
  border-radius: 20px;
  box-shadow:
    inset 0 0 60px var(--crt-vignette-color),
    inset 0 0 100px var(--crt-vignette-color);
  opacity: 1;
}

@keyframes scanline-flicker {
  0% { opacity: 1; }
  50% { opacity: 0.95; }
  100% { opacity: 1; }
}

.crt-curvature {
  border-radius: 20px;
  overflow: hidden;
}
`;
