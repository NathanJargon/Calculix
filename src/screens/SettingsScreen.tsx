import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Visual greeting or header banner like profile in mock */}
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
            thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
          />
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
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>1.0.0 (Release)</Text>
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

