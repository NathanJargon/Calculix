import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { compileFunction } from '../../math/evaluator';
import { useTheme } from '../../theme/ThemeContext';

interface FunctionPlotterProps {
  functionStr: string;
  root?: number | null;
  a?: number;
  b?: number;
  title?: string;
}

export const FunctionPlotter: React.FC<FunctionPlotterProps> = ({
  functionStr,
  root,
  a,
  b,
  title = 'Interactive Function Curve',
}) => {
  const { colors, isDark } = useTheme();
  const [plotWidth, setPlotWidth] = useState(300);
  const plotHeight = 180;

  // Determine x-domain
  let minX = -4;
  let maxX = 4;
  if (a !== undefined && b !== undefined) {
    const span = Math.abs(b - a);
    const pad = span > 0 ? span * 0.4 : 2;
    minX = Math.min(a, b) - pad;
    maxX = Math.max(a, b) + pad;
  } else if (root !== undefined && root !== null && !isNaN(root)) {
    minX = root - 3;
    maxX = root + 3;
  }

  // Sample points
  const steps = 60;
  const stepSize = (maxX - minX) / steps;
  const rawPoints: { x: number; y: number }[] = [];
  let minY = Infinity;
  let maxY = -Infinity;

  const compiledResult = compileFunction(functionStr);
  const evalFn = compiledResult.compiled?.evaluate;

  if (evalFn) {
    for (let i = 0; i <= steps; i++) {
      const x = minX + i * stepSize;
      try {
        const res = evalFn(x);
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          rawPoints.push({ x, y: res });
          if (res < minY) minY = res;
          if (res > maxY) maxY = res;
        }
      } catch {
        // Ignore point error
      }
    }
  }

  // Fallbacks if out of bounds
  if (!isFinite(minY) || !isFinite(maxY) || minY === maxY) {
    minY = -10;
    maxY = 10;
  }

  // Add 15% vertical padding
  const yPadding = (maxY - minY) * 0.15 || 2;
  const plotMinY = minY - yPadding;
  const plotMaxY = maxY + yPadding;

  // Coordinate transforms
  const toSvgX = (x: number) => {
    return ((x - minX) / (maxX - minX)) * plotWidth;
  };

  const toSvgY = (y: number) => {
    return plotHeight - ((y - plotMinY) / (plotMaxY - plotMinY)) * plotHeight;
  };

  // Build SVG Path
  let pathD = '';
  rawPoints.forEach((pt, index) => {
    const sx = toSvgX(pt.x);
    const sy = toSvgY(pt.y);
    if (index === 0) {
      pathD += `M ${sx} ${sy}`;
    } else {
      pathD += ` L ${sx} ${sy}`;
    }
  });

  const axisY = toSvgY(0);
  const axisX = toSvgX(0);

  const hasZeroAxisY = axisY >= 0 && axisY <= plotHeight;
  const hasZeroAxisX = axisX >= 0 && axisX <= plotWidth;

  const rootSvgX = root !== null && root !== undefined ? toSvgX(root) : null;
  const rootSvgY = toSvgY(0);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onLayout={(e) => setPlotWidth(e.nativeEvent.layout.width - 32)}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>f(x) Curve</Text>
        </View>
      </View>

      <View style={[styles.plotBox, { backgroundColor: colors.surfaceSecondary }]}>
        <Svg width={plotWidth} height={plotHeight}>
          {/* Horizontal X Axis (y=0) */}
          {hasZeroAxisY && (
            <Line
              x1={0}
              y1={axisY}
              x2={plotWidth}
              y2={axisY}
              stroke={colors.border}
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />
          )}

          {/* Vertical Y Axis (x=0) */}
          {hasZeroAxisX && (
            <Line
              x1={axisX}
              y1={0}
              x2={axisX}
              y2={plotHeight}
              stroke={colors.border}
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />
          )}

          {/* Bracket lines [a, b] if available */}
          {a !== undefined && (
            <Line
              x1={toSvgX(a)}
              y1={0}
              x2={toSvgX(a)}
              y2={plotHeight}
              stroke={colors.secondary}
              strokeWidth={1.5}
              strokeDasharray="2,2"
            />
          )}
          {b !== undefined && (
            <Line
              x1={toSvgX(b)}
              y1={0}
              x2={toSvgX(b)}
              y2={plotHeight}
              stroke={colors.secondary}
              strokeWidth={1.5}
              strokeDasharray="2,2"
            />
          )}

          {/* Function Curve */}
          {pathD ? (
            <Path
              d={pathD}
              fill="none"
              stroke={colors.primary}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Root marker */}
          {rootSvgX !== null && rootSvgX >= 0 && rootSvgX <= plotWidth && (
            <>
              <Circle
                cx={rootSvgX}
                cy={rootSvgY}
                r={7}
                fill={colors.primary}
              />
              <Circle
                cx={rootSvgX}
                cy={rootSvgY}
                r={3.5}
                fill="#FFFFFF"
              />
              <SvgText
                x={Math.min(plotWidth - 50, Math.max(10, rootSvgX - 20))}
                y={Math.max(16, rootSvgY - 12)}
                fill={colors.primary}
                fontSize={11}
                fontWeight="bold"
              >
                x* ≈ {root?.toFixed(3)}
              </SvgText>
            </>
          )}
        </Svg>
      </View>

      <View style={styles.footerRow}>
        <Text style={[styles.footerDomain, { color: colors.textMuted }]}>
          Domain: [{minX.toFixed(1)}, {maxX.toFixed(1)}]
        </Text>
        {root !== null && root !== undefined && (
          <View style={styles.rootLegend}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Root zero crossing</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  plotBox: {
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  footerDomain: {
    fontSize: 11,
    fontWeight: '600',
  },
  rootLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
