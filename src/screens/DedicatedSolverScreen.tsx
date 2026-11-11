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
import { MathKeypad } from '../components/common/MathKeypad';
import { TechButton } from '../components/common/TechButton';
import { TechInput } from '../components/common/TechInput';
import { FunctionPlotter } from '../components/common/FunctionPlotter';
import { StepExplanationCards } from '../components/common/StepExplanationCards';
import { IterationTable } from '../components/rootFinding/IterationTable';
import { RootResults } from '../components/rootFinding/RootResults';
import { solveRoot } from '../math/rootFinding';
import { onCalculationCompleted } from '../services/adService';
import { useTheme } from '../theme/ThemeContext';
import {
  RootFindingInput,
  RootFindingResult,
  RootMethodType,
} from '../types/rootFinding';

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

interface DedicatedSolverScreenProps {
  method: RootMethodType;
  onBack: () => void;
  onOpenGuide: () => void;
}

export const DedicatedSolverScreen: React.FC<DedicatedSolverScreenProps> = ({
  method,
  onBack,
  onOpenGuide,
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
  const [fnSelection, setFnSelection] = useState<{ start: number; end: number } | null>(null);
  const [gSelection, setGSelection] = useState<{ start: number; end: number } | null>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
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
      if (res.root !== null) {
        onCalculationCompleted();
      }
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
        const start = gSelection?.start ?? prev.length;
        const end = gSelection?.end ?? prev.length;
        const next = prev.slice(0, start) + s + prev.slice(end);
        setGSelection({ start: start + s.length, end: start + s.length });
        return next;
      });
    } else {
      setFunctionStr((prev) => {
        const start = fnSelection?.start ?? prev.length;
        const end = fnSelection?.end ?? prev.length;
        const next = prev.slice(0, start) + s + prev.slice(end);
        setFnSelection({ start: start + s.length, end: start + s.length });
        return next;
      });
    }
    setResult(null);
  };

  const backspaceSymbol = () => {
    if (activeField === 'g' && method === 'fixed-point') {
      setGFunctionStr((prev) => {
        const start = gSelection?.start ?? prev.length;
        const end = gSelection?.end ?? prev.length;
        if (start !== end) {
          setGSelection({ start, end: start });
          return prev.slice(0, start) + prev.slice(end);
        }
        if (start > 0) {
          setGSelection({ start: start - 1, end: start - 1 });
          return prev.slice(0, start - 1) + prev.slice(start);
        }
        return prev;
      });
    } else {
      setFunctionStr((prev) => {
        const start = fnSelection?.start ?? prev.length;
        const end = fnSelection?.end ?? prev.length;
        if (start !== end) {
          setFnSelection({ start, end: start });
          return prev.slice(0, start) + prev.slice(end);
        }
        if (start > 0) {
          setFnSelection({ start: start - 1, end: start - 1 });
          return prev.slice(0, start - 1) + prev.slice(start);
        }
        return prev;
      });
    }
    setResult(null);
  };

  const clearActiveSymbol = () => {
    if (activeField === 'g' && method === 'fixed-point') {
      setGFunctionStr('');
      setGSelection({ start: 0, end: 0 });
    } else {
      setFunctionStr('');
      setFnSelection({ start: 0, end: 0 });
    }
    setResult(null);
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
            onSelectionChange={(e) => setFnSelection(e.nativeEvent.selection)}
            onChangeText={(text) => {
              setFunctionStr(text);
              setResult(null);
            }}
            onClear={() => {
              setFunctionStr('');
              setFnSelection({ start: 0, end: 0 });
              setResult(null);
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
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                  value={aText}
                  onChangeText={(t) => {
                    setAText(t);
                    setResult(null);
                  }}
                />
              </View>
              <View style={styles.halfCol}>
                <TechInput
                  label="End Interval (b)"
                  prefix="b ="
                  placeholder="e.g. 2"
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                  value={bText}
                  onChangeText={(t) => {
                    setBText(t);
                    setResult(null);
                  }}
                />
              </View>
            </View>
          )}

          {method === 'newton' && (
            <TechInput
              label="Starting Guess (x₀)"
              prefix="x₀ ="
              placeholder="e.g. 2"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              value={x0Text}
              onChangeText={(t) => {
                setX0Text(t);
                setResult(null);
              }}
            />
          )}

          {method === 'secant' && (
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <TechInput
                  label="First Guess (x₀)"
                  prefix="x₀ ="
                  placeholder="e.g. 1"
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                  value={x0Text}
                  onChangeText={(t) => {
                    setX0Text(t);
                    setResult(null);
                  }}
                />
              </View>
              <View style={styles.halfCol}>
                <TechInput
                  label="Second Guess (x₁)"
                  prefix="x₁ ="
                  placeholder="e.g. 2"
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                  value={x1Text}
                  onChangeText={(t) => {
                    setX1Text(t);
                    setResult(null);
                  }}
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
                onSelectionChange={(e) => setGSelection(e.nativeEvent.selection)}
                onChangeText={(t) => {
                  setGFunctionStr(t);
                  setResult(null);
                }}
                onClear={() => {
                  setGFunctionStr('');
                  setGSelection({ start: 0, end: 0 });
                  setResult(null);
                }}
              />
              <TechInput
                label="Initial Guess (x₀)"
                prefix="x₀ ="
                placeholder="e.g. 2"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                value={x0Text}
                onChangeText={(t) => {
                  setX0Text(t);
                  setResult(null);
                }}
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
                    keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                    value={tolText}
                    onChangeText={(t) => {
                      setTolText(t);
                      setResult(null);
                    }}
                  />
                </View>
                <View style={styles.halfCol}>
                  <TechInput
                    label="Max Steps"
                    prefix="N ="
                    placeholder="50"
                    keyboardType="number-pad"
                    value={maxIterText}
                    onChangeText={(t) => {
                      setMaxIterText(t);
                      setResult(null);
                    }}
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

        {/* Interactive Visual Graph */}
        <FunctionPlotter
          functionStr={functionStr}
          root={result?.root}
          a={parseFloat(aText)}
          b={parseFloat(bText)}
        />

        {/* Results Overview */}
        {result && <RootResults result={result} />}

        {/* Natural Step-by-Step Explanation Cards */}
        {result && result.iterations.length > 0 && (
          <StepExplanationCards method={result.method} iterations={result.iterations} />
        )}

        {/* Iteration Table */}
        {result && result.iterations.length > 0 && (
          <IterationTable method={result.method} iterations={result.iterations} />
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
});

