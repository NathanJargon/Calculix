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
import {
  BisectionIteration,
  FixedPointIteration,
  NewtonIteration,
  RootIteration,
  RootMethodType,
  SecantIteration,
} from '../../types/rootFinding';

interface IterationTableProps {
  method: RootMethodType;
  iterations: RootIteration[];
}

export const IterationTable: React.FC<IterationTableProps> = ({
  method,
  iterations,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { colors } = useTheme();

  if (!iterations || iterations.length === 0) {
    return null;
  }

  const renderHeaders = () => {
    switch (method) {
      case 'bisection':
        return (
          <View style={[styles.tableRowHeader, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.headerCell, styles.colIter, { color: colors.textSecondary }]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>a</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>b</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>x_n (mid)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>f(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>Rel Err %</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>Abs Error</Text>
          </View>
        );
      case 'newton':
        return (
          <View style={[styles.tableRowHeader, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.headerCell, styles.colIter, { color: colors.textSecondary }]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>x_n</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>f(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>f'(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>x_next</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>Rel Err %</Text>
          </View>
        );
      case 'secant':
        return (
          <View style={[styles.tableRowHeader, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.headerCell, styles.colIter, { color: colors.textSecondary }]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>x_(n-1)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>x_n</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>f(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>x_next</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>Rel Err %</Text>
          </View>
        );
      case 'fixed-point':
        return (
          <View style={[styles.tableRowHeader, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.headerCell, styles.colIter, { color: colors.textSecondary }]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>x_n</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>g(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>f(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum, { color: colors.textSecondary }]}>Rel Err %</Text>
          </View>
        );
    }
  };

  const renderRow = (iter: RootIteration, index: number, isLast: boolean) => {
    const isEven = index % 2 === 0;
    const rowBg = isLast
      ? colors.successLight
      : isEven
      ? colors.surface
      : colors.background;

    switch (method) {
      case 'bisection': {
        const item = iter as BisectionIteration;
        return (
          <View
            key={item.iteration}
            style={[
              styles.tableRow,
              { backgroundColor: rowBg, borderBottomColor: colors.borderLight },
            ]}
          >
            <Text style={[styles.cell, styles.colIter, { color: colors.textMuted }]}>{item.iteration}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.a, 5)}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.b, 5)}</Text>
            <Text
              style={[
                isLast ? [styles.cellHighlight, { color: colors.success }] : styles.cell,
                styles.colNum,
                !isLast ? { color: colors.textPrimary } : null,
              ]}
            >
              {formatFloat(item.x_n, 6)}
            </Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.f_xn, 4)}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textSecondary }]}>
              {item.relError !== undefined ? `${formatFloat(item.relError, 3)}%` : '-'}
            </Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textSecondary }]}>{formatFloat(item.absError, 5)}</Text>
          </View>
        );
      }
      case 'newton': {
        const item = iter as NewtonIteration;
        return (
          <View
            key={item.iteration}
            style={[
              styles.tableRow,
              { backgroundColor: rowBg, borderBottomColor: colors.borderLight },
            ]}
          >
            <Text style={[styles.cell, styles.colIter, { color: colors.textMuted }]}>{item.iteration}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.x_n, 6)}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.f_xn, 4)}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.f_prime_xn, 4)}</Text>
            <Text
              style={[
                isLast ? [styles.cellHighlight, { color: colors.success }] : styles.cell,
                styles.colNum,
                !isLast ? { color: colors.textPrimary } : null,
              ]}
            >
              {formatFloat(item.x_next, 6)}
            </Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textSecondary }]}>
              {item.relError !== undefined ? `${formatFloat(item.relError, 3)}%` : '-'}
            </Text>
          </View>
        );
      }
      case 'secant': {
        const item = iter as SecantIteration;
        return (
          <View
            key={item.iteration}
            style={[
              styles.tableRow,
              { backgroundColor: rowBg, borderBottomColor: colors.borderLight },
            ]}
          >
            <Text style={[styles.cell, styles.colIter, { color: colors.textMuted }]}>{item.iteration}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.x_prev, 5)}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.x_n, 5)}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.f_xn, 4)}</Text>
            <Text
              style={[
                isLast ? [styles.cellHighlight, { color: colors.success }] : styles.cell,
                styles.colNum,
                !isLast ? { color: colors.textPrimary } : null,
              ]}
            >
              {formatFloat(item.x_next, 6)}
            </Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textSecondary }]}>
              {item.relError !== undefined ? `${formatFloat(item.relError, 3)}%` : '-'}
            </Text>
          </View>
        );
      }
      case 'fixed-point': {
        const item = iter as FixedPointIteration;
        return (
          <View
            key={item.iteration}
            style={[
              styles.tableRow,
              { backgroundColor: rowBg, borderBottomColor: colors.borderLight },
            ]}
          >
            <Text style={[styles.cell, styles.colIter, { color: colors.textMuted }]}>{item.iteration}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.x_n, 6)}</Text>
            <Text
              style={[
                isLast ? [styles.cellHighlight, { color: colors.success }] : styles.cell,
                styles.colNum,
                !isLast ? { color: colors.textPrimary } : null,
              ]}
            >
              {formatFloat(item.g_xn, 6)}
            </Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textPrimary }]}>{formatFloat(item.f_xn, 4)}</Text>
            <Text style={[styles.cell, styles.colNum, { color: colors.textSecondary }]}>
              {item.relError !== undefined ? `${formatFloat(item.relError, 3)}%` : '-'}
            </Text>
          </View>
        );
      }
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Table Section Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleText, { color: colors.textPrimary }]}>Iteration Steps</Text>
          <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {iterations.length} steps
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

      {/* Table Horizontal and Vertical Scroll */}
      {isExpanded && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {renderHeaders()}
            <ScrollView
              nestedScrollEnabled={true}
              style={styles.verticalScroll}
              showsVerticalScrollIndicator={true}
            >
              {iterations.map((iter, index) =>
                renderRow(iter, index, index === iterations.length - 1)
              )}
            </ScrollView>
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
    paddingHorizontal: 18,
    paddingVertical: 14,
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableWrapper: {
    minWidth: 500,
  },
  verticalScroll: {
    maxHeight: 320,
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  colIter: {
    width: 44,
  },
  colNum: {
    width: 95,
  },
});
