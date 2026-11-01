import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatFloat } from '../../math/evaluator';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../theme/typography';
import { RootFindingResult } from '../../types/rootFinding';
import { CodeBlock } from '../common/CodeBlock';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

interface RootResultsProps {
  result: RootFindingResult;
}

export const RootResults: React.FC<RootResultsProps> = ({ result }) => {
  const { colors } = useTheme();
  const rootStr =
    result.root !== null ? formatFloat(result.root, 6) : 'N/A';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Solution Hero Box */}
      <View style={[styles.heroBubble, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.solutionTag, { color: colors.primary }]}>RESULT</Text>
          <StatusBadge status={result.status} />
        </View>

        <Text style={[styles.rootLabel, { color: colors.textSecondary }]}>Root Value (x*)</Text>
        <Text style={[styles.rootValue, { color: colors.primary }]}>{rootStr}</Text>

        <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>
          {result.statusMessage}
        </Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <MetricCard
          label="Steps Taken"
          value={result.totalIterations}
          accentColor={colors.primary}
          style={styles.metricItem}
        />
        <MetricCard
          label="Time"
          value={result.executionTimeMs}
          unit="ms"
          accentColor={colors.secondary}
          style={styles.metricItem}
        />
        <MetricCard
          label="Method"
          value={result.method.toUpperCase()}
          accentColor={colors.accent}
          style={styles.metricItem}
        />
      </View>

      {/* Evaluated Equation */}
      <CodeBlock
        title="Evaluated Formula"
        code={`f(x) = ${result.parsedFunction}`}
      />

      {result.parsedDerivative && (
        <CodeBlock
          title="Derivative f'(x)"
          code={`f'(x) = ${result.parsedDerivative}`}
        />
      )}
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
  rootLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  rootValue: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: Typography.mono.fontFamily,
    marginBottom: 6,
  },
  statusMessage: {
    fontSize: 12,
    lineHeight: 16,
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
