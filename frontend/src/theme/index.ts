import { Platform } from 'react-native';

/**
 * "Frequency" theme.
 *
 * Concept: the app looks and feels like a signal being transmitted and
 * received, rather than a generic bubble-chat skin. Deep petrol background
 * instead of pure black, a warm coral accent for outgoing signal, amber for
 * live/utility readouts (timestamps, presence). Monospace is reserved for
 * anything that reads like data (timestamps, connection status) — display
 * type stays geometric and confident everywhere else.
 */

export const colors = {
  bgDeep: '#0E2A2E', // app background — deep petrol, not black
  bgPanel: '#123338', // header / nav surfaces
  surfaceIncoming: '#1B454B', // incoming message bubble
  surfaceInput: '#153A3F', // text input field
  accent: '#FF6B4A', // coral — outgoing bubble, primary CTA, "your signal"
  accentSecondary: '#F2C14E', // amber — live indicators, timestamps, ticks
  textPrimary: '#F3FAF8',
  textSecondary: '#8FB8B4',
  textOnAccent: '#1B1008',
  divider: 'rgba(243, 250, 248, 0.08)',
  danger: '#FF7A6E',
  online: '#3DDC97',
};

export const fonts = {
  // Loaded via @expo-google-fonts/space-grotesk in App.tsx
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'SpaceGrotesk_400Regular',
  // Data / readout text — timestamps, connection status, ticks.
  mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 6,
  md: 14,
  lg: 22,
  pill: 999,
};

export const theme = { colors, fonts, spacing, radii };
export type Theme = typeof theme;
