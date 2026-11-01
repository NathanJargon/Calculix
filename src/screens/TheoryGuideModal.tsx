import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../theme/typography';

interface TheoryGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TheoryGuideModal: React.FC<TheoryGuideModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Method Guide
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.primary }]}>
                Formulas, convergence, and quick rules
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            >
              <Text style={[styles.closeBtnText, { color: colors.textPrimary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollBody} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* 1. Bisection */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.secondaryLight }]}>
                <Text style={[styles.badgeText, { color: colors.secondary }]}>ORDER 1 (LINEAR)</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                1. Bisection Method
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Requires an interval [a, b] such that f(a) · f(b) &lt; 0. By the
                Intermediate Value Theorem, at least one real root exists.
              </Text>
              <View style={[styles.codeSnippet, { backgroundColor: colors.surface, borderLeftColor: colors.secondary }]}>
                <Text style={[styles.codeFormula, { color: colors.textPrimary }]}>
                  c = (a + b) / 2
                </Text>
                <Text style={[styles.codeFormula, { color: colors.textSecondary }]}>
                  Max Error Bound: ε_n ≤ (b - a) / 2^n
                </Text>
              </View>
            </View>

            {/* 2. Newton-Raphson */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>ORDER 2 (QUADRATIC)</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                2. Newton-Raphson Method
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Uses the tangent line at x_n. Highly efficient when starting near
                a simple root. Fails if f'(x) = 0 (horizontal tangent).
              </Text>
              <View style={[styles.codeSnippet, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
                <Text style={[styles.codeFormula, { color: colors.textPrimary }]}>
                  x_(n+1) = x_n - f(x_n) / f'(x_n)
                </Text>
              </View>
            </View>

            {/* 3. Secant */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.accentLight }]}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>ORDER ≈ 1.618</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                3. Secant Method
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Approximates the derivative using a finite-difference secant line
                connecting two points (x_(n-1), x_n).
              </Text>
              <View style={[styles.codeSnippet, { backgroundColor: colors.surface, borderLeftColor: colors.accent }]}>
                <Text style={[styles.codeFormula, { color: colors.textPrimary }]}>
                  x_(n+1) = x_n - f(x_n) · (x_n - x_(n-1)) / (f(x_n) - f(x_(n-1)))
                </Text>
              </View>
            </View>

            {/* 4. Fixed-Point */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.badgeText, { color: colors.success }]}>CONTRACTION MAPPING</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                4. Fixed-Point Iteration
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Converts f(x) = 0 into x = g(x). Converges locally to root x*
                whenever |g'(x)| &lt; 1 in the neighborhood.
              </Text>
              <View style={[styles.codeSnippet, { backgroundColor: colors.surface, borderLeftColor: colors.success }]}>
                <Text style={[styles.codeFormula, { color: colors.textPrimary }]}>
                  x_(n+1) = g(x_n)
                </Text>
              </View>
            </View>

            {/* 5. Newton Divided Differences */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.secondaryLight }]}>
                <Text style={[styles.badgeText, { color: colors.secondary }]}>TABLE RECURRENCE</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                5. Newton's Divided Differences
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Constructs a triangular difference table. Ideal for evaluating
                interpolating polynomials P_n(x).
              </Text>
              <View style={[styles.codeSnippet, { backgroundColor: colors.surface, borderLeftColor: colors.secondary }]}>
                <Text style={[styles.codeFormula, { color: colors.textPrimary }]}>
                  f[x_i, x_(i+1)] = (f(x_(i+1)) - f(x_i)) / (x_(i+1) - x_i)
                </Text>
              </View>
            </View>

            {/* 6. Lagrange Interpolation */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.accentLight }]}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>CARDINAL BASIS</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                6. Lagrange Polynomials
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Constructs weighted basis functions L_i(x) directly without
                matrix triangularization.
              </Text>
              <View style={[styles.codeSnippet, { backgroundColor: colors.surface, borderLeftColor: colors.accent }]}>
                <Text style={[styles.codeFormula, { color: colors.textPrimary }]}>
                  P(x) = ∑ [ y_i · ∏_(j≠i) (x - x_j) / (x_i - x_j) ]
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollBody: {
    padding: 18,
  },
  section: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  sectionBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '800',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
    fontWeight: '500',
  },
  codeSnippet: {
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3.5,
  },
  codeFormula: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Typography.mono.fontFamily,
  },
});
