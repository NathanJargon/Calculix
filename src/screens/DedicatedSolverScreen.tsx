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
import { IterationTable } from '../components/rootFinding/IterationTable';
import { RootResults } from '../components/rootFinding/RootResults';
import { solveRoot } from '../math/rootFinding';
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

  const [input, setInput] = useState<RootFindingInput>({
    method,
    functionStr: cfg.defaultFn,
    a: cfg.defaultA,
    b: cfg.defaultB,
    x0: cfg.defaultX0,
    x1: cfg.defaultX1,
    gFunctionStr: cfg.defaultG,
    tolerance: 1e-6,
    maxIterations: 50,
  });

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
      const res = solveRoot(input);
      setResult(res);
      setIsSolving(false);
    }, 16);
  };

  const applyPreset = (p: typeof cfg.presets[0]) => {
    const updated = {
      ...input,
      functionStr: p.fn,
      a: p.a !== undefined ? p.a : input.a,
      b: p.b !== undefined ? p.b : input.b,
      x0: p.x0 !== undefined ? p.x0 : input.x0,
      x1: p.x1 !== undefined ? p.x1 : input.x1,
      gFunctionStr: p.gFn || input.gFunctionStr,
    };
    setInput(updated);
    setResult(solveRoot(updated));
  };

  const insertSymbol = (s: string) => {
    setInput((prev) => ({ ...prev, functionStr: prev.functionStr + s }));
  };

  const backspaceSymbol = () => {
    setInput((prev) => ({
      ...prev,
      functionStr: prev.functionStr.length > 0 ? prev.functionStr.slice(0, -1) : '',
    }));
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
            value={input.functionStr}
            onChangeText={(text) => setInput((prev) => ({ ...prev, functionStr: text }))}
            onClear={() => setInput((prev) => ({ ...prev, functionStr: '' }))}
          />

          {/* Quick Keypad */}
          <MathKeypad
            onInsert={insertSymbol}
            onBackspace={backspaceSymbol}
            onClear={() => setInput((prev) => ({ ...prev, functionStr: '' }))}
          />

          {/* Specific Inputs based on method */}
          {method === 'bisection' && (
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <TechInput
                  label="Start Interval (a)"
                  prefix="a ="
                  placeholder="e.g. 1"
                  keyboardType="numeric"
                  value={input.a !== undefined ? String(input.a) : ''}
                  onChangeText={(t) => {
                    const v = parseFloat(t);
                    setInput((prev) => ({ ...prev, a: Number.isNaN(v) ? undefined : v }));
                  }}
                />
              </View>
              <View style={styles.halfCol}>
                <TechInput
                  label="End Interval (b)"
                  prefix="b ="
                  placeholder="e.g. 2"
                  keyboardType="numeric"
                  value={input.b !== undefined ? String(input.b) : ''}
                  onChangeText={(t) => {
                    const v = parseFloat(t);
                    setInput((prev) => ({ ...prev, b: Number.isNaN(v) ? undefined : v }));
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
              keyboardType="numeric"
              value={input.x0 !== undefined ? String(input.x0) : ''}
              onChangeText={(t) => {
                const v = parseFloat(t);
                setInput((prev) => ({ ...prev, x0: Number.isNaN(v) ? undefined : v }));
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
                  keyboardType="numeric"
                  value={input.x0 !== undefined ? String(input.x0) : ''}
                  onChangeText={(t) => {
                    const v = parseFloat(t);
                    setInput((prev) => ({ ...prev, x0: Number.isNaN(v) ? undefined : v }));
                  }}
                />
              </View>
              <View style={styles.halfCol}>
                <TechInput
                  label="Second Guess (x₁)"
                  prefix="x₁ ="
                  placeholder="e.g. 2"
                  keyboardType="numeric"
                  value={input.x1 !== undefined ? String(input.x1) : ''}
                  onChangeText={(t) => {
                    const v = parseFloat(t);
                    setInput((prev) => ({ ...prev, x1: Number.isNaN(v) ? undefined : v }));
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
                value={input.gFunctionStr || ''}
                onChangeText={(t) => setInput((prev) => ({ ...prev, gFunctionStr: t }))}
              />
              <TechInput
                label="Initial Guess (x₀)"
                prefix="x₀ ="
                placeholder="e.g. 2"
                keyboardType="numeric"
                value={input.x0 !== undefined ? String(input.x0) : ''}
                onChangeText={(t) => {
                  const v = parseFloat(t);
                  setInput((prev) => ({ ...prev, x0: Number.isNaN(v) ? undefined : v }));
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
                    value={String(input.tolerance)}
                    onChangeText={(t) => {
                      const v = parseFloat(t);
                      if (!Number.isNaN(v) && v > 0) setInput((prev) => ({ ...prev, tolerance: v }));
                    }}
                  />
                </View>
                <View style={styles.halfCol}>
                  <TechInput
                    label="Max Steps"
                    prefix="N ="
                    placeholder="50"
                    keyboardType="number-pad"
                    value={String(input.maxIterations)}
                    onChangeText={(t) => {
                      const v = parseInt(t, 10);
                      if (!Number.isNaN(v) && v > 0) setInput((prev) => ({ ...prev, maxIterations: v }));
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
            disabled={isSolving || !input.functionStr.trim()}
            style={{ backgroundColor: cfg.accentColor }}
          />
        </View>

        {/* Results Overview */}
        {result && <RootResults result={result} />}

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
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
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
});

