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
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import {
  RootFindingInput,
  RootFindingResult,
  RootMethodType,
} from '../types/rootFinding';

const METHOD_OPTIONS: TabOption<RootMethodType>[] = [
  { id: 'bisection', label: 'BISECTION', badge: 'O(1)' },
  { id: 'newton', label: 'NEWTON-RAPHSON', badge: 'O(2)' },
  { id: 'secant', label: 'SECANT', badge: 'O(1.62)' },
  { id: 'fixed-point', label: 'FIXED-POINT', badge: 'g(x)' },
];

const METHOD_DESCRIPTIONS: Record<RootMethodType, string> = {
  bisection:
    'Guaranteed bracketing method. Requires continuous f(x) and an interval [a, b] where f(a)·f(b) < 0. Halves error interval each step.',
  newton:
    "Open tangent-line method. Achieves quadratic convergence rate (doubles accurate digits each step). Requires analytical or numerical derivative f'(x).",
  secant:
    "Open quasi-Newton method. Replaces analytical derivative with finite-difference slope across two initial estimates (x0, x1). Convergence order ~1.618.",
  'fixed-point':
    'Rewrites f(x) = 0 into x = g(x). Converges locally to fixed-point x* whenever |g\'(x)| < 1 (Lipschitz contraction mapping).',
};

export const RootFindingScreen: React.FC = () => {
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
    let updated = { ...input, method: newMethod };

    // Configure appropriate default sample values per method
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
    // Microtask deferral so UI remains responsive
    setTimeout(() => {
      const res = solveRoot(input);
      setResult(res);
      setIsSolving(false);
    }, 16);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
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
        <View style={styles.methodInfoBox}>
          <Text style={[Typography.monoSm, styles.methodInfoText]}>
            {METHOD_DESCRIPTIONS[input.method]}
          </Text>
        </View>

        {/* Dynamic Inputs Form */}
        <RootInputForm
          input={input}
          onChange={(patch) => setInput((prev) => ({ ...prev, ...patch }))}
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
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  methodInfoBox: {
    backgroundColor: '#070A0E',
    borderLeftWidth: 2,
    borderLeftColor: Colors.accentCyan,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  methodInfoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});
