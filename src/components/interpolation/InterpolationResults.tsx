import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatFloat } from '../../math/evaluator';
import { Colors } from '../../theme/colors';
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
  const yValStr =
    result.interpolatedY !== null ? formatFloat(result.interpolatedY, 6) : 'N/A';
  const degree = result.points.length > 0 ? result.points.length - 1 : 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[Typography.label, styles.subHeading]}>
            EVALUATED VALUE AT x* = {formatFloat(result.targetX, 4)}
          </Text>
          <Text style={[Typography.monoBold, styles.resultValue]}>
            y* = {yValStr}
          </Text>
        </View>
        <StatusBadge status={result.status} />
      </View>

      {/* Error message if any */}
      {result.errorMessage && (
        <View style={styles.errorBox}>
          <Text style={[Typography.monoSm, styles.errorText]}>
            {result.errorMessage}
          </Text>
        </View>
      )}

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <MetricCard
          label="POLY DEGREE"
          value={`n = ${degree}`}
          accentColor={Colors.accentViolet}
          style={styles.metricItem}
        />
        <MetricCard
          label="DATA POINTS"
          value={result.points.length}
          accentColor={Colors.accentCyan}
          style={styles.metricItem}
        />
        <MetricCard
          label="CALC TIME"
          value={result.executionTimeMs}
          unit="ms"
          accentColor={Colors.accentTeal}
          style={styles.metricItem}
        />
      </View>

      {/* Final Polynomial Representation */}
      {result.polynomialString ? (
        <CodeBlock
          title="INTERPOLATING POLYNOMIAL REPRESENTATION"
          code={result.polynomialString}
          language={result.method === 'newton-divided' ? "NEWTON P(x)" : "LAGRANGE P(x)"}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subHeading: {
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    color: Colors.accentEmerald,
    fontSize: 20,
    letterSpacing: -0.5,
  },
  errorBox: {
    backgroundColor: '#88133725',
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentRose,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  errorText: {
    color: Colors.accentRose,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  metricItem: {
    flex: 1,
    minWidth: 0,
  },
});
