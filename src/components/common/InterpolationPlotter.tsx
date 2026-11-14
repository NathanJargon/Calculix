import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { DataPoint } from '../../types/interpolation';

interface InterpolationPlotterProps {
  points: DataPoint[];
  targetX: number;
  interpolatedY?: number | null;
  title?: string;
}

export const InterpolationPlotter: React.FC<InterpolationPlotterProps> = ({
  points,
  targetX,
  interpolatedY,
  title = 'Fitted Interpolation Curve',
}) => {
  const { colors } = useTheme();
  const [plotWidth, setPlotWidth] = useState(300);
  const plotHeight = 180;

  const { toSvgX, toSvgY, pathD, targetSvgX, targetSvgY } = useMemo(() => {
    if (points.length < 2) {
      return {
        toSvgX: () => 0,
        toSvgY: () => 0,
        pathD: '',
        targetSvgX: 0,
        targetSvgY: null,
      };
    }

    // Domain range
    const allX = points.map((p) => p.x).concat(targetX);
    const allY = points.map((p) => p.y);
    if (interpolatedY !== undefined && interpolatedY !== null && !Number.isNaN(interpolatedY)) {
      allY.push(interpolatedY);
    }

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);

    // Evaluate exact Lagrange interpolating polynomial across 60 sample points
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    const hasDuplicateX = sortedPoints.some(
      (pt, i) => i > 0 && Math.abs(pt.x - sortedPoints[i - 1].x) < 1e-12
    );

    const evalPoly = (xVal: number): number => {
      let sum = 0;
      for (let i = 0; i < sortedPoints.length; i++) {
        let basis = 1;
        for (let j = 0; j < sortedPoints.length; j++) {
          if (i !== j) {
            basis *= (xVal - sortedPoints[j].x) / (sortedPoints[i].x - sortedPoints[j].x);
          }
        }
        sum += sortedPoints[i].y * basis;
      }
      return sum;
    };

    const samplePts: { x: number; y: number }[] = [];
    if (!hasDuplicateX) {
      const steps = 60;
      const stepSize = (maxX - minX) / steps || 1;
      for (let s = 0; s <= steps; s++) {
        const sxVal = minX + s * stepSize;
        const syVal = evalPoly(sxVal);
        if (Number.isFinite(syVal)) {
          samplePts.push({ x: sxVal, y: syVal });
        }
      }
    }

    const curveNodes = samplePts.length >= 2 ? samplePts : sortedPoints;
    const allCurveY = allY.concat(curveNodes.map((c) => c.y));
    const cMinY = Math.min(...allCurveY);
    const cMaxY = Math.max(...allCurveY);

    const padX = (maxX - minX) * 0.15 || 1;
    const padY = (cMaxY - cMinY) * 0.15 || 1;

    const plotMinX = minX - padX;
    const plotMaxX = maxX + padX;
    const plotMinY = cMinY - padY;
    const plotMaxY = cMaxY + padY;

    const transformX = (x: number) => {
      return ((x - plotMinX) / (plotMaxX - plotMinX)) * plotWidth;
    };

    const transformY = (y: number) => {
      return plotHeight - ((y - plotMinY) / (plotMaxY - plotMinY)) * plotHeight;
    };

    let d = '';
    curveNodes.forEach((pt, idx) => {
      const sx = transformX(pt.x);
      const sy = transformY(pt.y);
      if (idx === 0) {
        d += `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      } else {
        d += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      }
    });

    const tSvgX = transformX(targetX);
    const tSvgY = interpolatedY !== undefined && interpolatedY !== null ? transformY(interpolatedY) : null;

    return {
      toSvgX: transformX,
      toSvgY: transformY,
      pathD: d,
      targetSvgX: tSvgX,
      targetSvgY: tSvgY,
    };
  }, [points, targetX, interpolatedY, plotWidth]);

  if (points.length < 2) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onLayout={(e) => {
        const nextW = Math.round(e.nativeEvent.layout.width - 32);
        if (nextW > 50 && Math.abs(nextW - plotWidth) > 3) {
          setPlotWidth(nextW);
        }
      }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: colors.secondaryLight }]}>
          <Text style={[styles.badgeText, { color: colors.secondary }]}>Curve Fit</Text>
        </View>
      </View>

      <View style={[styles.plotBox, { backgroundColor: colors.surfaceSecondary }]}>
        <Svg width={plotWidth} height={plotHeight}>
          {/* Target X vertical guideline */}
          <Line
            x1={targetSvgX}
            y1={0}
            x2={targetSvgX}
            y2={plotHeight}
            stroke={colors.accent}
            strokeWidth={1.5}
            strokeDasharray="3,3"
          />

          {/* Interpolation connected curve */}
          {pathD ? (
            <Path
              d={pathD}
              fill="none"
              stroke={colors.secondary}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Data Points */}
          {points.map((pt) => {
            const sx = toSvgX(pt.x);
            const sy = toSvgY(pt.y);
            return (
              <Circle
                key={pt.id}
                cx={sx}
                cy={sy}
                r={5.5}
                fill={colors.secondary}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            );
          })}

          {/* Target Evaluated Point */}
          {targetSvgY !== null && (
            <>
              <Circle
                cx={targetSvgX}
                cy={targetSvgY}
                r={7}
                fill={colors.accent}
              />
              <Circle
                cx={targetSvgX}
                cy={targetSvgY}
                r={3}
                fill="#FFFFFF"
              />
              <SvgText
                x={Math.min(plotWidth - 65, Math.max(10, targetSvgX + 10))}
                y={Math.max(16, targetSvgY - 8)}
                fill={colors.accent}
                fontSize={11}
                fontWeight="bold"
              >
                ({targetX}, {interpolatedY?.toFixed(2)})
              </SvgText>
            </>
          )}
        </Svg>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.legendGroup}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Data Nodes ({points.length})</Text>
        </View>
        {interpolatedY !== undefined && interpolatedY !== null && (
          <View style={styles.legendGroup}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Target x*</Text>
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
  legendGroup: {
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
