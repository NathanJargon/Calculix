import React, { useRef, useState } from 'react';
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
import { MathKeypad } from '../components/common/MathKeypad';
import { TechButton } from '../components/common/TechButton';
import { TechInput } from '../components/common/TechInput';
import { FunctionPlotter } from '../components/common/FunctionPlotter';
import { StepExplanationCards } from '../components/common/StepExplanationCards';
import { IterationTable } from '../components/rootFinding/IterationTable';
import { RootResults } from '../components/rootFinding/RootResults';
import { solveRoot } from '../math/rootFinding';
import { onCalculationCompleted } from '../services/adService';
import { saveCalculationToHistory } from '../services/historyService';
import { formatFloat } from '../math/evaluator';
import { useTheme } from '../theme/ThemeContext';
import {
  RootFindingInput,
  RootFindingResult,
  RootMethodType,
} from '../types/rootFinding';
import { SolverId } from './HomeScreen';

const METHOD_CONFIG: Record<
  RootMethodType,
  {
    title: string;
    subtitle: string;
    badge: string;
    accentColor: string;
    description: string;
    defaultFn: string;
    defaultG?: string;
    defaultA?: number;
    defaultB?: number;
    defaultX0?: number;
    defaultX1?: number;
    presets: { name: string; fn: string; a?: number; b?: number; x0?: number; x1?: number; gFn?: string }[];
  }
> = {
  bisection: {
    title: 'Bisection Method',
    subtitle: 'Guaranteed Interval Halving',
    badge: 'Safe & Steady',
    accentColor: '#00D2D3',
    description:
      'Finds roots by repeatedly dividing an interval [a, b] in half. Requires f(a) and f(b) to have opposite signs.',
    defaultFn: 'x^3 - x - 2',
    defaultA: 1,
    defaultB: 2,
    presets: [
      { name: 'Cubic Poly', fn: 'x^3 - x - 2', a: 1, b: 2 },
      { name: 'cos(x) - x', fn: 'cos(x) - x', a: 0, b: 1 },
      { name: 'e⁻ˣ - x', fn: 'e^(-x) - x', a: 0, b: 1 },
    ],
  },
  newton: {
    title: 'Newton-Raphson',
    subtitle: 'Tangent Slope Approximation',
    badge: 'Super Fast',
    accentColor: '#FF2E93',
    description:
      "Rapidly converges to a root using the tangent line's slope f'(x) at the current point x₀.",
    defaultFn: 'x^3 - 2*x - 5',
    defaultX0: 2,
    presets: [
      { name: 'Cubic (x ~2.094)', fn: 'x^3 - 2*x - 5', x0: 2 },
      { name: 'cos(x) - x', fn: 'cos(x) - x', x0: 0.5 },
      { name: 'Square Root √2', fn: 'x^2 - 2', x0: 1 },
    ],
  },
  secant: {
    title: 'Secant Method',
    subtitle: 'Quasi-Newton Secant Slope',
    badge: 'No Derivative',
    accentColor: '#A855F7',
    description:
      'Approximates the derivative using the secant line between two test points x₀ and x₁.',
    defaultFn: 'x^3 - 2*x - 5',
    defaultX0: 1,
    defaultX1: 2,
    presets: [
      { name: 'Cubic', fn: 'x^3 - 2*x - 5', x0: 1, x1: 2 },
      { name: 'Kepler Approx', fn: 'x - 0.2*sin(x) - 0.5', x0: 0, x1: 1 },
      { name: 'Natural Log', fn: 'log(x) - 1', x0: 2, x1: 3 },
    ],
  },
  'fixed-point': {
    title: 'Fixed-Point Iteration',
    subtitle: 'Contraction Stepping x = g(x)',
    badge: 'Iterative Step',
    accentColor: '#10B981',
    description:
      'Rewrites f(x) = 0 into x = g(x) and iterates toward the intersection point x* = g(x*).',
    defaultFn: 'x^3 - 2*x - 5',
    defaultG: '(2*x + 5)^(1/3)',
    defaultX0: 2,
    presets: [
      { name: 'x = (2x+5)^(1/3)', fn: 'x^3 - 2*x - 5', gFn: '(2*x + 5)^(1/3)', x0: 2 },
      { name: 'x = cos(x)', fn: 'cos(x) - x', gFn: 'cos(x)', x0: 0.5 },
      { name: 'x = (x+2/x)/2', fn: 'x^2 - 2', gFn: '(x + 2/x) / 2', x0: 1.5 },
    ],
  },
};

