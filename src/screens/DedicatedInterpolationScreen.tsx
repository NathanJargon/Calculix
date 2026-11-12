import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DividedDiffTable } from '../components/interpolation/DividedDiffTable';
import { InterpolationPlotter } from '../components/common/InterpolationPlotter';
import { InterpolationResults } from '../components/interpolation/InterpolationResults';
import { LagrangeBasisTable } from '../components/interpolation/LagrangeBasisTable';
import { PointListEditor } from '../components/interpolation/PointListEditor';
import { solveInterpolation } from '../math/interpolation';
import { onCalculationCompleted } from '../services/adService';
import { saveCalculationToHistory, SolverPrefill } from '../services/historyService';
import { formatFloat } from '../math/evaluator';
import { useTheme } from '../theme/ThemeContext';
import {
  DataPoint,
  InterpolationInput,
  InterpolationMethodType,
  InterpolationResult,
} from '../types/interpolation';
import { SolverId } from './HomeScreen';
import { ALL_SOLVER_METHODS } from './DedicatedSolverScreen';

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
  onOpenTextbook?: () => void;
  onChangeMethod?: (method: SolverId) => void;
  initialPrefill?: SolverPrefill;
}

export const DedicatedInterpolationScreen: React.FC<DedicatedInterpolationScreenProps> = ({
  method,
  onBack,
  onOpenGuide,
  onOpenTextbook,
  onChangeMethod,
  initialPrefill,
}) => {
  const { colors, isDark } = useTheme();
  const cfg = INTERPOLATION_CONFIG[method];
  const ip = initialPrefill?.interpolationParams;
  const initPoints = ip?.points ?? DEFAULT_POINTS;
  const initTargetX = ip?.targetX ?? 2.5;

  const [points, setPoints] = useState<DataPoint[]>(initPoints);
  const [targetX, setTargetX] = useState<number>(initTargetX);
  const [activeDeckTab, setActiveDeckTab] = useState<'points' | 'solution' | 'matrix'>(
    ip ? 'solution' : 'points'
  );
  const [isSolving, setIsSolving] = useState(false);

  const [result, setResult] = useState<InterpolationResult | null>(() =>
    solveInterpolation({
      method,
      points: initPoints,
      targetX: initTargetX,
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
      const res = solveInterpolation(input);
      setResult(res);
      setIsSolving(false);
      setActiveDeckTab('solution');
      if (res.interpolatedY !== null) {
        onCalculationCompleted();
      }
      saveCalculationToHistory({
        type: 'interpolation',
        method,
        methodTitle: cfg.title,
        expressionSummary: `${points.length} pts, x* = ${targetX}`,
        resultSummary:
          res.interpolatedY !== null
            ? `P(${targetX}) = ${formatFloat(res.interpolatedY, 6)}`
            : 'Error',
        interpolationParams: { points, targetX },
      });
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

        {onOpenTextbook && (
          <TouchableOpacity
            style={[styles.guideBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onOpenTextbook}
            activeOpacity={0.7}
          >
            <Text style={[styles.guideBtnText, { color: cfg.accentColor }]}>📚</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.guideBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onOpenGuide}
          activeOpacity={0.7}
        >
          <Text style={[styles.guideBtnText, { color: cfg.accentColor }]}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Method Switcher Strip */}
      <View style={[styles.methodBarContainer, { borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.methodBarContent}
        >
          {ALL_SOLVER_METHODS.map((m) => {
            const isActive = m.id === method;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => onChangeMethod?.(m.id)}
                activeOpacity={0.75}
                style={[
                  styles.methodTabChip,
                  {
                    backgroundColor: isActive ? cfg.accentColor : colors.surface,
                    borderColor: isActive ? cfg.accentColor : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.methodTabChipText,
                    isActive ? styles.textWhite : { color: colors.textSecondary },
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Segmented Workspace Controller */}
      <View style={[styles.deckBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.deckTab,
            activeDeckTab === 'points' ? [styles.deckTabActive, { borderColor: cfg.accentColor, backgroundColor: cfg.accentColor + '15' }] : null,
          ]}
          onPress={() => setActiveDeckTab('points')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.deckTabText,
              activeDeckTab === 'points' ? [styles.deckTabTextActive, { color: cfg.accentColor }] : { color: colors.textSecondary },
            ]}
          >
            Data Points
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deckTab,
            activeDeckTab === 'solution' ? [styles.deckTabActive, { borderColor: cfg.accentColor, backgroundColor: cfg.accentColor + '15' }] : null,
          ]}
          onPress={() => setActiveDeckTab('solution')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.deckTabText,
              activeDeckTab === 'solution' ? [styles.deckTabTextActive, { color: cfg.accentColor }] : { color: colors.textSecondary },
            ]}
          >
            Solution & Curve
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deckTab,
            activeDeckTab === 'matrix' ? [styles.deckTabActive, { borderColor: cfg.accentColor, backgroundColor: cfg.accentColor + '15' }] : null,
          ]}
          onPress={() => setActiveDeckTab('matrix')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.deckTabText,
              activeDeckTab === 'matrix' ? [styles.deckTabTextActive, { color: cfg.accentColor }] : { color: colors.textSecondary },
            ]}
          >
            {method === 'newton-divided' ? 'Diff Matrix' : 'Basis Polynomials'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Visual Graph Plotter at Top */}
        <InterpolationPlotter
          points={points}
          targetX={targetX}
          interpolatedY={result?.interpolatedY}
        />

        {/* Loading Indicator */}
        {isSolving && (
          <View style={[styles.solvingOverlay, { backgroundColor: cfg.accentColor + '15', borderColor: cfg.accentColor }]}>
            <ActivityIndicator size="small" color={cfg.accentColor} />
            <Text style={[styles.solvingText, { color: cfg.accentColor }]}>Computing interpolation polynomial...</Text>
          </View>
        )}

        {/* TAB 1: Points & Estimation Target */}
        {activeDeckTab === 'points' && (
          <>
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
              onPointsChange={(newPoints) => {
                setPoints(newPoints);
              }}
              onTargetXChange={(newTarget) => {
                setTargetX(newTarget);
              }}
              onSolve={handleSolve}
              isSolving={isSolving}
            />
          </>
        )}

        {/* TAB 2: Solution & Curve Results */}
        {activeDeckTab === 'solution' && (
          <>
            {result ? (
              <InterpolationResults result={result} />
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Solution Yet</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  Configure coordinates and tap "Calculate Interpolation" to solve.
                </Text>
              </View>
            )}
          </>
        )}

        {/* TAB 3: Difference Matrix / Basis Polynomials */}
        {activeDeckTab === 'matrix' && (
          <>
            {result ? (
              <>
                {method === 'newton-divided' && result.newtonTable && (
                  <DividedDiffTable
                    headers={result.newtonTable.headers}
                    matrix={result.newtonTable.matrix}
                    points={result.points}
                    terms={result.newtonTable.terms}
                  />
                )}
                {method === 'lagrange' && result.lagrangeTerms && (
                  <LagrangeBasisTable terms={result.lagrangeTerms} />
                )}
              </>
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Matrix Data</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  Compute interpolation to populate the triangular divided difference table or basis polynomials.
                </Text>
              </View>
            )}
          </>
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
  methodBarContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  methodBarContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  methodTabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTabChipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  deckBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  deckTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  deckTabActive: {
    borderWidth: 1,
  },
  deckTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deckTabTextActive: {
    fontWeight: '800',
  },
  solvingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    gap: 10,
  },
  solvingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

