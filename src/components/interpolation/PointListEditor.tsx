import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../theme/typography';
import { DataPoint, InterpolationMethodType } from '../../types/interpolation';
import { TechButton } from '../common/TechButton';
import { TechInput } from '../common/TechInput';

interface PointListEditorProps {
  method: InterpolationMethodType;
  points: DataPoint[];
  targetX: number;
  onPointsChange: (points: DataPoint[]) => void;
  onTargetXChange: (x: number) => void;
  onSolve: () => void;
  isSolving?: boolean;
}

interface InterpolationPreset {
  name: string;
  points: { x: number; y: number }[];
  targetX: number;
}

const PRESETS: InterpolationPreset[] = [
  {
    name: 'Quadratic (x²)',
    points: [
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
      { x: 4, y: 16 },
    ],
    targetX: 2.5,
  },
  {
    name: 'Thermodynamics',
    points: [
      { x: 100, y: 0.598 },
      { x: 150, y: 1.013 },
      { x: 200, y: 1.554 },
      { x: 250, y: 2.241 },
    ],
    targetX: 175,
  },
  {
    name: 'Velocity Data',
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 227.04 },
      { x: 15, y: 362.78 },
      { x: 20, y: 517.35 },
      { x: 22.5, y: 602.97 },
    ],
    targetX: 16,
  },
];

