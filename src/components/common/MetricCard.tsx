import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../theme/typography';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  accentColor?: string;
  style?: ViewStyle;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  accentColor,
  style,
}) => {
  const { colors } = useTheme();
  const highlightColor = accentColor || colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }, style]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text
          style={[Typography.monoBold, styles.value, { color: highlightColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
        {unit && <Text style={[styles.unit, { color: colors.textMuted }]}>{unit}</Text>}
      </View>
      {subtext && <Text style={[styles.subtext, { color: colors.textMuted }]}>{subtext}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flex: 1,
    minWidth: 90,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 18,
    fontWeight: '900',
  },
  unit: {
    fontSize: 11,
    marginLeft: 3,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 11,
    marginTop: 2,
  },
});
