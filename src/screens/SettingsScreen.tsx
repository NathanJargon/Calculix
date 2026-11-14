import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import packageJson from '../../package.json';
import { clearCalculationHistory } from '../services/historyService';
import { useTheme } from '../theme/ThemeContext';

const PUBLISHER_URL = 'https://play.google.com/store/apps/developer?id=GL_DVLP';
const CREATOR_URL = 'https://github.com/NathanJargon';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  const openExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to Open Link', url);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Visual greeting or header banner */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.avatarBox, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>C</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileTitle, { color: colors.textPrimary }]}>Calculix Pro</Text>
          <Text style={[styles.profileSubtitle, { color: colors.textSecondary }]}>
            High-Precision Numerical Engine
          </Text>
        </View>
      </View>

      {/* Appearance Section */}
      <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
        PREFERENCES
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              {isDark ? 'Dark background with high contrast' : 'Clean pastel light interface'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDark ? '#FFFFFF' : colors.primary}
          />
        </View>

        <View style={[styles.settingRow, styles.settingRowBorder, { borderTopColor: colors.borderLight }]}>
          <View style={styles.settingTextGroup}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              Replay Onboarding Tour
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Reset intro screens to show on next app launch
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.resetTourBtn, { backgroundColor: colors.primaryLight }]}
            onPress={async () => {
              try {
                await AsyncStorage.removeItem('has_seen_intro');
                Alert.alert('Tour Reset', 'The intro tour will show again the next time the app opens.');
              } catch {
                Alert.alert('Error', 'Could not reset the tour. Please try again.');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.resetTourText, { color: colors.primary }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.settingRow, styles.settingRowBorder, { borderTopColor: colors.borderLight }]}>
          <View style={styles.settingTextGroup}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              Clear Calculation History
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Remove all saved root-finding and interpolation runs
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.resetTourBtn, { backgroundColor: colors.secondaryLight }]}
            onPress={() => {
              Alert.alert('Clear History', 'Remove all saved calculation history?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: async () => {
                    await clearCalculationHistory();
                    Alert.alert('History Cleared', 'All saved calculations have been removed.');
                  },
                },
              ]);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.resetTourText, { color: colors.secondary }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Methods Supported */}
      <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
        BUILT-IN ALGORITHMS
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {[
          { name: 'Bisection Method', badge: 'Bracketing', color: colors.secondary },
          { name: 'Newton-Raphson', badge: 'Quadratic O(2)', color: colors.primary },
          { name: 'Secant Method', badge: 'Superlinear', color: colors.accent },
          { name: 'Fixed-Point Iteration', badge: 'Contraction', color: colors.success },
          { name: "Newton's Divided Difference", badge: 'Interpolation', color: colors.secondary },
          { name: 'Lagrange Polynomials', badge: 'Interpolation', color: colors.accent },
        ].map((item, idx, arr) => (
          <View
            key={idx}
            style={[
              styles.methodRow,
              idx < arr.length - 1 ? [styles.rowBorder, { borderBottomColor: colors.borderLight }] : null,
            ]}
          >
            <Text style={[styles.methodName, { color: colors.textPrimary }]}>{item.name}</Text>
            <View style={[styles.methodBadge, { backgroundColor: item.color + '18' }]}>
              <Text style={[styles.methodBadgeText, { color: item.color }]}>{item.badge}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Credits & Developers Section */}
      <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
        CREDITS & DEVELOPERS
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.creditRow, styles.rowBorder, { borderBottomColor: colors.borderLight }]}
          onPress={() => openExternalLink(PUBLISHER_URL)}
          activeOpacity={0.7}
        >
          <View style={styles.creditInfoGroup}>
            <Text style={[styles.creditRoleLabel, { color: colors.textMuted }]}>PUBLISHER</Text>
            <Text style={[styles.creditName, { color: colors.textPrimary }]}>GL_DVLP</Text>
            <Text style={[styles.creditUrlText, { color: colors.textSecondary }]}>
              play.google.com/store/apps/developer?id=GL_DVLP
            </Text>
          </View>
          <View style={[styles.creditLinkPill, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.creditLinkPillText, { color: colors.primary }]}>Google Play →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.creditRow}
          onPress={() => openExternalLink(CREATOR_URL)}
          activeOpacity={0.7}
        >
          <View style={styles.creditInfoGroup}>
            <Text style={[styles.creditRoleLabel, { color: colors.textMuted }]}>CREATOR & LEAD DEVELOPER</Text>
            <Text style={[styles.creditName, { color: colors.textPrimary }]}>MMotsu</Text>
            <Text style={[styles.creditUrlText, { color: colors.textSecondary }]}>
              github.com/NathanJargon
            </Text>
          </View>
          <View style={[styles.creditLinkPill, { backgroundColor: colors.secondaryLight }]}>
            <Text style={[styles.creditLinkPillText, { color: colors.secondary }]}>GitHub →</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* About Info */}
      <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
        SYSTEM INFO
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.infoRow, styles.rowBorder, { borderBottomColor: colors.borderLight }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>App Name</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>Calculix</Text>
        </View>
        <View style={[styles.infoRow, styles.rowBorder, { borderBottomColor: colors.borderLight }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{packageJson.version} (Release)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Math Core</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>MathJS / Hermesc</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  profileSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 6,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingRowBorder: {
    borderTopWidth: 1,
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  resetTourBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  resetTourText: {
    fontSize: 12,
    fontWeight: '800',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
  },
  methodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  creditInfoGroup: {
    flex: 1,
    paddingRight: 12,
  },
  creditRoleLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  creditName: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  creditUrlText: {
    fontFamily: 'monospace',
    fontSize: 11,
    marginTop: 2,
  },
  creditLinkPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  creditLinkPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});
