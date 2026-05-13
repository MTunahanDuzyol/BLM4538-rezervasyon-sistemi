import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { isLoggedIn, getAuthUser } from '../services/authSession';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { cardStyles, textStyles, alertStyles, buttonStyles } from '../utils/components';

/**
 * AdminPage - Yönetici Paneli
 * 
 * Özellikler:
 * - Admin kontrol etme
 * - Yönetim işlemleri
 * - Sistem bilgileri
 * 
 * Not: Bu sayfa Admin rolü ile giriş yapan kullanıcılara kısıtlıdır.
 */
export function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) return;

    const currentUser = getAuthUser();
    setUser(currentUser);

    // Admin kontrolü
    const userRole = currentUser?.rol || currentUser?.role || '';
    const isAdminUser = userRole.toLowerCase() === 'admin' || 
                       userRole.toLowerCase() === 'administrator' ||
                       currentUser?.isAdmin === true;
    
    setIsAdmin(isAdminUser);
  }, []);

  if (!isLoggedIn()) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.blockedWrap}>
          <Text style={textStyles.body}>Lütfen önce oturum açın.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenContainer title="Yönetici Paneli" subtitle="Admin erişimi gereklidir.">
          <View style={[alertStyles.alertError, { marginBottom: SPACING.lg }]}>
            <Text style={[alertStyles.alertText, alertStyles.alertErrorText]}>
              Bu alana erişmek için admin yetkisi gereklidir.
            </Text>
          </View>
          <View style={cardStyles.card}>
            <Text style={textStyles.body}>
              Eğer admin olmanız gerekiyorsa, sistem yöneticisine iletişim kurunuz.
            </Text>
          </View>
          <HomeReturnButton />
        </ScreenContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Yönetici Paneli</Text>
          <Text style={styles.headerSubtitle}>Sistem yönetim işlemleri</Text>
        </View>

        {/* Admin Bilgileri */}
        <View style={cardStyles.card}>
          <Text style={styles.sectionTitle}>Admin Bilgileri</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ad-Soyad:</Text>
            <Text style={styles.infoValue}>{user?.adSoyad || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-posta:</Text>
            <Text style={styles.infoValue}>{user?.email || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rol:</Text>
            <Text style={styles.infoValue}>{user?.rol || 'Admin'}</Text>
          </View>
        </View>

        {/* Yönetim İşlemleri */}
        <View style={cardStyles.card}>
          <Text style={styles.sectionTitle}>Yönetim İşlemleri</Text>
          <AdminAction 
            title="Kullanıcıları Yönet" 
            subtitle="Kullanıcı listesi, roller, yetkiler"
            icon=""
            disabled={true}
          />
          <AdminAction 
            title="Sistem Ayarları" 
            subtitle="Genel sistem konfigürasyonu"
            icon=""
            disabled={true}
          />
          <AdminAction 
            title="Raporlar" 
            subtitle="Kullanım raporları ve istatistikler"
            icon=""
            disabled={true}
          />
          <AdminAction 
            title="Günlükler" 
            subtitle="Sistem aktivite günlükleri"
            icon=""
            disabled={true}
          />
        </View>

        {/* Sistem Durumu */}
        <View style={cardStyles.card}>
          <Text style={styles.sectionTitle}>Sistem Durumu</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusDot}></Text>
            <View style={styles.statusContent}>
              <Text style={textStyles.body}>Backend Servisi</Text>
              <Text style={textStyles.bodySmall}>Aktif</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusDot}></Text>
            <View style={styles.statusContent}>
              <Text style={textStyles.body}>Veritabanı</Text>
              <Text style={textStyles.bodySmall}>Bağlı</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusDot}></Text>
            <View style={styles.statusContent}>
              <Text style={textStyles.body}>Cache</Text>
              <Text style={textStyles.bodySmall}>Optimize edilmiş</Text>
            </View>
          </View>
        </View>

        {/* Bilgilendirme */}
        <View style={[alertStyles.alertInfo, { marginBottom: SPACING.lg }]}>
          <Text style={[alertStyles.alertText]}>
            Açık olmayan menüler yakında hizmete girecektir. Temel sistem bilgilerini buradan görebilirsiniz.
          </Text>
        </View>

        <HomeReturnButton />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Admin İşlemi Kartı
 */
function AdminAction({ title, subtitle, icon, disabled = false }) {
  return (
    <Pressable 
      style={[
        styles.actionCard,
        disabled && styles.actionCardDisabled
      ]}
      disabled={disabled}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <View style={styles.actionContent}>
        <Text style={[textStyles.body, { fontWeight: TYPOGRAPHY.weight.semibold }]}>
          {title}
        </Text>
        <Text style={textStyles.bodySmall}>{subtitle}</Text>
      </View>
      <Text style={styles.actionArrow}>{disabled ? '' : '→'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weight.semibold,
    fontSize: TYPOGRAPHY.size.sm,
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.weight.medium,
    fontSize: TYPOGRAPHY.size.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
  },
  actionCardDisabled: {
    opacity: 0.6,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actionContent: {
    flex: 1,
  },
  actionArrow: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  statusDot: {
    fontSize: 14,
    marginRight: SPACING.md,
  },
  statusContent: {
    flex: 1,
  },
  blockedWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
});
