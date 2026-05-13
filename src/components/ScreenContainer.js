import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

/**
 * ScreenContainer - Standart Sayfa Layout Bileşeni
 * 
 * Özellikler:
 * - Başlık ve alt başlık
 * - Scroll enable/disable seçeneği
 * - Standart padding ve renk
 * 
 * Kullanım:
 * <ScreenContainer title="Başlık" subtitle="Alt başlık" scrollable>
 *   <Content />
 * </ScreenContainer>
 */
export function ScreenContainer({ 
  title, 
  subtitle, 
  children,
  scrollable = true,
  backgroundColor = COLORS.slate50
}) {
  const contentView = (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {scrollable ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {contentView}
        </ScrollView>
      ) : (
        contentView
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate50,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.size['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subtitle: {
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: 20,
  },
});
