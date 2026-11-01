import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatFloat } from '../../math/evaluator';
import { useTheme } from '../../theme/ThemeContext';
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
  const [activeTab, setActiveTab] = useState<'matrix' | 'polynomial'>('matrix');
  const [isExpanded, setIsExpanded] = useState(true);
  const { colors } = useTheme();

  if (!matrix || matrix.length === 0) {
    return null;
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Table Card Header with View Switcher */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.tabGroup, { backgroundColor: colors.surfaceSecondary }]}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'matrix' ? [styles.tabBtnActive, { backgroundColor: colors.primary }] : null]}
            onPress={() => setActiveTab('matrix')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'matrix' ? styles.tabBtnTextActive : { color: colors.textSecondary },
              ]}
            >
              Difference Matrix
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'polynomial' ? [styles.tabBtnActive, { backgroundColor: colors.primary }] : null,
            ]}
            onPress={() => setActiveTab('polynomial')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'polynomial' ? styles.tabBtnTextActive : { color: colors.textSecondary },
              ]}
            >
              Term Expansion
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Difference Matrix View */}
      {isExpanded && activeTab === 'matrix' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {/* Column Headers */}
            <View style={[styles.headerRow, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerCell, styles.idxCol, { color: colors.textSecondary }]}>i</Text>
              <Text style={[styles.headerCell, styles.valCol, { color: colors.textSecondary }]}>x_i</Text>
              <Text style={[styles.headerCell, styles.valCol, { color: colors.textSecondary }]}>f[x_i]</Text>
              {headers.slice(2).map((h, i) => (
                <Text key={i} style={[styles.headerCell, styles.valCol, { color: colors.textSecondary }]}>
                  {h}
                </Text>
              ))}
            </View>

            {/* Matrix Rows */}
            {points.map((pt, i) => {
              const rowValues = matrix[i] || [];
              const isEven = i % 2 === 0;

              return (
                <View
                  key={i}
                  style={[
                    styles.dataRow,
                    {
                      backgroundColor: isEven ? colors.surface : colors.background,
                      borderBottomColor: colors.borderLight,
                    },
                  ]}
                >
                  <Text style={[styles.cell, styles.idxCol, { color: colors.textMuted }]}>{i}</Text>
                  <Text style={[styles.cell, styles.valCol, { color: colors.textPrimary }]}>{formatFloat(pt.x, 4)}</Text>
                  <Text style={[styles.cell, styles.valCol, { color: colors.textPrimary }]}>{formatFloat(pt.y, 4)}</Text>

                  {/* Divided Difference Order Columns */}
                  {Array.from({ length: points.length - 1 }).map((_, orderIdx) => {
                    const val = rowValues[orderIdx + 1];
                    const isDiagonalCoeff = orderIdx + 1 === i + 1 && i === 0;

                    return (
                      <Text
                        key={orderIdx}
                        style={[
                          styles.cell,
                          styles.valCol,
                          val !== null && val !== undefined
                            ? isDiagonalCoeff
                              ? [styles.coeffCell, { color: colors.primary }]
                              : { color: colors.textPrimary }
                            : [styles.emptyCell, { color: colors.textMuted }],
                        ]}
                      >
                        {val !== null && val !== undefined ? formatFloat(val, 4) : '—'}
                      </Text>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Newton Polynomial Term Expansion View */}
      {isExpanded && activeTab === 'polynomial' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            <View style={[styles.headerRow, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerCell, styles.idxCol, { color: colors.textSecondary }]}>Term</Text>
              <Text style={[styles.headerCell, styles.coeffCol, { color: colors.textSecondary }]}>Coeff f[...]</Text>
              <Text style={[styles.headerCell, styles.factorCol, { color: colors.textSecondary }]}>Product Factor</Text>
              <Text style={[styles.headerCell, styles.valCol, { color: colors.textSecondary }]}>Term Value</Text>
              <Text style={[styles.headerCell, styles.valCol, { color: colors.textSecondary }]}>Running Sum</Text>
            </View>

            {terms.map((t, i) => (
              <View
                key={i}
                style={[
                  styles.dataRow,
                  {
                    backgroundColor: i % 2 === 0 ? colors.surface : colors.background,
                    borderBottomColor: colors.borderLight,
                  },
                ]}
              >
                <Text style={[styles.cell, styles.idxCol, { color: colors.textMuted }]}>{t.index}</Text>
                <Text style={[styles.cell, styles.coeffCol, { color: colors.primary, fontWeight: '700' }]}>
                  {formatFloat(t.coefficient, 5)}
                </Text>
                <Text style={[styles.cell, styles.factorCol, { color: colors.textPrimary }]}>{t.factors || '1'}</Text>
                <Text style={[styles.cell, styles.valCol, { color: colors.textPrimary }]}>
                  {formatFloat(t.termValue, 5)}
                </Text>
                <Text style={[styles.cellHighlight, styles.valCol, { color: colors.success }]}>
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
    borderWidth: 1,
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  tabGroup: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabBtnActive: {},
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableWrapper: {
    minWidth: 480,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerCell: {
    ...Typography.monoSm,
    fontWeight: '700',
    fontSize: 11,
  },
  cell: {
    ...Typography.monoSm,
    fontSize: 12,
  },
  cellHighlight: {
    ...Typography.monoSm,
    fontWeight: '800',
    fontSize: 12,
  },
  coeffCell: {
    fontWeight: '800',
  },
  emptyCell: {
    opacity: 0.4,
  },
  idxCol: {
    width: 32,
    textAlign: 'center',
  },
  valCol: {
    width: 90,
  },
  coeffCol: {
    width: 110,
  },
  factorCol: {
    width: 130,
  },
});
