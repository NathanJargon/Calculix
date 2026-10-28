import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
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
  accentColor = Colors.accentCyan,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={[Typography.label, styles.label]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text
          style={[Typography.monoBold, styles.value, { color: accentColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
        {unit && <Text style={[Typography.monoSm, styles.unit]}>{unit}</Text>}
      </View>
      {subtext && <Text style={[Typography.bodySm, styles.subtext]}>{subtext}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    flex: 1,
    minWidth: 100,
  },
  label: {
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 16,
    letterSpacing: -0.3,
  },
  unit: {
    color: Colors.textMuted,
    marginLeft: 4,
  },
  subtext: {
    color: Colors.textMuted,
    marginTop: 4,
    fontSize: 11,
  },
});
