import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export const LoadingSplash: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.centerBox}>
        {/* Minimal Monogram Brand Pill */}
        <View style={[styles.logoBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Text style={[styles.logoText, { color: colors.primary }]}>C</Text>
        </View>

        <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>Calculix</Text>
        <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
          High-Precision Numerical Engine
        </Text>

        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  spinnerContainer: {
    marginTop: 28,
  },
});
