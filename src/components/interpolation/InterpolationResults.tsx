import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatFloat } from '../../math/evaluator';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../theme/typography';
import { InterpolationResult } from '../../types/interpolation';
import { CodeBlock } from '../common/CodeBlock';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

interface InterpolationResultsProps {
  result: InterpolationResult;
}

export const InterpolationResults: React.FC<InterpolationResultsProps> = ({
  result,
}) => {
  const { colors } = useTheme();
  const yValStr =
    result.interpolatedY !== null ? formatFloat(result.interpolatedY, 6) : 'N/A';
  const degree = result.points.length > 0 ? result.points.length - 1 : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Solution Hero Box */}
      <View style={[styles.heroBubble, { backgroundColor: colors.secondaryLight, borderColor: colors.secondary }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.solutionTag, { color: colors.secondary }]}>ESTIMATED VALUE</Text>
          <StatusBadge status={result.status} />
        </View>

        <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>
          At x* = {formatFloat(result.targetX, 4)}:
        </Text>
        <Text style={[styles.resultValue, { color: colors.secondary }]}>y* = {yValStr}</Text>

        {result.errorMessage && (
          <Text style={[styles.errorText, { color: colors.error }]}>{result.errorMessage}</Text>
        )}
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <MetricCard
          label="Poly Degree"
          value={`n = ${degree}`}
          accentColor={colors.accent}
          style={styles.metricItem}
        />
        <MetricCard
          label="Data Points"
          value={result.points.length}
          accentColor={colors.secondary}
          style={styles.metricItem}
        />
        <MetricCard
          label="Time"
          value={result.executionTimeMs}
          unit="ms"
          accentColor={colors.primary}
          style={styles.metricItem}
        />
      </View>

      {/* Final Polynomial Representation */}
      {result.polynomialString ? (
        <CodeBlock
          title="Fitted Curve Polynomial P(x)"
          code={result.polynomialString}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  heroBubble: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  solutionTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: Typography.mono.fontFamily,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  metricItem: {
    flex: 1,
  },
});
