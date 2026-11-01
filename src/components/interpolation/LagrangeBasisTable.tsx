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
import { LagrangeBasisTerm } from '../../types/interpolation';

interface LagrangeBasisTableProps {
  terms: LagrangeBasisTerm[];
}

export const LagrangeBasisTable: React.FC<LagrangeBasisTableProps> = ({ terms }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { colors } = useTheme();

  if (!terms || terms.length === 0) {
    return null;
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Table Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleText, { color: colors.textPrimary }]}>Lagrange Weights L_i(x)</Text>
          <View style={[styles.badge, { backgroundColor: colors.accentLight }]}>
            <Text style={[styles.badgeText, { color: colors.accent }]}>
              {terms.length} Basis Poly
            </Text>
          </View>
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

      {/* Basis Polynomials Table */}
      {isExpanded && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            <View style={[styles.headerRow, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerCell, styles.idxCol, { color: colors.textSecondary }]}>i</Text>
              <Text style={[styles.headerCell, styles.coordCol, { color: colors.textSecondary }]}>Node (x_i, y_i)</Text>
              <Text style={[styles.headerCell, styles.valCol, { color: colors.textSecondary }]}>L_i(x*)</Text>
              <Text style={[styles.headerCell, styles.valCol, { color: colors.textSecondary }]}>y_i · L_i(x*)</Text>
            </View>

            {terms.map((t) => (
              <View
                key={t.index}
                style={[
                  styles.dataRow,
                  {
                    backgroundColor: t.index % 2 === 0 ? colors.surface : colors.background,
                    borderBottomColor: colors.borderLight,
                  },
                ]}
              >
                <Text style={[styles.cell, styles.idxCol, { color: colors.textMuted }]}>{t.index}</Text>
                <Text style={[styles.cell, styles.coordCol, { color: colors.textPrimary }]}>
                  ({formatFloat(t.xi, 3)}, {formatFloat(t.yi, 3)})
                </Text>
                <Text style={[styles.cell, styles.valCol, styles.basisWeight, { color: colors.accent }]}>
                  {formatFloat(t.evaluatedBasisWeight, 5)}
                </Text>
                <Text style={[styles.cellHighlight, styles.valCol, { color: colors.success }]}>
                  {formatFloat(t.weightedValue, 5)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Analytical Basis Formulas List */}
      {isExpanded && (
        <View style={[styles.formulaSection, { backgroundColor: colors.surfaceSecondary, borderTopColor: colors.border }]}>
          <Text style={[styles.formulaHeading, { color: colors.textSecondary }]}>
            Cardinal Basis Algebraic Expressions:
          </Text>
          {terms.map((t) => (
            <View key={t.index} style={styles.formulaRow}>
              <Text style={[styles.formulaIndex, { color: colors.accent }]}>L_{t.index}(x) =</Text>
              <Text style={[Typography.monoSm, styles.formulaText, { color: colors.textPrimary }]}>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '800',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableWrapper: {
    minWidth: 460,
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
  basisWeight: {
    fontWeight: '800',
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
    padding: 14,
    borderTopWidth: 1,
  },
  formulaHeading: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '700',
  },
  formulaRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  formulaIndex: {
    width: 65,
    fontWeight: '800',
    fontSize: 12,
  },
  formulaText: {
    flex: 1,
    fontSize: 12,
  },
});
