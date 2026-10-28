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
import { LagrangeBasisTerm } from '../../types/interpolation';

interface LagrangeBasisTableProps {
  terms: LagrangeBasisTerm[];
}

export const LagrangeBasisTable: React.FC<LagrangeBasisTableProps> = ({
  terms,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!terms || terms.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[Typography.label, styles.titleText]}>
            LAGRANGE BASIS POLYNOMIALS L_i(x)
          </Text>
          <View style={styles.badge}>
            <Text style={[Typography.monoSm, styles.badgeText]}>
              {terms.length} BASIS TERMS
            </Text>
          </View>
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
      {isExpanded && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.idxCol]}>i</Text>
              <Text style={[styles.headerCell, styles.coordCol]}>(x_i, y_i)</Text>
              <Text style={[styles.headerCell, styles.valCol]}>L_i(x*)</Text>
              <Text style={[styles.headerCell, styles.valCol]}>y_i · L_i(x*)</Text>
              <Text style={[styles.headerCell, styles.valCol]}>Cumulative P</Text>
            </View>

            {terms.map((t, idx) => (
              <View
                key={idx}
                style={[
                  styles.dataRow,
                  idx % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                <Text style={[styles.cell, styles.idxCol]}>L_{t.index}</Text>
                <Text style={[styles.cell, styles.coordCol]}>
                  ({formatFloat(t.xi, 3)}, {formatFloat(t.yi, 3)})
                </Text>
                <Text style={[styles.cell, styles.valCol, styles.basisWeight]}>
                  {formatFloat(t.evaluatedBasisWeight, 5)}
                </Text>
                <Text style={[styles.cell, styles.valCol]}>
                  {formatFloat(t.weightedValue, 5)}
                </Text>
                <Text style={[styles.cellHighlight, styles.valCol]}>
                  {formatFloat(t.cumulativeSum, 5)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Basis formulas list */}
      {isExpanded && (
        <View style={styles.formulaSection}>
          <Text style={[Typography.label, styles.formulaHeading]}>
            EXACT BASIS FORMULAS:
          </Text>
          {terms.map((t) => (
            <View key={t.index} style={styles.formulaRow}>
              <Text style={[Typography.monoSm, styles.formulaIndex]}>
                L_{t.index}(x) =
              </Text>
              <Text
                style={[Typography.monoSm, styles.formulaText]}
                numberOfLines={2}
                selectable
              >
                {t.basisFormula}
              </Text>
            </View>
          ))}
        </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: Colors.textSecondary,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#0284C720',
    borderColor: '#0284C7',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeText: {
    color: Colors.accentCyan,
    fontSize: 10,
    fontWeight: '700',
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
    minWidth: 460,
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
  basisWeight: {
    color: Colors.accentViolet,
    fontWeight: '600',
  },
  idxCol: {
    width: 44,
    textAlign: 'center',
  },
  coordCol: {
    width: 120,
  },
  valCol: {
    width: 100,
  },
  formulaSection: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#080C12',
  },
  formulaHeading: {
    color: Colors.textMuted,
    marginBottom: 6,
    fontSize: 10,
  },
  formulaRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  formulaIndex: {
    color: Colors.accentViolet,
    width: 65,
    fontWeight: '600',
  },
  formulaText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 11,
  },
});
