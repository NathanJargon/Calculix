import { Platform, TextStyle } from 'react-native';

export const FontFamily = {
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  sansMedium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'sans-serif',
  }),
};

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: FontFamily.sans,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FontFamily.sans,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FontFamily.sans,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: FontFamily.sans,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySm: {
    fontFamily: FontFamily.sans,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  mono: {
    fontFamily: FontFamily.mono,
    fontSize: 13,
    fontWeight: '400',
  },
  monoSm: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '400',
  },
  monoBold: {
    fontFamily: FontFamily.mono,
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
};
