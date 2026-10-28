import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { ConvergenceStatus } from '../../types/rootFinding';

interface StatusBadgeProps {
  status: ConvergenceStatus | 'SUCCESS' | 'DUPLICATE_X' | 'INSUFFICIENT_POINTS' | 'ERROR';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'CONVERGED':
      case 'SUCCESS':
        return {
          bg: Colors.badgeSuccessBg,
          border: Colors.badgeSuccessBorder,
          text: Colors.badgeSuccessText,
          dotColor: Colors.accentEmerald,
          label: 'CONVERGED',
        };
      case 'MAX_ITERATIONS_REACHED':
        return {
          bg: Colors.badgeWarningBg,
          border: Colors.badgeWarningBorder,
          text: Colors.badgeWarningText,
          dotColor: Colors.accentAmber,
          label: 'MAX ITERATIONS',
        };
      case 'INVALID_BRACKET':
        return {
          bg: Colors.badgeErrorBg,
          border: Colors.badgeErrorBorder,
          text: Colors.badgeErrorText,
          dotColor: Colors.accentRose,
          label: 'INVALID BRACKET',
        };
      case 'DERIVATIVE_ZERO':
        return {
          bg: Colors.badgeErrorBg,
          border: Colors.badgeErrorBorder,
          text: Colors.badgeErrorText,
          dotColor: Colors.accentRose,
          label: "f'(x) = 0 (SINGULAR)",
        };
      case 'DIVISION_BY_ZERO':
        return {
          bg: Colors.badgeErrorBg,
          border: Colors.badgeErrorBorder,
          text: Colors.badgeErrorText,
          dotColor: Colors.accentRose,
          label: 'ZERO DIVISION',
        };
      case 'DIVERGED':
        return {
          bg: Colors.badgeErrorBg,
          border: Colors.badgeErrorBorder,
          text: Colors.badgeErrorText,
          dotColor: Colors.accentRose,
          label: 'DIVERGED',
        };
      case 'DUPLICATE_X':
        return {
          bg: Colors.badgeErrorBg,
          border: Colors.badgeErrorBorder,
          text: Colors.badgeErrorText,
          dotColor: Colors.accentRose,
          label: 'DUPLICATE X',
        };
      case 'INSUFFICIENT_POINTS':
        return {
          bg: Colors.badgeWarningBg,
          border: Colors.badgeWarningBorder,
          text: Colors.badgeWarningText,
          dotColor: Colors.accentAmber,
          label: 'POINTS NEEDED',
        };
      case 'PARSING_ERROR':
      case 'ERROR':
      default:
        return {
          bg: Colors.badgeErrorBg,
          border: Colors.badgeErrorBorder,
          text: Colors.badgeErrorText,
          dotColor: Colors.accentRose,
          label: 'ERROR',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, borderColor: config.border },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
      <Text style={[Typography.monoSm, styles.label, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.6,
  },
});