export const ALL_SOLVER_METHODS: { id: SolverId; label: string; tag: string }[] = [
  { id: 'bisection', label: 'Bisection', tag: 'Root' },
  { id: 'newton', label: 'Newton', tag: 'Root' },
  { id: 'secant', label: 'Secant', tag: 'Root' },
  { id: 'fixed-point', label: 'Fixed-Point', tag: 'Root' },
  { id: 'newton-divided', label: 'Divided Diff', tag: 'Interp' },
  { id: 'lagrange', label: 'Lagrange', tag: 'Interp' },
];

interface DedicatedSolverScreenProps {
  method: RootMethodType;
  onBack: () => void;
  onOpenGuide: () => void;
  onChangeMethod?: (method: SolverId) => void;
}

export const DedicatedSolverScreen: React.FC<DedicatedSolverScreenProps> = ({
  method,
  onBack,
  onOpenGuide,
  onChangeMethod,
}) => {
  const { colors, isDark } = useTheme();
  const cfg = METHOD_CONFIG[method];

  const [functionStr, setFunctionStr] = useState(cfg.defaultFn);
  const [aText, setAText] = useState(cfg.defaultA !== undefined ? String(cfg.defaultA) : '');
  const [bText, setBText] = useState(cfg.defaultB !== undefined ? String(cfg.defaultB) : '');
  const [x0Text, setX0Text] = useState(cfg.defaultX0 !== undefined ? String(cfg.defaultX0) : '');
  const [x1Text, setX1Text] = useState(cfg.defaultX1 !== undefined ? String(cfg.defaultX1) : '');
  const [gFunctionStr, setGFunctionStr] = useState(cfg.defaultG || '');
  const [tolText, setTolText] = useState('1e-6');
  const [maxIterText, setMaxIterText] = useState('50');
  const [activeField, setActiveField] = useState<'fn' | 'g'>('fn');
  const fnSelection = useRef<{ start: number; end: number }>({
    start: cfg.defaultFn.length,
    end: cfg.defaultFn.length,
  });
  const gSelection = useRef<{ start: number; end: number }>({
    start: (cfg.defaultG || '').length,
    end: (cfg.defaultG || '').length,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeDeckTab, setActiveDeckTab] = useState<'inputs' | 'steps' | 'table'>('inputs');
  const [isSolving, setIsSolving] = useState(false);
  const [result, setResult] = useState<RootFindingResult | null>(() =>
    solveRoot({
      method,
      functionStr: cfg.defaultFn,
      a: cfg.defaultA,
      b: cfg.defaultB,
      x0: cfg.defaultX0,
      x1: cfg.defaultX1,
      gFunctionStr: cfg.defaultG,
      tolerance: 1e-6,
      maxIterations: 50,
    })
  );

  const handleSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      const parsedA = parseFloat(aText);
      const parsedB = parseFloat(bText);
      const parsedX0 = parseFloat(x0Text);
      const parsedX1 = parseFloat(x1Text);
      const parsedTol = parseFloat(tolText);
      const parsedMax = parseInt(maxIterText, 10);

      const solverInput: RootFindingInput = {
        method,
        functionStr,
        a: Number.isNaN(parsedA) ? undefined : parsedA,
        b: Number.isNaN(parsedB) ? undefined : parsedB,
        x0: Number.isNaN(parsedX0) ? undefined : parsedX0,
        x1: Number.isNaN(parsedX1) ? undefined : parsedX1,
        gFunctionStr: gFunctionStr.trim() || undefined,
        tolerance: Number.isNaN(parsedTol) || parsedTol <= 0 ? 1e-6 : parsedTol,
        maxIterations: Number.isNaN(parsedMax) || parsedMax <= 0 ? 50 : Math.min(parsedMax, 1000),
      };

      const res = solveRoot(solverInput);
      setResult(res);
      setIsSolving(false);
      setActiveDeckTab('steps');
      if (res.root !== null) {
        onCalculationCompleted();
      }
      saveCalculationToHistory({
        type: 'root',
        method,
        methodTitle: cfg.title,
        expressionSummary: `f(x) = ${functionStr}`,
        resultSummary:
          res.root !== null ? `x* = ${formatFloat(res.root, 6)}` : `Status: ${res.status}`,
        rootParams: {
          functionStr,
          a: Number.isNaN(parsedA) ? undefined : parsedA,
          b: Number.isNaN(parsedB) ? undefined : parsedB,
          x0: Number.isNaN(parsedX0) ? undefined : parsedX0,
          x1: Number.isNaN(parsedX1) ? undefined : parsedX1,
          gFunctionStr: gFunctionStr.trim() || undefined,
          tolerance: Number.isNaN(parsedTol) || parsedTol <= 0 ? 1e-6 : parsedTol,
          maxIterations: Number.isNaN(parsedMax) || parsedMax <= 0 ? 50 : Math.min(parsedMax, 1000),
        },
      });
    }, 16);
  };

  const applyPreset = (p: typeof cfg.presets[0]) => {
    const nextFn = p.fn;
    const nextA = p.a !== undefined ? String(p.a) : aText;
    const nextB = p.b !== undefined ? String(p.b) : bText;
    const nextX0 = p.x0 !== undefined ? String(p.x0) : x0Text;
    const nextX1 = p.x1 !== undefined ? String(p.x1) : x1Text;
    const nextG = p.gFn || gFunctionStr;

    setFunctionStr(nextFn);
    setAText(nextA);
    setBText(nextB);
    setX0Text(nextX0);
    setX1Text(nextX1);
    setGFunctionStr(nextG);

    const parsedA = parseFloat(nextA);
    const parsedB = parseFloat(nextB);
    const parsedX0 = parseFloat(nextX0);
    const parsedX1 = parseFloat(nextX1);

    setResult(
      solveRoot({
        method,
        functionStr: nextFn,
        a: Number.isNaN(parsedA) ? undefined : parsedA,
        b: Number.isNaN(parsedB) ? undefined : parsedB,
        x0: Number.isNaN(parsedX0) ? undefined : parsedX0,
        x1: Number.isNaN(parsedX1) ? undefined : parsedX1,
        gFunctionStr: nextG || undefined,
        tolerance: 1e-6,
        maxIterations: 50,
      })
    );
  };

  const insertSymbol = (s: string) => {
    if (activeField === 'g' && method === 'fixed-point') {
      setGFunctionStr((prev) => {
        const start = gSelection.current?.start ?? prev.length;
        const end = gSelection.current?.end ?? prev.length;
        const next = prev.slice(0, start) + s + prev.slice(end);
        gSelection.current = { start: start + s.length, end: start + s.length };
        return next;
      });
    } else {
      setFunctionStr((prev) => {
        const start = fnSelection.current?.start ?? prev.length;
        const end = fnSelection.current?.end ?? prev.length;
        const next = prev.slice(0, start) + s + prev.slice(end);
        fnSelection.current = { start: start + s.length, end: start + s.length };
        return next;
      });
    }
  };

  const backspaceSymbol = () => {
    if (activeField === 'g' && method === 'fixed-point') {
      setGFunctionStr((prev) => {
        const start = gSelection.current?.start ?? prev.length;
        const end = gSelection.current?.end ?? prev.length;
        if (start !== end) {
          gSelection.current = { start, end: start };
          return prev.slice(0, start) + prev.slice(end);
        }
        if (start > 0) {
          gSelection.current = { start: start - 1, end: start - 1 };
          return prev.slice(0, start - 1) + prev.slice(start);
        }
        return prev;
      });
    } else {
      setFunctionStr((prev) => {
        const start = fnSelection.current?.start ?? prev.length;
        const end = fnSelection.current?.end ?? prev.length;
        if (start !== end) {
          fnSelection.current = { start, end: start };
          return prev.slice(0, start) + prev.slice(end);
        }
        if (start > 0) {
          fnSelection.current = { start: start - 1, end: start - 1 };
          return prev.slice(0, start - 1) + prev.slice(start);
        }
        return prev;
      });
    }
  };

  const clearActiveSymbol = () => {
    if (activeField === 'g' && method === 'fixed-point') {
      setGFunctionStr('');
      gSelection.current = { start: 0, end: 0 };
    } else {
      setFunctionStr('');
      fnSelection.current = { start: 0, end: 0 };
    }
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
            activeDeckTab === 'inputs' ? [styles.deckTabActive, { borderColor: cfg.accentColor, backgroundColor: cfg.accentColor + '15' }] : null,
          ]}
          onPress={() => setActiveDeckTab('inputs')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.deckTabText,
              activeDeckTab === 'inputs' ? [styles.deckTabTextActive, { color: cfg.accentColor }] : { color: colors.textSecondary },
            ]}
          >
            Inputs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deckTab,
            activeDeckTab === 'steps' ? [styles.deckTabActive, { borderColor: cfg.accentColor, backgroundColor: cfg.accentColor + '15' }] : null,
          ]}
          onPress={() => setActiveDeckTab('steps')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.deckTabText,
              activeDeckTab === 'steps' ? [styles.deckTabTextActive, { color: cfg.accentColor }] : { color: colors.textSecondary },
            ]}
          >
            Solution & Steps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deckTab,
            activeDeckTab === 'table' ? [styles.deckTabActive, { borderColor: cfg.accentColor, backgroundColor: cfg.accentColor + '15' }] : null,
          ]}
          onPress={() => setActiveDeckTab('table')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.deckTabText,
              activeDeckTab === 'table' ? [styles.deckTabTextActive, { color: cfg.accentColor }] : { color: colors.textSecondary },
            ]}
          >
            Iteration Table
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Interactive Visual Graph at Top */}
        <FunctionPlotter
          functionStr={functionStr}
          root={result?.root}
          a={parseFloat(aText)}
          b={parseFloat(bText)}
        />

        {/* Loading Indicator Overlay */}
        {isSolving && (
          <View style={[styles.solvingOverlay, { backgroundColor: colors.surface, borderColor: cfg.accentColor }]}>
            <ActivityIndicator size="small" color={cfg.accentColor} />
            <Text style={[styles.solvingText, { color: colors.textPrimary }]}>
              Evaluating numerical iterations...
            </Text>
          </View>
        )}

        {/* TAB 1: Inputs & Parameters */}
        {activeDeckTab === 'inputs' && (
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

            {/* Input Form Card */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Quick Presets */}
              <View style={[styles.presetsSection, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.presetHeading, { color: colors.textSecondary }]}>Presets:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {cfg.presets.map((preset, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.75}
                      onPress={() => applyPreset(preset)}
                      style={[styles.presetChip, { backgroundColor: cfg.accentColor + '20' }]}
                      accessibilityLabel={`Apply preset ${preset.name}`}
                      accessibilityRole="button"
                      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                    >
                      <Text style={[styles.presetText, { color: cfg.accentColor }]}>{preset.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Equation Input */}
              <TechInput
                label="Target Equation f(x) = 0"
                prefix="f(x) ="
                placeholder="e.g. x^3 - 2*x - 5"
                value={functionStr}
                onFocus={() => setActiveField('fn')}
                onSelectionChange={(e) => {
                  fnSelection.current = e.nativeEvent.selection;
                }}
                onChangeText={(text) => {
                  setFunctionStr(text);
                }}
                onClear={() => {
                  setFunctionStr('');
                  fnSelection.current = { start: 0, end: 0 };
                }}
              />

              {/* Quick Keypad */}
              <MathKeypad
                onInsert={insertSymbol}
                onBackspace={backspaceSymbol}
                onClear={clearActiveSymbol}
              />

              {/* Specific Inputs based on method */}
              {method === 'bisection' && (
                <View style={styles.row}>
                  <View style={styles.halfCol}>
                    <TechInput
                      label="Start Interval (a)"
                      prefix="a ="
                      placeholder="e.g. 1"
                      keyboardType="default"
                      value={aText}
                      onChangeText={(t) => setAText(t)}
                    />
                  </View>
                  <View style={styles.halfCol}>
                    <TechInput
                      label="End Interval (b)"
                      prefix="b ="
                      placeholder="e.g. 2"
                      keyboardType="default"
                      value={bText}
                      onChangeText={(t) => setBText(t)}
                    />
                  </View>
                </View>
              )}

              {method === 'newton' && (
                <TechInput
                  label="Starting Guess (x₀)"
                  prefix="x₀ ="
                  placeholder="e.g. 2"
                  keyboardType="default"
                  value={x0Text}
                  onChangeText={(t) => setX0Text(t)}
                />
              )}

              {method === 'secant' && (
                <View style={styles.row}>
                  <View style={styles.halfCol}>
                    <TechInput
                      label="First Guess (x₀)"
                      prefix="x₀ ="
                      placeholder="e.g. 1"
                      keyboardType="default"
                      value={x0Text}
                      onChangeText={(t) => setX0Text(t)}
                    />
                  </View>
                  <View style={styles.halfCol}>
                    <TechInput
                      label="Second Guess (x₁)"
                      prefix="x₁ ="
                      placeholder="e.g. 2"
                      keyboardType="default"
                      value={x1Text}
                      onChangeText={(t) => setX1Text(t)}
                    />
                  </View>
                </View>
              )}

              {method === 'fixed-point' && (
                <>
                  <TechInput
                    label="Rearranged: x = g(x)"
                    prefix="g(x) ="
                    placeholder="e.g. (2*x + 5)^(1/3)"
                    value={gFunctionStr}
                    onFocus={() => setActiveField('g')}
                    onSelectionChange={(e) => {
                      gSelection.current = e.nativeEvent.selection;
                    }}
                    onChangeText={(t) => setGFunctionStr(t)}
                    onClear={() => {
                      setGFunctionStr('');
                      gSelection.current = { start: 0, end: 0 };
                    }}
                  />
                  <TechInput
                    label="Initial Guess (x₀)"
                    prefix="x₀ ="
                    placeholder="e.g. 2"
                    keyboardType="default"
                    value={x0Text}
                    onChangeText={(t) => setX0Text(t)}
                  />
                </>
              )}

              {/* Advanced toggle */}
              <TouchableOpacity
                style={styles.advancedToggle}
                onPress={() => setShowAdvanced(!showAdvanced)}
                activeOpacity={0.7}
              >
                <Text style={[styles.advancedToggleText, { color: cfg.accentColor }]}>
                  {showAdvanced ? '▾ Hide Advanced' : '▸ Advanced Parameters (Tolerance & Steps)'}
                </Text>
              </TouchableOpacity>

              {showAdvanced && (
                <View style={[styles.advancedBox, { backgroundColor: colors.surfaceSecondary }]}>
                  <View style={styles.row}>
                    <View style={styles.halfCol}>
                      <TechInput
                        label="Accuracy Goal"
                        prefix="ε ="
                        placeholder="1e-6"
                        keyboardType="default"
                        value={tolText}
                        onChangeText={(t) => setTolText(t)}
                      />
                    </View>
                    <View style={styles.halfCol}>
                      <TechInput
                        label="Max Steps"
                        prefix="N ="
                        placeholder="50"
                        keyboardType="default"
                        value={maxIterText}
                        onChangeText={(t) => setMaxIterText(t)}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Calculate Button */}
              <TechButton
                label={isSolving ? 'Calculating...' : `Find Root with ${cfg.title.split(' ')[0]}`}
                variant="primary"
                onPress={handleSolve}
                disabled={isSolving || !functionStr.trim()}
                style={[styles.calcBtn, { backgroundColor: cfg.accentColor }]}
              />
            </View>
          </>
        )}

        {/* TAB 2: Solution & Natural Steps */}
        {activeDeckTab === 'steps' && (
          <>
            {result ? (
              <>
                <RootResults result={result} />
                {result.iterations.length > 0 && (
                  <StepExplanationCards method={result.method} iterations={result.iterations} />
                )}
              </>
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Solution Yet</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  Tap "Find Root" on the Inputs tab to calculate the solution and view step-by-step explanations.
                </Text>
              </View>
            )}
          </>
        )}

        {/* TAB 3: Iteration Data Table */}
        {activeDeckTab === 'table' && (
          <>
            {result && result.iterations.length > 0 ? (
              <IterationTable method={result.method} iterations={result.iterations} />
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Table Data</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  Execute a calculation to view the full convergence iteration table.
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
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  presetsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  presetHeading: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCol: {
    flex: 0.485,
  },
  advancedToggle: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 6,
  },
  advancedToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  advancedBox: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  calcBtn: {
    marginTop: 4,
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

