import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface TheoryGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TheoryGuideModal: React.FC<TheoryGuideModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={[Typography.h2, styles.modalTitle]}>
                NUMERICAL METHODS GUIDE
              </Text>
              <Text style={[Typography.monoSm, styles.modalSubtitle]}>
                FORMULAS, CONVERGENCE ORDERS & CONDITIONS
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollBody}>
            {/* 1. Bisection */}
            <View style={styles.section}>
              <View style={styles.sectionBadge}>
                <Text style={styles.badgeText}>ORDER 1 (LINEAR)</Text>
              </View>
              <Text style={[Typography.h3, styles.sectionTitle]}>
                1. Bisection Method
              </Text>
              <Text style={[Typography.body, styles.bodyText]}>
                Requires an interval [a, b] such that f(a) · f(b) &lt; 0. By the
                Intermediate Value Theorem, at least one real root exists.
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  c = (a + b) / 2
                </Text>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  Max Error Bound: ε_n ≤ (b - a) / 2^n
                </Text>
              </View>
            </View>

            {/* 2. Newton-Raphson */}
            <View style={styles.section}>
              <View style={styles.sectionBadge}>
                <Text style={styles.badgeText}>ORDER 2 (QUADRATIC)</Text>
              </View>
              <Text style={[Typography.h3, styles.sectionTitle]}>
                2. Newton-Raphson Method
              </Text>
              <Text style={[Typography.body, styles.bodyText]}>
                Uses the tangent line at x_n. Highly efficient when starting near
                a simple root. Fails if f'(x) = 0 (horizontal tangent).
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  x_(n+1) = x_n - f(x_n) / f'(x_n)
                </Text>
              </View>
            </View>

            {/* 3. Secant */}
            <View style={styles.section}>
              <View style={styles.sectionBadge}>
                <Text style={styles.badgeText}>ORDER ≈ 1.618 (SUPERLINEAR)</Text>
              </View>
              <Text style={[Typography.h3, styles.sectionTitle]}>
                3. Secant Method
              </Text>
              <Text style={[Typography.body, styles.bodyText]}>
                Approximates the derivative using a finite-difference secant line
                connecting two points (x_(n-1), x_n). Eliminates the need for
                analytical derivatives.
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  x_(n+1) = x_n - f(x_n) · [(x_n - x_(n-1)) / (f(x_n) - f(x_(n-1)))]
                </Text>
              </View>
            </View>

            {/* 4. Fixed-Point */}
            <View style={styles.section}>
              <View style={styles.sectionBadge}>
                <Text style={styles.badgeText}>BANACH CONTRACTION</Text>
              </View>
              <Text style={[Typography.h3, styles.sectionTitle]}>
                4. Fixed-Point Iteration
              </Text>
              <Text style={[Typography.body, styles.bodyText]}>
                Reformulates f(x) = 0 into x = g(x). Guarantees local convergence
                if and only if |g'(x*)| &lt; 1 in the neighborhood of the root.
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  x_(n+1) = g(x_n)
                </Text>
              </View>
            </View>

            {/* 5. Newton Divided Difference */}
            <View style={styles.section}>
              <View style={styles.sectionBadge}>
                <Text style={styles.badgeText}>INTERPOLATION O(N²)</Text>
              </View>
              <Text style={[Typography.h3, styles.sectionTitle]}>
                5. Newton's Divided Difference
              </Text>
              <Text style={[Typography.body, styles.bodyText]}>
                Constructs an interpolating polynomial through recursive divided
                differences. Allows incremental point addition without
                recomputing the whole polynomial.
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  P(x) = f[x0] + f[x0,x1](x - x0) + f[x0,x1,x2](x - x0)(x - x1) + ...
                </Text>
              </View>
            </View>

            {/* 6. Lagrange Interpolation */}
            <View style={styles.section}>
              <View style={styles.sectionBadge}>
                <Text style={styles.badgeText}>POLYNOMIAL BASIS</Text>
              </View>
              <Text style={[Typography.h3, styles.sectionTitle]}>
                6. Lagrange Interpolation
              </Text>
              <Text style={[Typography.body, styles.bodyText]}>
                Expresses the interpolating polynomial as a linear combination of
                cardinal basis polynomials L_i(x), where L_i(x_j) = δ_ij.
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  P(x) = Σ y_i · L_i(x)
                </Text>
                <Text style={[Typography.monoSm, styles.codeFormula]}>
                  L_i(x) = Π_(j≠i) [(x - x_j) / (x_i - x_j)]
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: Colors.border,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#070A0E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    color: Colors.accentCyan,
    marginTop: 2,
    fontSize: 10,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.border,
    borderWidth: 1,
  },
  closeBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollBody: {
    padding: 16,
  },
  section: {
    backgroundColor: '#090D14',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  sectionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0284C720',
    borderColor: '#0284C7',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginBottom: 6,
  },
  badgeText: {
    color: Colors.accentCyan,
    fontSize: 9,
    fontWeight: '700',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  bodyText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  codeSnippet: {
    backgroundColor: '#05070B',
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: Colors.accentEmerald,
  },
  codeFormula: {
    color: Colors.accentEmerald,
    fontSize: 11,
    lineHeight: 16,
  },
});
