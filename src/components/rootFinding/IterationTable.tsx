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

  if (!iterations || iterations.length === 0) {
    return null;
  }

  const renderHeaders = () => {
    switch (method) {
      case 'bisection':
        return (
          <View style={styles.tableRowHeader}>
            <Text style={[styles.headerCell, styles.colIter]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum]}>a</Text>
            <Text style={[styles.headerCell, styles.colNum]}>b</Text>
            <Text style={[styles.headerCell, styles.colNum]}>c (x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum]}>f(c)</Text>
            <Text style={[styles.headerCell, styles.colNum]}>Rel Err %</Text>
            <Text style={[styles.headerCell, styles.colNum]}>Interval W</Text>
          </View>
        );
      case 'newton':
        return (
          <View style={styles.tableRowHeader}>
            <Text style={[styles.headerCell, styles.colIter]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum]}>x_n</Text>
            <Text style={[styles.headerCell, styles.colNum]}>f(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum]}>f'(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum]}>x_next</Text>
            <Text style={[styles.headerCell, styles.colNum]}>Rel Err %</Text>
          </View>
        );
      case 'secant':
        return (
          <View style={styles.tableRowHeader}>
            <Text style={[styles.headerCell, styles.colIter]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum]}>x_prev</Text>
            <Text style={[styles.headerCell, styles.colNum]}>x_n</Text>
            <Text style={[styles.headerCell, styles.colNum]}>f(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum]}>x_next</Text>
            <Text style={[styles.headerCell, styles.colNum]}>Rel Err %</Text>
          </View>
        );
      case 'fixed-point':
        return (
          <View style={styles.tableRowHeader}>
            <Text style={[styles.headerCell, styles.colIter]}>Iter</Text>
            <Text style={[styles.headerCell, styles.colNum]}>x_n</Text>
            <Text style={[styles.headerCell, styles.colNum]}>g(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum]}>f(x_n)</Text>
            <Text style={[styles.headerCell, styles.colNum]}>Rel Err %</Text>
          </View>
        );
    }
  };

  const renderRow = (it: RootIteration, index: number) => {
    const isLast = index === iterations.length - 1;
    const rowBg = isLast
      ? styles.lastRowBg
      : index % 2 === 0
      ? styles.evenRowBg
      : styles.oddRowBg;

    switch (method) {
      case 'bisection': {
        const row = it as BisectionIteration;
        return (
          <View key={index} style={[styles.tableRow, rowBg]}>
            <Text style={[styles.cell, styles.colIter]}>{row.iteration}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.a, 5)}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.b, 5)}</Text>
            <Text style={[styles.cellHighlight, styles.colNum]}>
              {formatFloat(row.x_n, 5)}
            </Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.f_xn, 4)}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.relError, 4)}%</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.absError, 4)}</Text>
          </View>
        );
      }
      case 'newton': {
        const row = it as NewtonIteration;
        return (
          <View key={index} style={[styles.tableRow, rowBg]}>
            <Text style={[styles.cell, styles.colIter]}>{row.iteration}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.x_n, 5)}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.f_xn, 4)}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.f_prime_xn, 4)}</Text>
            <Text style={[styles.cellHighlight, styles.colNum]}>
              {formatFloat(row.x_next, 5)}
            </Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.relError, 4)}%</Text>
          </View>
        );
      }
      case 'secant': {
        const row = it as SecantIteration;
        return (
          <View key={index} style={[styles.tableRow, rowBg]}>
            <Text style={[styles.cell, styles.colIter]}>{row.iteration}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.x_prev, 5)}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.x_n, 5)}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.f_xn, 4)}</Text>
            <Text style={[styles.cellHighlight, styles.colNum]}>
              {formatFloat(row.x_next, 5)}
            </Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.relError, 4)}%</Text>
          </View>
        );
      }
      case 'fixed-point': {
        const row = it as FixedPointIteration;
        return (
          <View key={index} style={[styles.tableRow, rowBg]}>
            <Text style={[styles.cell, styles.colIter]}>{row.iteration}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.x_n, 5)}</Text>
            <Text style={[styles.cellHighlight, styles.colNum]}>
              {formatFloat(row.g_xn, 5)}
            </Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.f_xn, 4)}</Text>
            <Text style={[styles.cell, styles.colNum]}>{formatFloat(row.relError, 4)}%</Text>
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.card}>
      {/* Header bar with toggle */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[Typography.label, styles.titleText]}>
            STEP-BY-STEP ITERATIONS
          </Text>
          <View style={styles.badge}>
            <Text style={[Typography.monoSm, styles.badgeText]}>
              {iterations.length} STEPS
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

      {/* Table content */}
      {isExpanded && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {renderHeaders()}
            <ScrollView style={styles.verticalScroll} nestedScrollEnabled={true}>
              {iterations.map((it, idx) => renderRow(it, idx))}
            </ScrollView>
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surfaceLight,
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
    minWidth: 500,
  },
  verticalScroll: {
    maxHeight: 320,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#0B0F17',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    alignItems: 'center',
  },
  evenRowBg: {
    backgroundColor: '#111722',
  },
  oddRowBg: {
    backgroundColor: '#141D2B',
  },
  lastRowBg: {
    backgroundColor: '#064E3B28',
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
  colIter: {
    width: 44,
  },
  colNum: {
    width: 95,
  },
});
