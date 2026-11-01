import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TabOption, TabSelector } from '../components/common/TabSelector';
import { IterationTable } from '../components/rootFinding/IterationTable';
import { RootInputForm } from '../components/rootFinding/RootInputForm';
import { RootResults } from '../components/rootFinding/RootResults';
import { solveRoot } from '../math/rootFinding';
import { useTheme } from '../theme/ThemeContext';
import {
  RootFindingInput,
  RootFindingResult,
  RootMethodType,
} from '../types/rootFinding';

const METHOD_OPTIONS: TabOption<RootMethodType>[] = [
  { id: 'bisection', label: 'Bisection', badge: 'Guaranteed' },
  { id: 'newton', label: 'Newton', badge: 'Fast' },
  { id: 'secant', label: 'Secant', badge: 'Flexible' },
  { id: 'fixed-point', label: 'Fixed-Point', badge: 'Formula' },
];

const METHOD_DESCRIPTIONS: Record<RootMethodType, string> = {
  bisection:
    'Reliable interval halving method. Finds the root between start (a) and end (b) where the curve crosses zero.',
  newton:
    'High-speed tangent method. Uses the slope of the curve to rapidly converge to the root in just a few steps.',
  secant:
    'Quick slope approximation using two test guesses. Faster than bisection and does not require manual derivatives.',
  'fixed-point':
    'Iterative method that rewrites f(x) = 0 into x = g(x) and steps toward the intersection point.',
};

export const RootFindingScreen: React.FC = () => {
  const { colors } = useTheme();

  const [input, setInput] = useState<RootFindingInput>({
    method: 'bisection',
    functionStr: 'x^3 - x - 2',
    a: 1,
    b: 2,
    x0: 2,
    x1: 2.5,
    gFunctionStr: '(x + 2)^(1/3)',
    tolerance: 1e-6,
    maxIterations: 50,
  });

  const [isSolving, setIsSolving] = useState(false);
  const [result, setResult] = useState<RootFindingResult | null>(() =>
    solveRoot({
      method: 'bisection',
      functionStr: 'x^3 - x - 2',
      a: 1,
      b: 2,
      tolerance: 1e-6,
      maxIterations: 50,
    })
  );

  const handleMethodChange = (newMethod: RootMethodType) => {
    let updated: RootFindingInput = { ...input, method: newMethod };

    if (newMethod === 'bisection' && (updated.a === undefined || updated.b === undefined)) {
      updated.functionStr = 'x^3 - x - 2';
      updated.a = 1;
      updated.b = 2;
    } else if (newMethod === 'newton' && updated.x0 === undefined) {
      updated.functionStr = 'x^3 - 2*x - 5';
      updated.x0 = 2;
    } else if (newMethod === 'secant' && (updated.x0 === undefined || updated.x1 === undefined)) {
      updated.functionStr = 'x^3 - 2*x - 5';
      updated.x0 = 1;
      updated.x1 = 2;
    } else if (newMethod === 'fixed-point' && !updated.gFunctionStr) {
      updated.functionStr = 'x^3 - 2*x - 5';
      updated.gFunctionStr = '(2*x + 5)^(1/3)';
      updated.x0 = 2;
    }

    setInput(updated);
    setResult(solveRoot(updated));
  };

  const handleSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      const res = solveRoot(input);
      setResult(res);
      setIsSolving(false);
    }, 16);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Method Segmented Selector */}
        <TabSelector
          options={METHOD_OPTIONS}
          selectedId={input.method}
          onSelect={handleMethodChange}
        />

        {/* Method Description Brief */}
        <View style={[styles.methodInfoBox, { backgroundColor: colors.secondaryLight, borderLeftColor: colors.secondary }]}>
          <Text style={[styles.methodInfoText, { color: colors.textSecondary }]}>
            {METHOD_DESCRIPTIONS[input.method]}
          </Text>
        </View>

        {/* Dynamic Inputs Form */}
        <RootInputForm
          input={input}
          onChange={(patch: Partial<RootFindingInput>) => setInput((prev: RootFindingInput) => ({ ...prev, ...patch }))}
          onSolve={handleSolve}
          isSolving={isSolving}
        />

        {/* Results Overview */}
        {result && <RootResults result={result} />}

        {/* Expandable Step-by-Step Iteration Table */}
        {result && result.iterations.length > 0 && (
          <IterationTable
            method={result.method}
            iterations={result.iterations}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 110,
  },
  methodInfoBox: {
    borderLeftWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  methodInfoText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});
