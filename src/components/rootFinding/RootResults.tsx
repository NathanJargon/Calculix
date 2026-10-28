import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatFloat } from '../../math/evaluator';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { RootFindingResult } from '../../types/rootFinding';
import { CodeBlock } from '../common/CodeBlock';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

interface RootResultsProps {
  result: RootFindingResult;
}

export const RootResults: React.FC<RootResultsProps> = ({ result }) => {
  const rootStr =
    result.root !== null ? formatFloat(result.root, 8) : 'N/A';

  return (
    <View style={styles.card}>
      {/* Header with status */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[Typography.label, styles.subHeading]}>
            NUMERICAL SOLUTION
          </Text>
          <Text style={[Typography.monoBold, styles.rootValue]}>
            x* = {rootStr}
          </Text>
        </View>
        <StatusBadge status={result.status} />
      </View>

      {/* Status Detail Note */}
      <View style={styles.statusBox}>
        <Text style={[Typography.monoSm, styles.statusMessage]}>
          {result.statusMessage}
        </Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <MetricCard
          label="ITERATIONS"
          value={result.totalIterations}
          accentColor={Colors.accentCyan}
          style={styles.metricItem}
        />
        <MetricCard
          label="EXEC TIME"
          value={result.executionTimeMs}
          unit="ms"
          accentColor={Colors.accentViolet}
          style={styles.metricItem}
        />
        <MetricCard
          label="METHOD"
          value={result.method.toUpperCase()}
          accentColor={Colors.accentTeal}
          style={styles.metricItem}
        />
      </View>

      {/* Function and Derivative (if Newton) */}
      <CodeBlock
        title="OBJECTIVE FUNCTION"
        code={`f(x) = ${result.parsedFunction}`}
        language="EVAL"
      />

      {result.parsedDerivative && (
        <CodeBlock
          title="FIRST DERIVATIVE"
          code={`f'(x) = ${result.parsedDerivative}`}
          language="CALCULUS"
        />
      )}
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
  rootValue: {
    color: Colors.accentEmerald,
    fontSize: 20,
    letterSpacing: -0.5,
  },
  statusBox: {
    backgroundColor: Colors.surfaceLight,
    borderLeftWidth: 3,
    borderLeftColor: Colors.borderActive,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  statusMessage: {
    color: Colors.textSecondary,
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
