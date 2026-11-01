import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DividedDiffTable } from '../components/interpolation/DividedDiffTable';
import { InterpolationResults } from '../components/interpolation/InterpolationResults';
import { LagrangeBasisTable } from '../components/interpolation/LagrangeBasisTable';
import { PointListEditor } from '../components/interpolation/PointListEditor';
import { solveInterpolation } from '../math/interpolation';
import { useTheme } from '../theme/ThemeContext';
import {
  DataPoint,
  InterpolationInput,
  InterpolationMethodType,
  InterpolationResult,
} from '../types/interpolation';

const INTERPOLATION_CONFIG: Record<
  InterpolationMethodType,
  {
    title: string;
    subtitle: string;
    accentColor: string;
    description: string;
  }
> = {
  'newton-divided': {
    title: "Newton's Divided Diff",
    subtitle: 'Difference Matrix Pyramid',
    accentColor: '#0284C7',
    description:
      'Calculates an interpolating polynomial through coordinate pairs using incremental divided differences. Highly transparent step table.',
  },
  lagrange: {
    title: 'Lagrange Interpolation',
    subtitle: 'Weighted Cardinal Basis Poly',
    accentColor: '#F59E0B',
    description:
      'Generates unique basis polynomials L_i(x) for each coordinate point, producing a smooth passing curve without matrix triangularization.',
  },
};

const DEFAULT_POINTS: DataPoint[] = [
  { id: 'pt-1', x: 1, y: 1 },
  { id: 'pt-2', x: 2, y: 4 },
  { id: 'pt-3', x: 3, y: 9 },
  { id: 'pt-4', x: 4, y: 16 },
];

interface DedicatedInterpolationScreenProps {
  method: InterpolationMethodType;
  onBack: () => void;
  onOpenGuide: () => void;
}

export const DedicatedInterpolationScreen: React.FC<DedicatedInterpolationScreenProps> = ({
  method,
  onBack,
  onOpenGuide,
}) => {
  const { colors, isDark } = useTheme();
  const cfg = INTERPOLATION_CONFIG[method];

  const [points, setPoints] = useState<DataPoint[]>(DEFAULT_POINTS);
  const [targetX, setTargetX] = useState<number>(2.5);
  const [isSolving, setIsSolving] = useState(false);

  const [result, setResult] = useState<InterpolationResult | null>(() =>
    solveInterpolation({
      method,
      points: DEFAULT_POINTS,
      targetX: 2.5,
    })
  );

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
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Header Row with Back Button */}
      <View style={[styles.topBar, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={[styles.backBtnArrow, { color: colors.textPrimary }]}>←</Text>
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>{cfg.title}</Text>
          <Text style={[styles.topBarSubtitle, { color: cfg.accentColor }]}>{cfg.subtitle}</Text>
        </View>

        <TouchableOpacity
          style={[styles.guideBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onOpenGuide}
          activeOpacity={0.7}
        >
          <Text style={[styles.guideBtnText, { color: cfg.accentColor }]}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Explanation Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: isDark ? cfg.accentColor + '18' : cfg.accentColor + '12',
              borderLeftColor: cfg.accentColor,
            },
          ]}
        >
          <Text style={[styles.infoCardText, { color: colors.textSecondary }]}>
            {cfg.description}
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
        {result && method === 'newton-divided' && result.newtonTable && (
          <DividedDiffTable
            headers={result.newtonTable.headers}
            matrix={result.newtonTable.matrix}
            points={result.points}
            terms={result.newtonTable.terms}
          />
        )}

        {/* Lagrange Basis Polynomials Table */}
        {result && method === 'lagrange' && result.lagrangeTerms && (
          <LagrangeBasisTable terms={result.lagrangeTerms} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  backBtnArrow: {
    fontSize: 20,
    fontWeight: '800',
  },
  topBarCenter: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  topBarSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  guideBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideBtnText: {
    fontSize: 18,
    fontWeight: '900',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  infoCard: {
    borderLeftWidth: 3.5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 16,
  },
  infoCardText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});

