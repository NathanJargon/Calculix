import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { RootFindingInput, RootMethodType } from '../../types/rootFinding';
import { MathKeypad } from '../common/MathKeypad';
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
    { name: 'x³ - x - 2', fn: 'x^3 - x - 2', a: 1, b: 2 },
    { name: 'cos(x) - x', fn: 'cos(x) - x', a: 0, b: 1 },
    { name: 'e⁻ˣ - x', fn: 'e^(-x) - x', a: 0, b: 1 },
  ],
  newton: [
    { name: 'x³ - 2x - 5', fn: 'x^3 - 2*x - 5', x0: 2 },
    { name: 'cos(x) - x', fn: 'cos(x) - x', x0: 0.5 },
    { name: 'x² - 2 (√2)', fn: 'x^2 - 2', x0: 1 },
  ],
  secant: [
    { name: 'x³ - 2x - 5', fn: 'x^3 - 2*x - 5', x0: 1, x1: 2 },
    { name: 'Kepler Approx', fn: 'x - 0.2*sin(x) - 0.5', x0: 0, x1: 1 },
    { name: 'log(x) - 1', fn: 'log(x) - 1', x0: 2, x1: 3 },
  ],
  'fixed-point': [
    { name: 'x³ - 2x - 5', fn: 'x^3 - 2*x - 5', gFn: '(2*x + 5)^(1/3)', x0: 2 },
    { name: 'x = cos(x)', fn: 'cos(x) - x', gFn: 'cos(x)', x0: 0.5 },
    { name: 'x = (x+2/x)/2', fn: 'x^2 - 2', gFn: '(x + 2/x) / 2', x0: 1.5 },
  ],
};

export const RootInputForm: React.FC<RootInputFormProps> = ({
  input,
  onChange,
  onSolve,
  isSolving,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { colors } = useTheme();
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

  const handleInsertSymbol = (symbol: string) => {
    onChange({ functionStr: (input.functionStr || '') + symbol });
  };

  const handleBackspace = () => {
    const current = input.functionStr || '';
    if (current.length > 0) {
      onChange({ functionStr: current.slice(0, -1) });
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Quick Presets Bar */}
      <View style={[styles.presetsSection, { borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.presetHeading, { color: colors.textSecondary }]}>Examples:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {currentPresets.map((preset, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => applyPreset(preset)}
              style={[styles.presetChip, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.presetText, { color: colors.primary }]}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Function f(x) */}
      <TechInput
        label="Equation f(x) = 0"
        prefix="f(x) ="
        placeholder="e.g. x^3 - 2*x - 5"
        value={input.functionStr}
        onChangeText={(text) => onChange({ functionStr: text })}
        onClear={() => onChange({ functionStr: '' })}
      />

      {/* Quick Math Symbols Helper */}
      <MathKeypad
        onInsert={handleInsertSymbol}
        onBackspace={handleBackspace}
        onClear={() => onChange({ functionStr: '' })}
      />

      {/* Fixed Point g(x) */}
      {input.method === 'fixed-point' && (
        <TechInput
          label="Rearranged Form: x = g(x)"
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
              label="Start interval (a)"
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
              label="End interval (b)"
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
          label="Initial Guess (x₀)"
          prefix="x₀ ="
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
              label="First Guess (x₀)"
              prefix="x₀ ="
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
              label="Second Guess (x₁)"
              prefix="x₁ ="
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
          label="Initial Guess (x₀)"
          prefix="x₀ ="
          placeholder="e.g. 1.5"
          keyboardType="numeric"
          value={input.x0 !== undefined ? String(input.x0) : ''}
          onChangeText={(text) => {
            const val = parseFloat(text);
            onChange({ x0: Number.isNaN(val) ? undefined : val });
          }}
        />
      )}

      {/* Collapsible Advanced Settings */}
      <TouchableOpacity
        style={styles.advancedToggle}
        onPress={() => setShowAdvanced(!showAdvanced)}
        activeOpacity={0.7}
      >
        <Text style={[styles.advancedToggleText, { color: colors.secondary }]}>
          {showAdvanced ? '▾ Hide Settings' : '▸ Advanced Settings (Accuracy & Iterations)'}
        </Text>
      </TouchableOpacity>

      {showAdvanced && (
        <View style={[styles.advancedContainer, { backgroundColor: colors.surfaceSecondary }]}>
          <View style={styles.row}>
            <View style={styles.halfCol}>
              <TechInput
                label="Accuracy Goal"
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
                label="Max Steps"
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
        </View>
      )}

      {/* Calculate Root Button */}
      <TechButton
        label={isSolving ? 'Calculating Root...' : 'Find Root'}
        variant="primary"
        onPress={onSolve}
        disabled={isSolving || !input.functionStr.trim()}
        style={styles.solveBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
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
    fontWeight: '700',
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
    marginBottom: 4,
  },
  advancedToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  advancedContainer: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  solveBtn: {
    marginTop: 8,
  },
});
