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
import { DividedDiffTable } from '../components/interpolation/DividedDiffTable';
import { InterpolationResults } from '../components/interpolation/InterpolationResults';
import { LagrangeBasisTable } from '../components/interpolation/LagrangeBasisTable';
import { PointListEditor } from '../components/interpolation/PointListEditor';
import { solveInterpolation } from '../math/interpolation';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import {
  DataPoint,
  InterpolationInput,
  InterpolationMethodType,
  InterpolationResult,
} from '../types/interpolation';

const INTERPOLATION_OPTIONS: TabOption<InterpolationMethodType>[] = [
  { id: 'newton-divided', label: "NEWTON'S DIVIDED DIFF", badge: 'PYRAMID' },
  { id: 'lagrange', label: 'LAGRANGE INTERPOLATION', badge: 'BASIS L_i' },
];

const METHOD_DESCRIPTIONS: Record<InterpolationMethodType, string> = {
  'newton-divided':
    "Builds a divided difference matrix pyramid. Efficient for computing interpolating polynomials with incremental point updates without re-evaluating preceding differences.",
  lagrange:
    "Constructs distinct cardinal basis polynomials L_i(x) for each coordinate pair (x_i, y_i). Guarantees P(x_i) = y_i through algebraic orthogonality.",
};

const DEFAULT_POINTS: DataPoint[] = [
  { id: 'pt-1', x: 1, y: 1 },
  { id: 'pt-2', x: 2, y: 4 },
  { id: 'pt-3', x: 3, y: 9 },
  { id: 'pt-4', x: 4, y: 16 },
];

export const InterpolationScreen: React.FC = () => {
  const [method, setMethod] = useState<InterpolationMethodType>('newton-divided');
  const [points, setPoints] = useState<DataPoint[]>(DEFAULT_POINTS);
  const [targetX, setTargetX] = useState<number>(2.5);
  const [isSolving, setIsSolving] = useState(false);

  const [result, setResult] = useState<InterpolationResult | null>(() =>
    solveInterpolation({
      method: 'newton-divided',
      points: DEFAULT_POINTS,
      targetX: 2.5,
    })
  );

  const handleMethodChange = (newMethod: InterpolationMethodType) => {
    setMethod(newMethod);
    const input: InterpolationInput = {
      method: newMethod,
      points,
      targetX,
    };
    setResult(solveInterpolation(input));
  };

  const handleSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      const input: InterpolationInput = {
        method,
        points,
        targetX,
      };
      setResult(solveInterpolation(input));
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
        {/* Method Toggle */}
        <TabSelector
          options={INTERPOLATION_OPTIONS}
          selectedId={method}
          onSelect={handleMethodChange}
        />

        {/* Method Brief */}
        <View style={styles.methodInfoBox}>
          <Text style={[Typography.monoSm, styles.methodInfoText]}>
            {METHOD_DESCRIPTIONS[method]}
          </Text>
        </View>

        {/* Dynamic Coordinate Point List Editor */}
        <PointListEditor
          method={method}
          points={points}
          targetX={targetX}
          onPointsChange={setPoints}
          onTargetXChange={setTargetX}
          onSolve={handleSolve}
          isSolving={isSolving}
        />

        {/* Results Card */}
        {result && <InterpolationResults result={result} />}

        {/* Newton's Divided Difference Table & Term Breakdown */}
        {result &&
          method === 'newton-divided' &&
          result.newtonTable && (
            <DividedDiffTable
              headers={result.newtonTable.headers}
              matrix={result.newtonTable.matrix}
              points={result.points}
              terms={result.newtonTable.terms}
            />
          )}

        {/* Lagrange Basis Polynomials Table */}
        {result &&
          method === 'lagrange' &&
          result.lagrangeTerms && (
            <LagrangeBasisTable terms={result.lagrangeTerms} />
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
    borderLeftColor: Colors.accentViolet,
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
