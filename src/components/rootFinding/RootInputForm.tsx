import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { RootFindingInput, RootMethodType } from '../../types/rootFinding';
import { TechButton } from '../common/TechButton';
import { TechInput } from '../common/TechInput';

interface RootInputFormProps {
  input: RootFindingInput;
  onChange: (updated: Partial<RootFindingInput>) => void;
  onSolve: () => void;
  isSolving?: boolean;
}

interface PresetItem {
  name: string;
  fn: string;
  gFn?: string;
  a?: number;
  b?: number;
  x0?: number;
  x1?: number;
}

const PRESETS: Record<RootMethodType, PresetItem[]> = {
  bisection: [
    { name: 'Cubic Poly', fn: 'x^3 - x - 2', a: 1, b: 2 },
    { name: 'Transcendental', fn: 'cos(x) - x', a: 0, b: 1 },
    { name: 'Exponential', fn: 'e^(-x) - x', a: 0, b: 1 },
  ],
  newton: [
    { name: 'Cubic (Root ~2.094)', fn: 'x^3 - 2*x - 5', x0: 2 },
    { name: 'Cosine Fixed', fn: 'cos(x) - x', x0: 0.5 },
    { name: 'Square Root 2', fn: 'x^2 - 2', x0: 1 },
  ],
  secant: [
    { name: 'Cubic', fn: 'x^3 - 2*x - 5', x0: 1, x1: 2 },
    { name: 'Kepler Approx', fn: 'x - 0.2*sin(x) - 0.5', x0: 0, x1: 1 },
    { name: 'Natural Log', fn: 'log(x) - 1', x0: 2, x1: 3 },
  ],
  'fixed-point': [
    { name: 'Cubic x=(2x+5)^(1/3)', fn: 'x^3 - 2*x - 5', gFn: '(2*x + 5)^(1/3)', x0: 2 },
    { name: 'Cosine x=cos(x)', fn: 'cos(x) - x', gFn: 'cos(x)', x0: 0.5 },
    { name: 'Sqrt x=(x+2/x)/2', fn: 'x^2 - 2', gFn: '(x + 2/x) / 2', x0: 1.5 },
  ],
};

