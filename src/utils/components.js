// Standart Bileşen Stilleri ve Yardımcı Fonksiyonlar

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from './theme';

/**
 * Standart Page Container Stili
 * Tüm sayfalar için temel SafeAreaView stili
 */
export const pageStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
});

/**
 * Standart Header Stilleri
 * Page başlıkları, başlık bar vb.
 */
export const headerStyles = StyleSheet.create({
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  headerSubtitle: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.sm,
  },
});

/**
 * Standart Button Stilleri
 */
export const buttonStyles = StyleSheet.create({
  primary: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  secondary: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});

/**
 * Standart Input Stilleri
 */
export const inputStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    fontSize: TYPOGRAPHY.size.base,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
});

/**
 * Standart Card Stilleri
 */
export const cardStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  cardHighlight: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },
  cardSuccess: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successBg,
  },
});

/**
 * Standart Text Stilleri
 */
export const textStyles = StyleSheet.create({
  heading1: {
    fontSize: TYPOGRAPHY.size['3xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  heading2: {
    fontSize: TYPOGRAPHY.size['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  heading3: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.text,
  },
  body: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.text,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  error: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  success: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.success,
    marginTop: SPACING.xs,
  },
});

/**
 * Standart State Stilleri (Loading, Error, Empty)
 */
export const stateStyles = StyleSheet.create({
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

/**
 * Standart Row Stili (Key-Value gösterimi)
 */
export const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  rowLabel: {
    flex: 0.3,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  rowValue: {
    flex: 0.7,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
});

/**
 * Standart Alert/Banner Stilleri
 */
export const alertStyles = StyleSheet.create({
  alertSuccess: {
    borderWidth: 1,
    borderColor: COLORS.success,
    backgroundColor: COLORS.successBg,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  alertError: {
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  alertWarning: {
    borderWidth: 1,
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warningBg,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  alertText: {
    fontWeight: TYPOGRAPHY.weight.semibold,
    fontSize: TYPOGRAPHY.size.sm,
  },
  alertSuccessText: {
    color: '#166534',
  },
  alertErrorText: {
    color: '#991b1b',
  },
  alertWarningText: {
    color: '#92400e',
  },
});
