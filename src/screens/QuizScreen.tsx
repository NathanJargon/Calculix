import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import {
  deleteCustomQuestion,
  getAllQuestions,
  QuizQuestion,
  randomizeQuestionOptions,
  saveCustomQuestion,
  shuffleArray,
} from '../services/quizService';

// Vibrant, distinct colors matching the Quizizz/flashcard reference cards
const OPTION_CARD_COLORS = [
  '#2563EB', // 1: Blue
  '#0891B2', // 2: Cyan / Teal
  '#D97706', // 3: Amber
  '#E11D48', // 4: Rose Crimson
];

interface FlashcardsScreenProps {
  onBack?: () => void;
}

export const QuizScreen: React.FC<FlashcardsScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();

  // Mode: 'quiz' (Practice Questions) | 'flip' (Flip Flashcard Study)
  const [activeMode, setActiveMode] = useState<'quiz' | 'flip'>('quiz');
  const [deckFilter, setDeckFilter] = useState<'all' | 'root-finding' | 'interpolation' | 'custom'>('all');

  // Question Deck State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Interaction State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Custom Card Creation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customOpt0, setCustomOpt0] = useState('');
  const [customOpt1, setCustomOpt1] = useState('');
  const [customOpt2, setCustomOpt2] = useState('');
  const [customOpt3, setCustomOpt3] = useState('');
  const [customCorrectIdx, setCustomCorrectIdx] = useState(0);
  const [customExplanation, setCustomExplanation] = useState('');

  // Load Questions
  const loadData = useCallback(async () => {
    let list = await getAllQuestions('all');
    if (deckFilter === 'custom') {
      list = list.filter((q) => q.isCustom);
    } else if (deckFilter === 'root-finding') {
      list = list.filter((q) => q.category === 'root-finding');
    } else if (deckFilter === 'interpolation') {
      list = list.filter((q) => q.category === 'interpolation');
    }

    const randomizedList = shuffleArray(list).map(randomizeQuestionOptions);
    setQuestions(randomizedList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFlipped(false);
  }, [deckFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentQ = questions[currentIndex] || null;
  const progressRatio = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
  const progressPercent = Math.min(Math.round(progressRatio * 100), 100);

  // Handle Option Selection in Practice Mode
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
  };

  // Next Question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsFlipped(false);
    } else {
      Alert.alert('Deck Completed! 🎉', `You reached the end of all ${questions.length} cards.`, [
        {
          text: 'Shuffle & Restart',
          onPress: () => handleShuffleDeck(),
        },
      ]);
    }
  };

  // Shuffle Deck
  const handleShuffleDeck = () => {
    const reshuffled = shuffleArray(questions).map(randomizeQuestionOptions);
    setQuestions(reshuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFlipped(false);
  };

  // Create Custom Card
  const handleCreateQuestion = async () => {
    if (!customQuestionText.trim()) {
      Alert.alert('Required', 'Please enter question text.');
      return;
    }
    if (!customOpt0.trim() || !customOpt1.trim() || !customOpt2.trim() || !customOpt3.trim()) {
      Alert.alert('Incomplete', 'Please provide 4 answer choices.');
      return;
    }

    await saveCustomQuestion({
      question: customQuestionText.trim(),
      options: [customOpt0.trim(), customOpt1.trim(), customOpt2.trim(), customOpt3.trim()],
      correctIndex: customCorrectIdx,
      explanation: customExplanation.trim() || 'Custom created study card.',
    });

    setCustomQuestionText('');
    setCustomOpt0('');
    setCustomOpt1('');
    setCustomOpt2('');
    setCustomOpt3('');
    setCustomExplanation('');
    setCustomCorrectIdx(0);
    setIsModalOpen(false);

    loadData();
    Alert.alert('Saved!', 'Your custom flashcard has been added to the deck.');
  };

  // Delete Current Custom Card
  const handleDeleteCurrent = async () => {
    if (!currentQ?.isCustom) return;
    Alert.alert('Delete Card', 'Are you sure you want to delete this custom card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCustomQuestion(currentQ.id);
          loadData();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* Sleek Top Header Bar */}
      <View style={[styles.topHeader, isDark ? styles.headerDark : styles.headerLight, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeftGroup}>
          {onBack && (
            <TouchableOpacity
              style={[styles.backBtn, { borderColor: colors.border, backgroundColor: colors.surfaceSecondary }]}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Text style={[styles.backBtnText, { color: colors.textPrimary }]}>←</Text>
            </TouchableOpacity>
          )}
          {/* Card Position Badge */}
          <View style={[styles.counterPill, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
            <Text style={[styles.counterPillText, { color: colors.textPrimary }]}>
              {questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : '0 / 0'}
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={[styles.actionIconBtn, { borderColor: colors.border, backgroundColor: colors.surfaceSecondary }]}
            onPress={handleShuffleDeck}
            activeOpacity={0.7}
            accessibilityLabel="Shuffle cards"
          >
            <Text style={[styles.actionIconText, { color: colors.textPrimary }]}>🔀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: colors.primary }]}
            onPress={() => setIsModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.createBtnText}>+ Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Progress Track */}
      <View
        style={[
          styles.progressBarTrack,
          isDark ? styles.progressBarTrackDark : styles.progressBarTrackLight,
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercent}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>

      {/* Clean Segmented Mode Selector & Filters */}
      <View style={[styles.controlsRow, isDark ? styles.controlsDark : styles.controlsLight]}>
        <View style={styles.modeSegment}>
          <TouchableOpacity
            style={[styles.modeTab, activeMode === 'quiz' && styles.modeTabActive]}
            onPress={() => {
              setActiveMode('quiz');
              setIsFlipped(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, activeMode === 'quiz' && styles.modeTabTextActive]}>
              Practice Quiz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, activeMode === 'flip' && styles.modeTabActive]}
            onPress={() => {
              setActiveMode('flip');
              setSelectedOption(null);
              setIsAnswered(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, activeMode === 'flip' && styles.modeTabTextActive]}>
              Flip Study
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips Strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterStrip}>
          {[
            { key: 'all', label: 'All Cards' },
            { key: 'root-finding', label: 'Roots' },
            { key: 'interpolation', label: 'Interpolation' },
            { key: 'custom', label: 'My Cards' },
          ].map((item) => {
            const isSelected = deckFilter === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setDeckFilter(item.key as typeof deckFilter)}
                style={[
                  styles.filterChip,
                  isSelected
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected ? styles.textWhite : { color: colors.textSecondary },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Workspace Area */}
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {currentQ ? (
          <>
            {/* 1. PRACTICE QUIZ MODE (Reference: 4 Stacked Option Cards with Checkboxes) */}
            {activeMode === 'quiz' && (
              <View style={styles.practiceContainer}>
                {/* Question Card */}
                <View style={[styles.questionBox, isDark ? styles.questionBoxDark : styles.questionBoxLight]}>
                  {currentQ.isCustom && (
                    <View style={styles.cardTagRow}>
                      <View style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>Custom Card</Text>
                      </View>
                      <TouchableOpacity onPress={handleDeleteCurrent} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={styles.deleteText}>✕ Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text style={[styles.questionText, { color: colors.textPrimary }]}>{currentQ.question}</Text>
                </View>

                {/* Stack of 4 Colored Options */}
                <View style={styles.optionsStack}>
                  {currentQ.options.map((optionText, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;
                    const baseColor = OPTION_CARD_COLORS[idx % OPTION_CARD_COLORS.length];

                    let cardBg = baseColor;
                    let outlineStyle = {};

                    if (isAnswered) {
                      if (isCorrect) {
                        cardBg = '#10B981'; // Green for correct
                        outlineStyle = { borderWidth: 2.5, borderColor: '#FFFFFF' };
                      } else if (isSelected && !isCorrect) {
                        cardBg = '#DC2626'; // Red for wrong selected choice
                        outlineStyle = { borderWidth: 2.5, borderColor: '#FFFFFF' };
                      } else {
                        // Dim others
                        cardBg = baseColor + '65';
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.8}
                        style={[styles.optionCard, { backgroundColor: cardBg }, outlineStyle]}
                        onPress={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                      >
                        <Text style={styles.optionCardText}>{optionText}</Text>

                        {/* Right-aligned Checkbox Frame */}
                        <View style={styles.checkboxFrame}>
                          {isAnswered && isCorrect && <Text style={styles.checkboxSymbol}>✓</Text>}
                          {isAnswered && isSelected && !isCorrect && (
                            <Text style={styles.checkboxSymbol}>✕</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Concept Feedback & Next Button */}
                {isAnswered && (
                  <View
                    style={[
                      styles.explanationPanel,
                      isDark ? styles.explanationDark : styles.explanationLight,
                      { borderColor: colors.border },
                    ]}
                  >
                    <View style={styles.explanationHeader}>
                      <Text
                        style={[
                          styles.explanationTitle,
                          selectedOption === currentQ.correctIndex ? styles.textSuccess : styles.textDanger,
                        ]}
                      >
                        {selectedOption === currentQ.correctIndex ? '✓ Correct Answer' : '✕ Review Concept'}
                      </Text>

                      <TouchableOpacity
                        style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.nextBtnText}>Next Card →</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                      {currentQ.explanation}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* 2. FLIP STUDY MODE */}
            {activeMode === 'flip' && (
              <View style={styles.flipContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.flipCardHero,
                    isFlipped
                      ? isDark
                        ? styles.flipFlippedDark
                        : styles.flipFlippedLight
                      : isDark
                      ? styles.flipUnflippedDark
                      : styles.flipUnflippedLight,
                  ]}
                  onPress={() => setIsFlipped(!isFlipped)}
                >
                  <View style={styles.flipTopRow}>
                    <Text style={styles.flipBadge}>
                      {isFlipped ? '💡 ANSWER & THEOREM' : '❓ QUESTION (TAP TO FLIP)'}
                    </Text>
                    {currentQ.isCustom && (
                      <TouchableOpacity onPress={handleDeleteCurrent}>
                        <Text style={styles.deleteText}>✕ Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {!isFlipped ? (
                    <View style={styles.flipCenterContent}>
                      <Text style={[styles.flipQuestion, { color: colors.textPrimary }]}>{currentQ.question}</Text>
                      <Text style={styles.flipPrompt}>Tap card to reveal answer & formula</Text>
                    </View>
                  ) : (
                    <View style={styles.flipCenterContent}>
                      <View style={styles.flipAnswerPill}>
                        <Text style={styles.flipAnswerText}>
                          ✓ {currentQ.options[currentQ.correctIndex]}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.flipExplanation,
                          isDark ? styles.flipExplanationDark : styles.flipExplanationLight,
                        ]}
                      >
                        {currentQ.explanation}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Flip Dock Navigation */}
                <View style={styles.flipDock}>
                  <TouchableOpacity
                    style={[styles.dockBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex((prev) => prev - 1);
                        setIsFlipped(false);
                      }
                    }}
                    disabled={currentIndex === 0}
                  >
                    <Text
                      style={[
                        styles.dockBtnText,
                        { color: currentIndex === 0 ? colors.textMuted : colors.textPrimary },
                      ]}
                    >
                      ← Previous
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.dockBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                    onPress={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex((prev) => prev + 1);
                        setIsFlipped(false);
                      } else {
                        handleShuffleDeck();
                      }
                    }}
                  >
                    <Text style={[styles.dockBtnText, styles.textWhite]}>
                      {currentIndex < questions.length - 1 ? 'Next Card →' : 'Restart Deck ↺'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Cards in this Category</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              Tap "+ Create" in the top bar to create custom study flashcards.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* CREATE CUSTOM FLASHCARD MODAL */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create Flashcard</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Text style={[styles.modalClose, { color: colors.textMuted }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Question / Formula Problem:</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="e.g. What is the convergence rate of Newton-Raphson?"
                placeholderTextColor={colors.textMuted}
                value={customQuestionText}
                onChangeText={setCustomQuestionText}
                multiline
              />

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>4 Choices (Tap number to mark correct):</Text>

              {[
                { val: customOpt0, setVal: setCustomOpt0, idx: 0, color: OPTION_CARD_COLORS[0] },
                { val: customOpt1, setVal: setCustomOpt1, idx: 1, color: OPTION_CARD_COLORS[1] },
                { val: customOpt2, setVal: setCustomOpt2, idx: 2, color: OPTION_CARD_COLORS[2] },
                { val: customOpt3, setVal: setCustomOpt3, idx: 3, color: OPTION_CARD_COLORS[3] },
              ].map((item) => (
                <View key={item.idx} style={styles.optionRow}>
                  <TouchableOpacity
                    style={[
                      styles.choiceBadge,
                      { borderColor: item.color },
                      customCorrectIdx === item.idx && { backgroundColor: item.color },
                    ]}
                    onPress={() => setCustomCorrectIdx(item.idx)}
                  >
                    <Text style={styles.choiceBadgeText}>{item.idx + 1}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.optionInput, { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder={`Option ${item.idx + 1}`}
                    placeholderTextColor={colors.textMuted}
                    value={item.val}
                    onChangeText={item.setVal}
                  />
                </View>
              ))}

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Explanation / Mathematical Theorem:</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Why is this answer correct? Add the theorem or equation."
                placeholderTextColor={colors.textMuted}
                value={customExplanation}
                onChangeText={setCustomExplanation}
                multiline
              />

              <TouchableOpacity
                style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreateQuestion}
              >
                <Text style={styles.modalSubmitBtnText}>Add Card to Deck</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const FlashcardsScreen = QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  containerLight: {
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerDark: {
    backgroundColor: '#1E293B',
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '800',
  },
  counterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  counterPillText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    fontSize: 15,
  },
  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 4,
    width: '100%',
  },
  progressBarTrackDark: {
    backgroundColor: '#1E293B',
  },
  progressBarTrackLight: {
    backgroundColor: '#E2E8F0',
  },
  progressBarFill: {
    height: '100%',
  },
  controlsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  controlsDark: {
    backgroundColor: '#1E293B99',
  },
  controlsLight: {
    backgroundColor: '#F1F5F9',
  },
  modeSegment: {
    flexDirection: 'row',
    backgroundColor: '#33415525',
    borderRadius: 14,
    padding: 3,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 11,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  filterStrip: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollArea: {
    padding: 16,
    paddingBottom: 90,
  },
  practiceContainer: {
    gap: 14,
  },
  questionBox: {
    padding: 22,
    borderRadius: 20,
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  questionBoxDark: {
    backgroundColor: '#1E293B',
  },
  questionBoxLight: {
    backgroundColor: '#FFFFFF',
  },
  cardTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customBadge: {
    backgroundColor: '#38BDF825',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  customBadgeText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '800',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
  },
  optionsStack: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    minHeight: 58,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    paddingRight: 12,
  },
  checkboxFrame: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSymbol: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  explanationPanel: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 6,
    gap: 10,
  },
  explanationDark: {
    backgroundColor: '#1E293B',
  },
  explanationLight: {
    backgroundColor: '#FFFFFF',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  nextBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  flipContainer: {
    gap: 16,
  },
  flipCardHero: {
    minHeight: 270,
    borderRadius: 24,
    borderWidth: 2,
    padding: 22,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  flipUnflippedDark: {
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
  },
  flipUnflippedLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
  },
  flipFlippedDark: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  flipFlippedLight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  flipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipBadge: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  flipCenterContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 14,
  },
  flipQuestion: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 27,
  },
  flipPrompt: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  flipAnswerPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  flipAnswerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  flipExplanation: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  flipExplanationDark: {
    color: '#D1FAE5',
  },
  flipExplanationLight: {
    color: '#065F46',
  },
  flipDock: {
    flexDirection: 'row',
    gap: 12,
  },
  dockBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyBox: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '85%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  modalClose: {
    fontSize: 20,
    fontWeight: '700',
    padding: 4,
  },
  modalForm: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
  },
  modalInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  choiceBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  optionInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 13,
  },
  modalSubmitBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textSuccess: {
    color: '#10B981',
  },
  textDanger: {
    color: '#EF4444',
  },
});
