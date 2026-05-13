// Design System - Renkler, Spacing ve Stil Sabitleri

export const COLORS = {
  // Primary
  primary: '#6B998B',
  primaryLight: '#94b8ad',
  primaryDark: '#4a6b63',

  // Semantic Colors
  success: '#86efac',
  successBg: '#f0fdf4',
  error: '#b91c1c',
  errorBg: '#fef2f2',
  warning: '#fbbf24',
  warningBg: '#fffbeb',
  info: '#93c5fd',
  infoBg: '#eff6ff',

  // Neutral
  white: '#ffffff',
  black: '#000000',
  
  // Grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Slate (used in designs)
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',

  // Specific Usage
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  border: '#d1d5db',
  borderLight: '#e5e7eb',
  text: '#0f172a',
  textSecondary: '#64748b',
  textTertiary: '#9ca3af',
  divider: '#dbe4df',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const TYPOGRAPHY = {
  // Font Sizes
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  // Font Weights
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 10,
  lg: 12,
  full: 9999,
};

export const SHADOWS = {
  none: 'none',
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
};