export const RootInputForm: React.FC<RootInputFormProps> = ({
  input,
  onChange,
  onSolve,
  isSolving,
}) => {
  const currentPresets = PRESETS[input.method] || [];

  const applyPreset = (p: PresetItem) => {
    onChange({
      functionStr: p.fn,
      gFunctionStr: p.gFn || input.gFunctionStr,
      a: p.a !== undefined ? p.a : input.a,
      b: p.b !== undefined ? p.b : input.b,
      x0: p.x0 !== undefined ? p.x0 : input.x0,
      x1: p.x1 !== undefined ? p.x1 : input.x1,
    });
  };

  return (
    <View style={styles.card}>
      {/* Quick Presets Bar */}
      <View style={styles.presetsSection}>
        <Text style={[Typography.monoSm, styles.presetHeading]}>PRESETS:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {currentPresets.map((preset, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => applyPreset(preset)}
              style={styles.presetChip}
            >
              <Text style={[Typography.monoSm, styles.presetText]}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Function f(x) */}
      <TechInput
        label="OBJECTIVE FUNCTION f(x)"
        prefix="f(x) ="
        placeholder="e.g. x^3 - 2*x - 5"
        value={input.functionStr}
        onChangeText={(text) => onChange({ functionStr: text })}
        onClear={() => onChange({ functionStr: '' })}
      />

      {/* Fixed Point g(x) */}
      {input.method === 'fixed-point' && (
        <TechInput
          label="ITERATION FUNCTION g(x) [where x = g(x)]"
          prefix="g(x) ="
          placeholder="e.g. (2*x + 5)^(1/3)"
          value={input.gFunctionStr || ''}
          onChangeText={(text) => onChange({ gFunctionStr: text })}
          onClear={() => onChange({ gFunctionStr: '' })}
        />
      )}

      {/* Method specific bounds / guesses */}
      {input.method === 'bisection' && (
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <TechInput
              label="LOWER BOUND (a)"
              prefix="a ="
              placeholder="e.g. 1"
              keyboardType="numeric"
              value={input.a !== undefined ? String(input.a) : ''}
              onChangeText={(text) => {
                const val = parseFloat(text);
                onChange({ a: Number.isNaN(val) ? undefined : val });
              }}
            />
          </View>
          <View style={styles.halfCol}>
            <TechInput
              label="UPPER BOUND (b)"
              prefix="b ="
              placeholder="e.g. 2"
              keyboardType="numeric"
              value={input.b !== undefined ? String(input.b) : ''}
              onChangeText={(text) => {
                const val = parseFloat(text);
                onChange({ b: Number.isNaN(val) ? undefined : val });
              }}
            />
          </View>
        </View>
      )}

      {input.method === 'newton' && (
        <TechInput
          label="INITIAL GUESS (x0)"
          prefix="x0 ="
          placeholder="e.g. 2"
          keyboardType="numeric"
          value={input.x0 !== undefined ? String(input.x0) : ''}
          onChangeText={(text) => {
            const val = parseFloat(text);
            onChange({ x0: Number.isNaN(val) ? undefined : val });
          }}
        />
      )}

      {input.method === 'secant' && (
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <TechInput
              label="FIRST GUESS (x0)"
              prefix="x0 ="
              placeholder="e.g. 1"
              keyboardType="numeric"
              value={input.x0 !== undefined ? String(input.x0) : ''}
              onChangeText={(text) => {
                const val = parseFloat(text);
                onChange({ x0: Number.isNaN(val) ? undefined : val });
              }}
            />
          </View>
          <View style={styles.halfCol}>
            <TechInput
              label="SECOND GUESS (x1)"
              prefix="x1 ="
              placeholder="e.g. 2"
              keyboardType="numeric"
              value={input.x1 !== undefined ? String(input.x1) : ''}
              onChangeText={(text) => {
                const val = parseFloat(text);
                onChange({ x1: Number.isNaN(val) ? undefined : val });
              }}
            />
          </View>
        </View>
      )}

      {input.method === 'fixed-point' && (
        <TechInput
          label="INITIAL GUESS (x0)"
          prefix="x0 ="
          placeholder="e.g. 1.5"
          keyboardType="numeric"
          value={input.x0 !== undefined ? String(input.x0) : ''}
          onChangeText={(text) => {
            const val = parseFloat(text);
            onChange({ x0: Number.isNaN(val) ? undefined : val });
          }}
        />
      )}

      {/* Tolerance & Max Iterations */}
      <View style={styles.row}>
        <View style={styles.halfCol}>
          <TechInput
            label="ERROR TOLERANCE (ε)"
            prefix="ε ="
            placeholder="1e-6"
            value={String(input.tolerance)}
            onChangeText={(text) => {
              const val = parseFloat(text);
              if (!Number.isNaN(val) && val > 0) {
                onChange({ tolerance: val });
              }
            }}
          />
        </View>
        <View style={styles.halfCol}>
          <TechInput
            label="MAX ITERATIONS"
            prefix="N ="
            placeholder="50"
            keyboardType="number-pad"
            value={String(input.maxIterations)}
            onChangeText={(text) => {
              const val = parseInt(text, 10);
              if (!Number.isNaN(val) && val > 0) {
                onChange({ maxIterations: val });
              }
            }}
          />
        </View>
      </View>

      {/* Compute Button */}
      <TechButton
        label={isSolving ? 'COMPUTING ROOT...' : 'EXECUTE ALGORITHM'}
        variant="primary"
        icon="▶"
        onPress={onSolve}
        disabled={isSolving || !input.functionStr.trim()}
        style={styles.solveBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  presetsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  presetHeading: {
    color: Colors.textMuted,
    marginRight: 8,
  },
  presetChip: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  presetText: {
    color: Colors.accentCyan,
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCol: {
    flex: 0.485,
  },
  solveBtn: {
    marginTop: 6,
  },
});
