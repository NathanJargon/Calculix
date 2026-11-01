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
    fontFamily: FontFamily.sansMedium,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 15,
    fontWeight: '600',
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
    fontWeight: '500',
  },
  monoSm: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '500',
  },
  monoBold: {
    fontFamily: FontFamily.mono,
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
};