export const PointListEditor: React.FC<PointListEditorProps> = ({
  points,
  targetX,
  onPointsChange,
  onTargetXChange,
  onSolve,
  isSolving,
}) => {
  const { colors } = useTheme();
  const [targetXInput, setTargetXInput] = useState(String(targetX));
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');

  const addPoint = () => {
    const lastX = points.length > 0 && !Number.isNaN(points[points.length - 1].x)
      ? points[points.length - 1].x
      : 0;
    const newPoint: DataPoint = {
      id: Math.random().toString(36).substring(2, 9),
      x: lastX + 1,
      y: 0,
      rawX: String(lastX + 1),
      rawY: '0',
    };
    onPointsChange([...points, newPoint]);
  };

  const removePoint = (index: number) => {
    if (points.length <= 2) {
      return;
    }
    const updated = points.filter((_, idx) => idx !== index);
    onPointsChange(updated);
  };

  const updatePoint = (index: number, field: 'x' | 'y', valueStr: string) => {
    const val = parseFloat(valueStr);
    const updated = [...points];
    const rawKey = field === 'x' ? 'rawX' : 'rawY';
    updated[index] = {
      ...updated[index],
      [field]: Number.isNaN(val) ? NaN : val,
      [rawKey]: valueStr,
    };
    onPointsChange(updated);
  };

  const loadPreset = (preset: InterpolationPreset) => {
    const formatted: DataPoint[] = preset.points.map((p) => ({
      id: Math.random().toString(36).substring(2, 9),
      x: p.x,
      y: p.y,
      rawX: String(p.x),
      rawY: String(p.y),
    }));
    onPointsChange(formatted);
    setTargetXInput(String(preset.targetX));
    onTargetXChange(preset.targetX);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* CSV Paste Modal */}
      <Modal
        visible={csvModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCsvModalOpen(false)}
      >
        <View style={styles.csvOverlay}>
          <View
            style={[styles.csvSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.csvTitle, { color: colors.textPrimary }]}>
              Paste Coordinate Data
            </Text>
            <Text style={[styles.csvSubtitle, { color: colors.textSecondary }]}>
              One pair per line, comma or tab separated.{'\n'}Example: 1, 2.5
            </Text>
            <TextInput
              style={[
                styles.csvInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              multiline
              placeholder={'1, 2.5\n2, 4.1\n3, 8.9'}
              placeholderTextColor={colors.textMuted}
              value={csvText}
              onChangeText={setCsvText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.csvBtnRow}>
              <TouchableOpacity
                style={[styles.csvBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => {
                  setCsvModalOpen(false);
                  setCsvText('');
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.csvBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.csvBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.7}
                onPress={() => {
                  const lines = csvText
                    .split('\n')
                    .map((l) => l.trim())
                    .filter(Boolean);
                  const parsed = lines
                    .map((line) => line.split(/[,\t;]+/).map(Number))
                    .filter((pair) => pair.length >= 2 && pair.every((v) => !Number.isNaN(v)));
                  if (parsed.length < 2) {
                    Alert.alert('Invalid Data', 'Enter at least 2 valid coordinate pairs.');
                    return;
                  }
                  const newPoints: DataPoint[] = parsed.map(([x, y], i) => ({
                    id: `csv-${Date.now()}-${i}`,
                    x,
                    y,
                    rawX: String(x),
                    rawY: String(y),
                  }));
                  onPointsChange(newPoints);
                  setCsvModalOpen(false);
                  setCsvText('');
                }}
              >
                <Text style={[styles.csvBtnText, styles.csvBtnTextWhite]}>Parse Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Presets Header */}
      <View style={[styles.presetSection, { borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.presetHeading, { color: colors.textSecondary }]}>Examples:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PRESETS.map((preset, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => loadPreset(preset)}
              style={[styles.presetChip, { backgroundColor: colors.secondaryLight }]}
            >
              <Text style={[styles.presetText, { color: colors.secondary }]}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Target X Input */}
      <TechInput
        label="Estimate Value at (x*)"
        prefix="x* ="
        placeholder="e.g. 2.5"
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
        value={targetXInput}
        onChangeText={(text) => {
          setTargetXInput(text);
          const val = parseFloat(text);
          if (!Number.isNaN(val)) {
            onTargetXChange(val);
          }
        }}
      />

      {/* Points Table Header */}
      <View style={styles.pointsHeaderRow}>
        <Text style={[styles.pointsTitle, { color: colors.textPrimary }]}>
          Known Data Points ({points.length})
        </Text>
        <View style={styles.pointsHeaderActions}>
          <TouchableOpacity
            onPress={() => setCsvModalOpen(true)}
            activeOpacity={0.7}
            style={[styles.addBtn, styles.csvTriggerBtn, { backgroundColor: colors.accentLight }]}
          >
            <Text style={[styles.addBtnText, { color: colors.accent }]}>Paste CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={addPoint}
            activeOpacity={0.7}
            accessibilityLabel="Add data point"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.addBtn, { backgroundColor: colors.secondaryLight }]}
          >
            <Text style={[styles.addBtnText, { color: colors.secondary }]}>+ Add Point</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Column labels */}
      <View style={[styles.colHeaderRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.colHeaderCell, styles.idxCol, { color: colors.textMuted }]}>#</Text>
        <Text style={[styles.colHeaderCell, styles.coordCol, { color: colors.textMuted }]}>x (input)</Text>
        <Text style={[styles.colHeaderCell, styles.coordCol, { color: colors.textMuted }]}>y (output)</Text>
        <Text style={[styles.colHeaderCell, styles.actionCol, { color: colors.textMuted }]}>Del</Text>
      </View>

      {/* Points List */}
      {points.map((p, index) => (
        <View key={p.id} style={styles.pointRow}>
          <Text style={[styles.idxCell, { color: colors.textMuted }]}>{index + 1}</Text>

          <View style={[styles.inputCell, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
            <TextInput
              style={[Typography.mono, styles.coordInput, { color: colors.textPrimary }]}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              placeholderTextColor={colors.textMuted}
              value={p.rawX !== undefined ? p.rawX : String(p.x)}
              onChangeText={(t) => updatePoint(index, 'x', t)}
            />
          </View>

          <View style={[styles.inputCell, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
            <TextInput
              style={[Typography.mono, styles.coordInput, { color: colors.textPrimary }]}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              placeholderTextColor={colors.textMuted}
              value={p.rawY !== undefined ? p.rawY : String(p.y)}
              onChangeText={(t) => updatePoint(index, 'y', t)}
            />
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            disabled={points.length <= 2}
            onPress={() => removePoint(index)}
            accessibilityLabel={`Remove point ${index + 1}`}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={[
                styles.deleteIcon,
                { color: points.length <= 2 ? colors.border : colors.error },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Execute Button */}
      <TechButton
        label={isSolving ? 'Interpolating...' : 'Calculate Interpolation'}
        variant="primary"
        onPress={onSolve}
        disabled={isSolving || points.length < 2}
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
  presetSection: {
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
    fontWeight: '700',
  },
  pointsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  pointsHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    minHeight: 34,
    justifyContent: 'center',
  },
  addBtnText: {
    fontWeight: '800',
    fontSize: 11,
  },
  colHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    marginBottom: 6,
  },
  colHeaderCell: {
    fontSize: 11,
    fontWeight: '700',
  },
  idxCol: {
    width: 28,
    textAlign: 'center',
  },
  coordCol: {
    flex: 1,
    textAlign: 'center',
  },
  actionCol: {
    width: 36,
    textAlign: 'center',
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  idxCell: {
    width: 28,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  inputCell: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 14,
  },
  coordInput: {
    fontSize: 13,
    paddingVertical: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontWeight: '700',
  },
  deleteBtn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 14,
    fontWeight: '800',
  },
  solveBtn: {
    marginTop: 14,
  },
  csvOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  csvSheet: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },
  csvTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  csvSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  csvInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  csvBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  csvBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  csvBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  csvBtnTextWhite: {
    color: '#FFFFFF',
  },
  csvTriggerBtn: {
    marginRight: 6,
  },
});
