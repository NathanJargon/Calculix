import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
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
    name: 'Quadratic (x^2)',
    points: [
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
      { x: 4, y: 16 },
    ],
    targetX: 2.5,
  },
  {
    name: 'Thermodynamics (Steam)',
    points: [
      { x: 100, y: 0.598 },
      { x: 150, y: 1.013 },
      { x: 200, y: 1.554 },
      { x: 250, y: 2.241 },
    ],
    targetX: 175,
  },
  {
    name: 'Kinematics (Time/Vel)',
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
  const addPoint = () => {
    const lastX = points.length > 0 ? points[points.length - 1].x : 0;
    const newPoint: DataPoint = {
      id: Math.random().toString(36).substring(2, 9),
      x: lastX + 1,
      y: 0,
    };
    onPointsChange([...points, newPoint]);
  };

  const removePoint = (index: number) => {
    if (points.length <= 2) {
      return; // Keep at least 2 points
    }
    const updated = points.filter((_, idx) => idx !== index);
    onPointsChange(updated);
  };

  const updatePoint = (index: number, field: 'x' | 'y', valueStr: string) => {
    const val = parseFloat(valueStr);
    const updated = [...points];
    updated[index] = {
      ...updated[index],
      [field]: Number.isNaN(val) ? 0 : val,
    };
    onPointsChange(updated);
  };

  const loadPreset = (preset: InterpolationPreset) => {
    const formatted = preset.points.map((p) => ({
      id: Math.random().toString(36).substring(2, 9),
      x: p.x,
      y: p.y,
    }));
    onPointsChange(formatted);
    onTargetXChange(preset.targetX);
  };

  return (
    <View style={styles.card}>
      {/* Presets Header */}
      <View style={styles.presetSection}>
        <Text style={[Typography.monoSm, styles.presetHeading]}>PRESETS:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PRESETS.map((preset, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => loadPreset(preset)}
              style={styles.presetChip}
            >
              <Text style={[Typography.monoSm, styles.presetText]}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Target X Input */}
      <TechInput
        label="EVALUATION TARGET (x*)"
        prefix="x* ="
        placeholder="e.g. 2.5"
        keyboardType="numeric"
        value={String(targetX)}
        onChangeText={(text) => {
          const val = parseFloat(text);
          onTargetXChange(Number.isNaN(val) ? 0 : val);
        }}
      />

      {/* Points Table Header */}
      <View style={styles.pointsHeaderRow}>
        <Text style={[Typography.label, styles.pointsTitle]}>
          COORDINATE PAIRS ({points.length} POINTS)
        </Text>
        <TouchableOpacity
          onPress={addPoint}
          activeOpacity={0.7}
          style={styles.addBtn}
        >
          <Text style={[Typography.monoSm, styles.addBtnText]}>+ ADD POINT</Text>
        </TouchableOpacity>
      </View>

      {/* Column labels */}
      <View style={styles.colHeaderRow}>
        <Text style={[styles.colHeaderCell, styles.idxCol]}>#</Text>
        <Text style={[styles.colHeaderCell, styles.coordCol]}>x_i</Text>
        <Text style={[styles.colHeaderCell, styles.coordCol]}>y_i</Text>
        <Text style={[styles.colHeaderCell, styles.actionCol]}>DEL</Text>
      </View>

      {/* Points List */}
      {points.map((p, index) => (
        <View key={p.id} style={styles.pointRow}>
          <Text style={[Typography.monoSm, styles.idxCell]}>{index}</Text>

          <View style={styles.inputCell}>
            <TextInput
              style={[Typography.mono, styles.coordInput]}
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
              defaultValue={String(p.x)}
              onChangeText={(t) => updatePoint(index, 'x', t)}
            />
          </View>

          <View style={styles.inputCell}>
            <TextInput
              style={[Typography.mono, styles.coordInput]}
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
              defaultValue={String(p.y)}
              onChangeText={(t) => updatePoint(index, 'y', t)}
            />
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            disabled={points.length <= 2}
            onPress={() => removePoint(index)}
          >
            <Text
              style={[
                styles.deleteIcon,
                points.length <= 2 ? styles.deleteIconDisabled : null,
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Execute Button */}
      <TechButton
        label={isSolving ? 'CALCULATING INTERPOLATION...' : 'EVALUATE INTERPOLATION'}
        variant="primary"
        icon="⚡"
        onPress={onSolve}
        disabled={isSolving || points.length < 2}
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
  presetSection: {
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
  pointsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  pointsTitle: {
    color: Colors.textSecondary,
  },
  addBtn: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.borderActive,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  addBtnText: {
    color: Colors.accentCyan,
    fontWeight: '700',
    fontSize: 10,
  },
  colHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 4,
  },
  colHeaderCell: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
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
    marginBottom: 6,
  },
  idxCell: {
    width: 28,
    textAlign: 'center',
    color: Colors.textMuted,
  },
  inputCell: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: '#090D14',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
  },
  coordInput: {
    color: Colors.textPrimary,
    fontSize: 13,
    paddingVertical: 5,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  deleteBtn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    color: Colors.accentRose,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteIconDisabled: {
    color: Colors.border,
  },
  solveBtn: {
    marginTop: 12,
  },
});
