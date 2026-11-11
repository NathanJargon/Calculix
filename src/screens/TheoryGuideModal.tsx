import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        {/* Backdrop tap dismiss */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Sheet Card */}
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={styles.modalHeaderTitleGroup}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Method Guide
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.primary }]}>
                Formulas, convergence & criteria
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              accessibilityLabel="Close guide"
              accessibilityRole="button"
            >
              <Text style={[styles.closeBtnText, { color: colors.textPrimary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content Body */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            {/* 1. Bisection */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionBadge, { backgroundColor: colors.secondaryLight }]}>
                  <Text style={[styles.badgeText, { color: colors.secondary }]}>ORDER 1 (LINEAR)</Text>
                </View>
                <Text style={[styles.guaranteeText, { color: colors.success }]}>Guaranteed Convergence</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                1. Bisection Method
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Finds roots by repeatedly bracketing the interval [a, b]. Requires opposite signs across endpoints (f(a) · f(b) &lt; 0).
              </Text>

              <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderColor: colors.secondary }]}>
                <Text style={[styles.formulaLabel, { color: colors.secondary }]}>MIDPOINT ITERATION</Text>
                <Text style={[styles.formulaMath, { color: colors.textPrimary }]}>
                  cₙ = (aₙ + bₙ) / 2
                </Text>

                <View style={styles.formulaDivider} />

                <Text style={[styles.formulaLabel, { color: colors.textMuted }]}>THEORETICAL ERROR BOUND</Text>
                <Text style={[styles.formulaSubMath, { color: colors.textSecondary }]}>
                  |x* − cₙ| ≤ (b − a) / 2ⁿ
                </Text>
              </View>
            </View>

            {/* 2. Newton-Raphson */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>ORDER 2 (QUADRATIC)</Text>
                </View>
                <Text style={[styles.guaranteeText, { color: colors.warning }]}>Requires f′(x) ≠ 0</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                2. Newton-Raphson Method
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Rapidly converges using tangent line slopes. Doubles digits of precision each iteration near simple roots.
              </Text>

              <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                <Text style={[styles.formulaLabel, { color: colors.primary }]}>TANGENT LINE STEP</Text>
                <Text style={[styles.formulaMath, { color: colors.textPrimary }]}>
                  xₙ₊₁ = xₙ − f(xₙ) / f′(xₙ)
                </Text>

                <View style={styles.formulaDivider} />

                <Text style={[styles.formulaLabel, { color: colors.textMuted }]}>CONVERGENCE CRITERION</Text>
                <Text style={[styles.formulaSubMath, { color: colors.textSecondary }]}>
                  |f(xₙ) · f″(xₙ)| &lt; |f′(xₙ)|²
                </Text>
              </View>
            </View>

            {/* 3. Secant */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionBadge, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.badgeText, { color: colors.accent }]}>ORDER ≈ 1.618 (GOLDEN RATIO)</Text>
                </View>
                <Text style={[styles.guaranteeText, { color: colors.success }]}>No Derivative Needed</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                3. Secant Method
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Quasi-Newton approach replacing analytical derivative f′(x) with finite difference secant slopes between two initial points (x₀, x₁).
              </Text>

              <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
                <Text style={[styles.formulaLabel, { color: colors.accent }]}>SECANT SLOPE STEP</Text>
                <Text style={[styles.formulaMath, { color: colors.textPrimary }]}>
                  xₙ₊₁ = xₙ − f(xₙ) · [ (xₙ − xₙ₋₁) / (f(xₙ) − f(xₙ₋₁)) ]
                </Text>
              </View>
            </View>

            {/* 4. Fixed-Point */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionBadge, { backgroundColor: colors.successLight }]}>
                  <Text style={[styles.badgeText, { color: colors.success }]}>CONTRACTION MAPPING</Text>
                </View>
                <Text style={[styles.guaranteeText, { color: colors.warning }]}>Requires |g′(x)| &lt; 1</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                4. Fixed-Point Iteration
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Rewrites f(x) = 0 into x = g(x). Produces staircase/cobweb convergence towards the intersection with line y = x.
              </Text>

              <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderColor: colors.success }]}>
                <Text style={[styles.formulaLabel, { color: colors.success }]}>SUCCESSIVE APPROXIMATION</Text>
                <Text style={[styles.formulaMath, { color: colors.textPrimary }]}>
                  xₙ₊₁ = g(xₙ)
                </Text>

                <View style={styles.formulaDivider} />

                <Text style={[styles.formulaLabel, { color: colors.textMuted }]}>LIPSCHITZ CONDITION</Text>
                <Text style={[styles.formulaSubMath, { color: colors.textSecondary }]}>
                  |g′(x*)| &lt; 1 (Guarantees local convergence)
                </Text>
              </View>
            </View>

            {/* 5. Newton Divided Differences */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionBadge, { backgroundColor: colors.secondaryLight }]}>
                  <Text style={[styles.badgeText, { color: colors.secondary }]}>INTERPOLATION MATRIX</Text>
                </View>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                5. Newton's Divided Differences
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Constructs divided difference table pyramid to form polynomial coefficients incrementally.
              </Text>

              <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderColor: colors.secondary }]}>
                <Text style={[styles.formulaLabel, { color: colors.secondary }]}>DIVIDED DIFFERENCE RECURRENCE</Text>
                <Text style={[styles.formulaMath, { color: colors.textPrimary }]}>
                  f[xᵢ, ..., xᵢ₊ₖ] = (f[xᵢ₊₁, ..., xᵢ₊ₖ] − f[xᵢ, ..., xᵢ₊ₖ₋₁]) / (xᵢ₊ₖ − xᵢ)
                </Text>

                <View style={styles.formulaDivider} />

                <Text style={[styles.formulaLabel, { color: colors.textMuted }]}>POLYNOMIAL FORM</Text>
                <Text style={[styles.formulaSubMath, { color: colors.textSecondary }]}>
                  Pₙ(x) = f[x₀] + f[x₀,x₁](x − x₀) + f[x₀,x₁,x₂](x − x₀)(x − x₁) + ...
                </Text>
              </View>
            </View>

            {/* 6. Lagrange Interpolation */}
            <View style={[styles.section, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionBadge, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.badgeText, { color: colors.accent }]}>CARDINAL BASIS FUNCTIONS</Text>
                </View>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                6. Lagrange Polynomials
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Constructs weighted basis polynomials Lᵢ(x) that evaluate to 1 at point xᵢ and 0 at all other points xⱼ.
              </Text>

              <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
                <Text style={[styles.formulaLabel, { color: colors.accent }]}>WEIGHTED SUM</Text>
                <Text style={[styles.formulaMath, { color: colors.textPrimary }]}>
                  P(x) = ∑ yᵢ · Lᵢ(x)
                </Text>

                <View style={styles.formulaDivider} />

                <Text style={[styles.formulaLabel, { color: colors.textMuted }]}>BASIS POLYNOMIAL Lᵢ(x)</Text>
                <Text style={[styles.formulaSubMath, { color: colors.textSecondary }]}>
                  Lᵢ(x) = ∏ [ (x − xⱼ) / (xᵢ − xⱼ) ]  for j ≠ i
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: '84%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalHeaderTitleGroup: {
    flex: 1,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 12,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '800',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
    fontWeight: '500',
  },
  formulaBox: {
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    gap: 4,
  },
  formulaLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  formulaMath: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    fontFamily: Typography.mono.fontFamily,
  },
  formulaDivider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    marginVertical: 6,
  },
  formulaSubMath: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    fontFamily: Typography.mono.fontFamily,
  },
});
