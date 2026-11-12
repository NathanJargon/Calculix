import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SolverId } from './HomeScreen';
import { SolverPrefill } from '../services/historyService';
import { TUTORIAL_CHAPTERS, TutorialChapter } from '../data/tutorialChapters';

interface TutorialScreenProps {
  onClose?: () => void;
  onOpenSolver?: (methodId: SolverId, prefill?: SolverPrefill) => void;
  initialChapterId?: string;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  onClose,
  onOpenSolver,
  initialChapterId,
}) => {
  const { colors, isDark } = useTheme();

  const [activeChapterId, setActiveChapterId] = useState<string>(
    initialChapterId || TUTORIAL_CHAPTERS[0].id
  );

  useEffect(() => {
    if (initialChapterId) {
      setActiveChapterId(initialChapterId);
    }
  }, [initialChapterId]);

  const activeChapter: TutorialChapter =
    TUTORIAL_CHAPTERS.find((c) => c.id === activeChapterId) || TUTORIAL_CHAPTERS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.topBarTitleGroup}>
          <Text style={[styles.topBarCategory, { color: colors.primary }]}>STUDENT TEXTBOOK</Text>
          <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>Numerical Methods Tutorial</Text>
        </View>

        {onClose && (
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeBtnText, { color: colors.textPrimary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Method Chapters Strip */}
      <View style={[styles.chapterStripContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chapterStripContent}
        >
          {TUTORIAL_CHAPTERS.map((chap) => {
            const isActive = chap.id === activeChapter.id;
            return (
              <TouchableOpacity
                key={chap.id}
                onPress={() => setActiveChapterId(chap.id)}
                activeOpacity={0.75}
                style={[
                  styles.chapterChip,
                  isActive
                    ? [styles.chapterChipActive, { backgroundColor: chap.accentColor, borderColor: chap.accentColor }]
                    : { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.chapterChipText,
                    isActive ? styles.textWhite : { color: colors.textSecondary },
                  ]}
                >
                  {chap.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Chapter Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: activeChapter.accentColor + '18' }]}>
              <Text style={[styles.categoryBadgeText, { color: activeChapter.accentColor }]}>
                {activeChapter.category.toUpperCase()}
              </Text>
            </View>

            <View style={[styles.orderBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.orderBadgeText, { color: colors.textSecondary }]}>
                {activeChapter.orderBadge}
              </Text>
            </View>
          </View>

          <Text style={[styles.chapterTitle, { color: colors.textPrimary }]}>
            {activeChapter.title}
          </Text>

          <Text style={[styles.chapterTagline, { color: colors.textSecondary }]}>
            {activeChapter.tagline}
          </Text>

          <View style={styles.guaranteeRow}>
            <Text style={[styles.guaranteeLabel, { color: activeChapter.accentColor }]}>Convergence:</Text>
            <Text style={[styles.guaranteeText, { color: colors.textPrimary }]}>
              {activeChapter.guarantee}
            </Text>
          </View>
        </View>

        {/* Section 1: The Big Idea (Intuition) */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionIcon, { color: activeChapter.accentColor }]}>💡</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              The Intuition ("The Big Idea")
            </Text>
          </View>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            {activeChapter.intuition}
          </Text>
        </View>

        {/* Section 2: Mathematical Formulation */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionIcon, { color: activeChapter.accentColor }]}>📐</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Mathematical Formulation
            </Text>
          </View>

          <View
            style={[
              styles.formulaContainer,
              isDark ? styles.formulaContainerDark : styles.formulaContainerLight,
              { borderColor: activeChapter.accentColor },
            ]}
          >
            <Text style={[styles.formulaText, isDark ? styles.formulaTextDark : styles.formulaTextLight]}>
              {activeChapter.mathFormula}
            </Text>
          </View>

          <Text style={[styles.bodyText, styles.mt10, { color: colors.textSecondary }]}>
            {activeChapter.formulaExplanation}
          </Text>
        </View>

        {/* Section 3: Conditions & Pitfalls */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.subSectionTitle, { color: colors.textPrimary }]}>
            ✓ Required Conditions (Hypotheses)
          </Text>
          {activeChapter.conditions.map((cond, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: activeChapter.accentColor }]}>•</Text>
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{cond}</Text>
            </View>
          ))}

          <Text style={[styles.subSectionTitle, styles.mt16, { color: colors.textPrimary }]}>
            ⚠️ Pitfalls & Limitations
          </Text>
          {activeChapter.pitfalls.map((pitfall, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, styles.pitfallDot]}>•</Text>
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{pitfall}</Text>
            </View>
          ))}
        </View>

        {/* Section 4: Worked Step-by-Step Textbook Example */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionIcon, { color: activeChapter.accentColor }]}>📝</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Worked Textbook Example
            </Text>
          </View>

          <View style={[styles.problemBox, { backgroundColor: activeChapter.accentColor + '12', borderColor: activeChapter.accentColor }]}>
            <Text style={[styles.problemLabel, { color: activeChapter.accentColor }]}>PROBLEM STATEMENT</Text>
            <Text style={[styles.problemText, { color: colors.textPrimary }]}>
              {activeChapter.workedExample.problem}
            </Text>
          </View>

          <View style={styles.stepsStack}>
            {activeChapter.workedExample.stepByStep.map((s, idx) => (
              <View
                key={idx}
                style={[
                  styles.stepCard,
                  { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                ]}
              >
                <View style={styles.stepHeader}>
                  <View style={[styles.stepNumBadge, { backgroundColor: activeChapter.accentColor }]}>
                    <Text style={styles.stepNumText}>{idx + 1}</Text>
                  </View>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{s.step}</Text>
                </View>

                <Text style={[styles.stepDetail, { color: colors.textSecondary }]}>{s.detail}</Text>

                <View style={[styles.stepMathPill, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.stepMathText, { color: activeChapter.accentColor }]}>{s.math}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.resultCard, isDark ? styles.resultCardDark : styles.resultCardLight]}>
            <Text style={[styles.resultLabel, styles.resultLabelColor]}>FINAL RESULT</Text>
            <Text style={[styles.resultText, isDark ? styles.resultTextDark : styles.resultTextLight]}>
              {activeChapter.workedExample.finalResult}
            </Text>
          </View>
        </View>

        {/* Section 5: How to Apply on Calculix */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionIcon, { color: activeChapter.accentColor }]}>📱</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              How to Apply in Calculix
            </Text>
          </View>

          <Text style={[styles.bodyText, styles.mb12, { color: colors.textSecondary }]}>
            Follow these exact inputs to reproduce this problem in the calculator:
          </Text>

          <View style={styles.inputGuideList}>
            {activeChapter.calculatorGuide.inputItems.map((item, idx) => (
              <View
                key={idx}
                style={[styles.inputGuideRow, { borderBottomColor: colors.border }]}
              >
                <View style={styles.inputGuideLeft}>
                  <Text style={[styles.inputGuideField, { color: colors.textPrimary }]}>{item.field}</Text>
                  <Text style={[styles.inputGuideNote, { color: colors.textMuted }]}>{item.note}</Text>
                </View>
                <View style={[styles.inputGuideValPill, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                  <Text style={[styles.inputGuideValText, { color: activeChapter.accentColor }]}>
                    {item.example}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.stepsNumberedList}>
            {activeChapter.calculatorGuide.usageSteps.map((step, idx) => (
              <Text key={idx} style={[styles.usageStepText, { color: colors.textSecondary }]}>
                {step}
              </Text>
            ))}
          </View>

          {/* Interactive Action Button to Launch in Calculator */}
          {onOpenSolver && activeChapter.solverId && (
            <TouchableOpacity
              style={[styles.openCalculatorBtn, { backgroundColor: activeChapter.accentColor }]}
              onPress={() => onOpenSolver(activeChapter.solverId!, activeChapter.calculatorGuide.prefill)}
              activeOpacity={0.8}
            >
              <Text style={styles.openCalculatorBtnText}>
                Try {activeChapter.title.split(' ')[0]} Example in Calculator 🚀
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  topBarTitleGroup: {
    flex: 1,
  },
  topBarCategory: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  chapterStripContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  chapterStripContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chapterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterChipActive: {
    borderWidth: 1,
  },
  chapterChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 14,
  },
  heroCard: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  orderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  chapterTagline: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  guaranteeLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  formulaContainer: {
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 4,
  },
  formulaText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  problemBox: {
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 3.5,
    gap: 4,
  },
  problemLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  problemText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  stepsStack: {
    gap: 10,
  },
  stepCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNumBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  stepDetail: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  stepMathPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  stepMathText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '800',
  },
  resultCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  inputGuideList: {
    gap: 8,
  },
  inputGuideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  inputGuideLeft: {
    flex: 1,
    paddingRight: 10,
  },
  inputGuideField: {
    fontSize: 13,
    fontWeight: '800',
  },
  inputGuideNote: {
    fontSize: 11,
    marginTop: 1,
  },
  inputGuideValPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  inputGuideValText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '800',
  },
  stepsNumberedList: {
    gap: 6,
    marginTop: 8,
  },
  usageStepText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  openCalculatorBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  openCalculatorBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  formulaContainerDark: {
    backgroundColor: '#0F172A',
  },
  formulaContainerLight: {
    backgroundColor: '#F8FAFC',
  },
  formulaTextDark: {
    color: '#38BDF8',
  },
  formulaTextLight: {
    color: '#0284C7',
  },
  mt10: {
    marginTop: 10,
  },
  mt16: {
    marginTop: 16,
  },
  mb12: {
    marginBottom: 12,
  },
  pitfallDot: {
    color: '#EF4444',
  },
  resultCardDark: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  resultCardLight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  resultLabelColor: {
    color: '#10B981',
  },
  resultTextDark: {
    color: '#D1FAE5',
  },
  resultTextLight: {
    color: '#065F46',
  },
});

