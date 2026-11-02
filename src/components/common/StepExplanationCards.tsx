import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatFloat } from '../../math/evaluator';
import { useTheme } from '../../theme/ThemeContext';
import {
  BisectionIteration,
  FixedPointIteration,
  NewtonIteration,
  RootIteration,
  RootMethodType,
  SecantIteration,
} from '../../types/rootFinding';

interface StepExplanationCardsProps {
  method: RootMethodType;
  iterations: RootIteration[];
  maxDisplay?: number;
}

export const StepExplanationCards: React.FC<StepExplanationCardsProps> = ({
  method,
  iterations,
  maxDisplay = 4,
}) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!iterations || iterations.length === 0) return null;

  const displayList = expanded ? iterations : iterations.slice(0, maxDisplay);

  const getStepDescription = (iter: RootIteration, stepNum: number) => {
    switch (method) {
      case 'bisection': {
        const item = iter as BisectionIteration;
        return `Step ${stepNum}: Calculated interval midpoint c = ${formatFloat(
          item.x_n,
          5
        )}. Evaluated f(c) = ${formatFloat(item.f_xn, 4)}. Error reduced to ±${formatFloat(
          item.absError,
          5
        )}.`;
      }
      case 'newton': {
        const item = iter as NewtonIteration;
        return `Step ${stepNum}: Current x = ${formatFloat(
          item.x_n,
          5
        )}. Tangent slope f'(x) = ${formatFloat(
          item.f_prime_xn,
          4
        )}. Stepped along tangent to next estimate x = ${formatFloat(item.x_next, 5)}.`;
      }
      case 'secant': {
        const item = iter as SecantIteration;
        return `Step ${stepNum}: Finite difference slope evaluated across points (${formatFloat(
          item.x_prev,
          4
        )}, ${formatFloat(item.x_n, 4)}). New root estimate is ${formatFloat(item.x_next, 5)}.`;
      }
      case 'fixed-point': {
        const item = iter as FixedPointIteration;
        return `Step ${stepNum}: Evaluated mapping function g(${formatFloat(
          item.x_n,
          4
        )}) = ${formatFloat(item.g_xn, 5)}. Next iteration point updated.`;
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Step-by-Step Walkthrough</Text>
        <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>Natural Steps</Text>
        </View>
      </View>

      <View style={styles.bubblesList}>
        {displayList.map((iter, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              {
                backgroundColor: idx === iterations.length - 1 ? colors.successLight : colors.surfaceSecondary,
                borderColor: idx === iterations.length - 1 ? colors.success : colors.border,
              },
            ]}
          >
            <Text style={[styles.bubbleStep, { color: colors.primary }]}>
              Step {iter.iteration}
            </Text>
            <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>
              {getStepDescription(iter, iter.iteration)}
            </Text>
          </View>
        ))}
      </View>

      {iterations.length > maxDisplay && (
        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, { color: colors.primary }]}>
            {expanded ? 'Show Less Steps' : `View All ${iterations.length} Steps ▾`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bubblesList: {
    gap: 10,
  },
  bubble: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  bubbleStep: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  toggleBtn: {
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
