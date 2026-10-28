import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatFloat } from '../../math/evaluator';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { DataPoint, NewtonTermBreakdown } from '../../types/interpolation';

interface DividedDiffTableProps {
  headers: string[];
  matrix: number[][];
  points: DataPoint[];
  terms: NewtonTermBreakdown[];
}

export const DividedDiffTable: React.FC<DividedDiffTableProps> = ({
  headers,
  matrix,
  points,
  terms,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'breakdown'>('table');
  const [isExpanded, setIsExpanded] = useState(true);

  if (!matrix || matrix.length === 0) {
    return null;
  }

  const n = points.length;

  return (
    <View style={styles.card}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.tabGroup}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'table' ? styles.tabBtnActive : null,
            ]}
            onPress={() => setActiveTab('table')}
          >
            <Text
              style={[
                Typography.monoSm,
                styles.tabBtnText,
                activeTab === 'table' ? styles.tabBtnTextActive : null,
              ]}
            >
              DIFF TABLE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'breakdown' ? styles.tabBtnActive : null,
            ]}
            onPress={() => setActiveTab('breakdown')}
          >
            <Text
              style={[
                Typography.monoSm,
                styles.tabBtnText,
                activeTab === 'breakdown' ? styles.tabBtnTextActive : null,
              ]}
            >
              TERM BREAKDOWN
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.toggleBtn}
        >
          <Text style={[Typography.monoSm, styles.toggleText]}>
            {isExpanded ? 'COLLAPSE ▲' : 'EXPAND ▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isExpanded && activeTab === 'table' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {/* Table Headers */}
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.idxCol]}>i</Text>
              <Text style={[styles.headerCell, styles.valCol]}>x_i</Text>
              {headers.slice(1).map((h, colIdx) => (
                <Text
                  key={colIdx}
                  style={[
                    styles.headerCell,
                    styles.valCol,
                    colIdx === 0 ? styles.firstDiffCol : null,
                  ]}
                >
                  {h}
                </Text>
              ))}
            </View>

            {/* Matrix Rows */}
            {points.map((p, rowIdx) => (
              <View
                key={rowIdx}
                style={[
                  styles.dataRow,
                  rowIdx % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                <Text style={[styles.cell, styles.idxCol]}>{rowIdx}</Text>
                <Text style={[styles.cell, styles.valCol]}>
                  {formatFloat(p.x, 4)}
                </Text>

                {Array.from({ length: n }).map((_, colIdx) => {
                  const val = matrix[rowIdx][colIdx];
                  const isCoefficient = rowIdx === 0;
                  const isAvailable = rowIdx + colIdx < n;

                  return (
                    <Text
                      key={colIdx}
                      style={[
                        styles.cell,
                        styles.valCol,
                        isCoefficient && isAvailable ? styles.coeffCell : null,
                        !isAvailable ? styles.emptyCell : null,
                      ]}
                    >
                      {isAvailable ? formatFloat(val, 4) : '—'}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Term-by-Term Breakdown */}
      {isExpanded && activeTab === 'breakdown' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.idxCol]}>k</Text>
              <Text style={[styles.headerCell, styles.coeffCol]}>Coeff (a_k)</Text>
              <Text style={[styles.headerCell, styles.factorCol]}>Factor Π(x*-xj)</Text>
              <Text style={[styles.headerCell, styles.valCol]}>Term Value</Text>
              <Text style={[styles.headerCell, styles.valCol]}>Cumulative P(x*)</Text>
            </View>

            {terms.map((t, idx) => (
              <View
                key={idx}
                style={[
                  styles.dataRow,
                  idx % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                <Text style={[styles.cell, styles.idxCol]}>{t.index}</Text>
                <Text style={[styles.cell, styles.coeffCol, styles.coeffCell]}>
                  {formatFloat(t.coefficient, 5)}
                </Text>
                <Text style={[styles.cell, styles.factorCol]}>
                  {formatFloat(t.evaluatedFactor, 4)}
                </Text>
                <Text style={[styles.cell, styles.valCol]}>
                  {formatFloat(t.termValue, 5)}
                </Text>
                <Text style={[styles.cellHighlight, styles.valCol]}>
                  {formatFloat(t.cumulativeSum, 5)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 5,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tabBtnActive: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.borderActive,
    borderWidth: 1,
  },
  tabBtnText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: Colors.accentCyan,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  toggleText: {
    color: Colors.accentCyan,
    fontSize: 10,
    fontWeight: '600',
  },
  tableWrapper: {
    minWidth: 480,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#0B0F17',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#111722',
  },
  oddRow: {
    backgroundColor: '#141D2B',
  },
  headerCell: {
    ...Typography.monoSm,
    fontWeight: '700',
    color: Colors.textSecondary,
    fontSize: 11,
  },
  cell: {
    ...Typography.monoSm,
    color: Colors.textPrimary,
    fontSize: 12,
  },
  cellHighlight: {
    ...Typography.monoSm,
    color: Colors.accentEmerald,
    fontWeight: '700',
    fontSize: 12,
  },
  coeffCell: {
    color: Colors.accentCyan,
    fontWeight: '700',
  },
  emptyCell: {
    color: Colors.textMuted,
    opacity: 0.4,
  },
  idxCol: {
    width: 32,
    textAlign: 'center',
  },
  valCol: {
    width: 90,
  },
  firstDiffCol: {
    color: Colors.accentTeal,
  },
  coeffCol: {
    width: 110,
  },
  factorCol: {
    width: 130,
  },
});
