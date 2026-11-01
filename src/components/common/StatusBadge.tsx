import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ConvergenceStatus } from '../../types/rootFinding';

interface StatusBadgeProps {
  status: ConvergenceStatus | 'SUCCESS' | 'DUPLICATE_X' | 'INSUFFICIENT_POINTS' | 'ERROR';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  const { colors } = useTheme();

  const getBadgeConfig = () => {
    switch (status) {
      case 'CONVERGED':
      case 'SUCCESS':
        return {
          bg: colors.successLight,
          border: colors.success,
          text: colors.success,
          icon: '✓',
          label: 'Found Solution',
        };
      case 'MAX_ITERATIONS_REACHED':
        return {
          bg: colors.warningLight,
          border: colors.warning,
          text: colors.warning,
          icon: '⚠',
          label: 'Max Steps Reached',
        };
      case 'INVALID_BRACKET':
        return {
          bg: colors.errorLight,
          border: colors.error,
          text: colors.error,
          icon: '✕',
          label: 'Bracket Must Cross 0',
        };
      case 'DERIVATIVE_ZERO':
        return {
          bg: colors.errorLight,
          border: colors.error,
          text: colors.error,
          icon: '✕',
          label: "Slope Zero (f'=0)",
        };
      case 'DIVISION_BY_ZERO':
        return {
          bg: colors.errorLight,
          border: colors.error,
          text: colors.error,
          icon: '✕',
          label: 'Division by Zero',
        };
      case 'DIVERGED':
        return {
          bg: colors.errorLight,
          border: colors.error,
          text: colors.error,
          icon: '✕',
          label: 'Diverged',
        };
      case 'DUPLICATE_X':
        return {
          bg: colors.errorLight,
          border: colors.error,
          text: colors.error,
          icon: '✕',
          label: 'Duplicate x Values',
        };
      case 'INSUFFICIENT_POINTS':
        return {
          bg: colors.warningLight,
          border: colors.warning,
          text: colors.warning,
          icon: '⚠',
          label: 'Need ≥ 2 Points',
        };
      default:
        return {
          bg: colors.errorLight,
          border: colors.error,
          text: colors.error,
          icon: '✕',
          label: 'Computation Error',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <Text style={[styles.badgeIcon, { color: config.text }]}>{config.icon}</Text>
      <Text style={[styles.badgeText, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  badgeIcon: {
    fontSize: 11,
    fontWeight: '800',
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
