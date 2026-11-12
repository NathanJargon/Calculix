import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
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
  getQuizStats,
  QuizQuestion,
  QuizStats,
  randomizeQuestionOptions,
  recordQuizAnswer,
  saveCustomQuestion,
  shuffleArray,
} from '../services/quizService';

const QUIZ_TILE_COLORS = [
  '#2563EB', // 1: Royal Blue
  '#0D9488', // 2: Vibrant Teal
  '#D97706', // 3: Warm Amber
  '#E11D48', // 4: Rose Pink
];

interface QuizScreenProps {
  onBack?: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();

  // Mode: 'quiz' (Quizizz 4-tile challenge) | 'flashcards' (Flip to study)
  const [activeMode, setActiveMode] = useState<'quiz' | 'flashcards'>('quiz');
  const [deckFilter, setDeckFilter] = useState<'all' | 'built-in' | 'custom'>('all');

  // Question Deck State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<QuizStats>({
    streak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
  });

  // Quiz Interaction State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false); // Flashcard flip state

  // Custom Q&A Creation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customOpt0, setCustomOpt0] = useState('');
  const [customOpt1, setCustomOpt1] = useState('');
  const [customOpt2, setCustomOpt2] = useState('');
  const [customOpt3, setCustomOpt3] = useState('');
  const [customCorrectIdx, setCustomCorrectIdx] = useState(0);
  const [customExplanation, setCustomExplanation] = useState('');

  // Load Questions & Stats
  const loadData = useCallback(async () => {
    const list = await getAllQuestions(deckFilter);
    const randomizedList = shuffleArray(list).map(randomizeQuestionOptions);
    setQuestions(randomizedList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFlipped(false);

    const st = await getQuizStats();
    setStats(st);
  }, [deckFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentQ = questions[currentIndex] || null;

  // Handle Answer Selection in Quiz Mode
  const handleSelectOption = async (optionIndex: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQ.correctIndex;
    const newStats = await recordQuizAnswer(isCorrect);
    setStats(newStats);
  };

  // Advance to Next Question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsFlipped(false);
    } else {
      // Completed deck: reshuffle and restart
      Alert.alert('Deck Completed! 🎉', `You completed all ${questions.length} cards! Great job studying.`, [
        {
          text: 'Shuffle & Replay',
          onPress: () => {
            const reshuffled = shuffleArray(questions).map(randomizeQuestionOptions);
            setQuestions(reshuffled);
            setCurrentIndex(0);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsFlipped(false);
          },
        },
      ]);
    }
  };

  // Shuffle Action
  const handleShuffleDeck = () => {
    const reshuffled = shuffleArray(questions).map(randomizeQuestionOptions);
    setQuestions(reshuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFlipped(false);
  };

  // Handle Create Custom Q&A
  const handleCreateQuestion = async () => {
    if (!customQuestionText.trim()) {
      Alert.alert('Required', 'Please enter question text.');
      return;
    }
    if (!customOpt0.trim() || !customOpt1.trim() || !customOpt2.trim() || !customOpt3.trim()) {
      Alert.alert('Incomplete', 'Please provide all 4 answer options.');
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
    Alert.alert('Saved!', 'Your custom Q&A was added to your flashcard deck.');
  };

  // Delete current custom question
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
      {/* Quizizz-Style Top HUD */}
      <View
        style={[
          styles.topHud,
          isDark ? styles.topHudDark : styles.topHudLight,
          { borderBottomColor: colors.border },
        ]}
      >
        {onBack && (
          <TouchableOpacity style={[styles.hudBackBtn, { borderColor: colors.border }]} onPress={onBack}>
            <Text style={[styles.hudBackText, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>
        )}

        {/* Progress Badge */}
        <View style={styles.hudPill}>
          <Text style={[styles.hudPillText, { color: colors.textSecondary }]}>
            {questions.length > 0 ? `${currentIndex + 1}/${questions.length}` : '0/0'}
          </Text>
        </View>

        {/* Flame Streak Meter */}
        <View
          style={[
            styles.streakBadge,
            stats.streak > 0 ? styles.streakBadgeActive : { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Text style={styles.flameIcon}>{stats.streak > 0 ? '🔥' : '⚡'}</Text>
          <Text
            style={[
              styles.streakText,
              stats.streak > 0 ? styles.streakTextActive : { color: colors.textMuted },
            ]}
          >
            Streak: {stats.streak}
          </Text>
        </View>

        {/* Best Streak / Score */}
        <View style={styles.hudPill}>
          <Text style={[styles.hudPillText, { color: colors.textSecondary }]}>
            Best: {stats.bestStreak}
          </Text>
        </View>

        {/* New Question Button */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Mode & Category Bar */}
      <View style={[styles.controlsBar, isDark ? styles.controlsBarDark : styles.controlsBarLight]}>
        <View style={styles.segmentedMode}>
          <TouchableOpacity
            style={[styles.modeTab, activeMode === 'quiz' && styles.modeTabActive]}
            onPress={() => {
              setActiveMode('quiz');
              setIsFlipped(false);
            }}
          >
            <Text style={[styles.modeTabText, activeMode === 'quiz' && styles.modeTabTextActive]}>
              🎯 Quizizz Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, activeMode === 'flashcards' && styles.modeTabActive]}
            onPress={() => {
              setActiveMode('flashcards');
              setSelectedOption(null);
              setIsAnswered(false);
            }}
          >
            <Text style={[styles.modeTabText, activeMode === 'flashcards' && styles.modeTabTextActive]}>
              🗂 Flashcard Flip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Deck Filters */}
        <View style={styles.filterRow}>
          {(['all', 'built-in', 'custom'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setDeckFilter(filter)}
              style={[
                styles.filterChip,
                deckFilter === filter && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  deckFilter === filter ? styles.textWhite : { color: colors.textSecondary },
                ]}
              >
                {filter === 'all' ? 'All (20+)' : filter === 'built-in' ? 'Standard' : 'My Q&A'}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleShuffleDeck} style={styles.shuffleBtn}>
            <Text style={[styles.shuffleText, { color: colors.primary }]}>🔀 Shuffle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {currentQ ? (
          <>
            {/* QUIZIZZ MODE */}
            {activeMode === 'quiz' && (
              <View style={styles.quizArea}>
                {/* Center Question Card (Image 1 Vibe) */}
                <View
                  style={[
                    styles.questionCard,
                    isDark ? styles.questionCardDark : styles.questionCardLight,
                  ]}
                >
                  {currentQ.isCustom && (
                    <View style={styles.customBadgeRow}>
                      <View style={styles.customTag}>
                        <Text style={styles.customTagText}>Custom Q&A</Text>
                      </View>
                      <TouchableOpacity onPress={handleDeleteCurrent} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={styles.deleteTagText}>✕ Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text style={styles.questionCardText}>{currentQ.question}</Text>
                </View>

                {/* 4 Quizizz-Style Answer Tiles */}
                <View style={styles.tilesContainer}>
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let tileColor = QUIZ_TILE_COLORS[idx];
                    let borderStyle = {};

                    if (isAnswered) {
                      if (isCorrect) {
                        tileColor = '#10B981'; // Green for correct
                        borderStyle = { borderWidth: 3, borderColor: '#FFFFFF' };
                      } else if (isSelected && !isCorrect) {
                        tileColor = '#DC2626'; // Deep Red for wrong choice
                        borderStyle = { borderWidth: 3, borderColor: '#FFFFFF' };
                      } else {
                        // Dim unchosen wrong options
                        tileColor = tileColor + '75';
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.8}
                        style={[styles.tile, { backgroundColor: tileColor }, borderStyle]}
                        onPress={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                      >
                        {/* Corner Index Badge (1, 2, 3, 4) */}
                        <View style={styles.tileBadge}>
                          <Text style={styles.tileBadgeText}>{idx + 1}</Text>
                        </View>
                        <Text style={styles.tileText}>{opt}</Text>
                        {isAnswered && isCorrect && <Text style={styles.tileCheckmark}>✓ Correct</Text>}
                        {isAnswered && isSelected && !isCorrect && (
                          <Text style={styles.tileWrongMark}>✕ Incorrect</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Feedback & Explanation Card after Answer */}
                {isAnswered && (
                  <View
                    style={[
                      styles.explanationCard,
                      isDark ? styles.explanationCardDark : styles.explanationCardLight,
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
                        {selectedOption === currentQ.correctIndex ? '✨ Excellent! Correct Answer' : '💡 Review Concept'}
                      </Text>
                      <TouchableOpacity
                        style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.nextBtnText}>Next Question →</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.explanationBody, { color: colors.textSecondary }]}>
                      {currentQ.explanation}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* FLASHCARD STUDY FLIP MODE */}
            {activeMode === 'flashcards' && (
              <View style={styles.flashcardArea}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.flipCard,
                    isFlipped
                      ? isDark
                        ? styles.flipCardFlippedDark
                        : styles.flipCardFlippedLight
                      : isDark
                      ? styles.flipCardUnflippedDark
                      : styles.flipCardUnflippedLight,
                  ]}
                  onPress={() => setIsFlipped(!isFlipped)}
                >
                  <View style={styles.flipCardHeader}>
                    <Text style={styles.flipCardCategory}>
                      {isFlipped ? '💡 ANSWER & CONCEPT' : '❓ QUESTION (TAP TO FLIP)'}
                    </Text>
                    {currentQ.isCustom && (
                      <TouchableOpacity onPress={handleDeleteCurrent}>
                        <Text style={styles.deleteTagText}>✕ Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {!isFlipped ? (
                    <View style={styles.flipCardCenter}>
                      <Text style={styles.flipQuestionText}>{currentQ.question}</Text>
                      <Text style={styles.flipHintText}>Tap anywhere to reveal correct answer & breakdown</Text>
                    </View>
                  ) : (
                    <View style={styles.flipCardCenter}>
                      <View style={styles.correctPill}>
                        <Text style={styles.correctPillText}>
                          ✓ {currentQ.options[currentQ.correctIndex]}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.flipExplanationText,
                          isDark ? styles.flipExplanationDark : styles.flipExplanationLight,
                        ]}
                      >
                        {currentQ.explanation}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Flip Navigation Controls */}
                <View style={styles.flipControls}>
                  <TouchableOpacity
                    style={[styles.flipNavBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex((prev) => prev - 1);
                        setIsFlipped(false);
                      }
                    }}
                    disabled={currentIndex === 0}
                  >
                    <Text style={[styles.flipNavBtnText, { color: currentIndex === 0 ? colors.textMuted : colors.textPrimary }]}>
                      ← Previous
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.flipNavBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                    onPress={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex((prev) => prev + 1);
                        setIsFlipped(false);
                      } else {
                        handleShuffleDeck();
                      }
                    }}
                  >
                    <Text style={[styles.flipNavBtnText, styles.textWhite]}>
                      {currentIndex < questions.length - 1 ? 'Next Card →' : 'Restart Deck ↺'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Questions in Deck</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              There are no questions matching the current filter. Tap "+ New" above to create your own!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* CREATE CUSTOM Q&A MODAL */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create Study Card</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Text style={[styles.modalClose, { color: colors.textMuted }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>Question / Problem Statement:</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="e.g. What is the convergence rate of Newton-Raphson?"
                placeholderTextColor={colors.textMuted}
                value={customQuestionText}
                onChangeText={setCustomQuestionText}
                multiline
              />

              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>Answer Options (Tap circle to set correct):</Text>

              {[
                { val: customOpt0, setVal: setCustomOpt0, idx: 0, color: QUIZ_TILE_COLORS[0] },
                { val: customOpt1, setVal: setCustomOpt1, idx: 1, color: QUIZ_TILE_COLORS[1] },
                { val: customOpt2, setVal: setCustomOpt2, idx: 2, color: QUIZ_TILE_COLORS[2] },
                { val: customOpt3, setVal: setCustomOpt3, idx: 3, color: QUIZ_TILE_COLORS[3] },
              ].map((item) => (
                <View key={item.idx} style={styles.optionInputRow}>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      { borderColor: item.color },
                      customCorrectIdx === item.idx && { backgroundColor: item.color },
                    ]}
                    onPress={() => setCustomCorrectIdx(item.idx)}
                  >
                    <Text style={styles.radioText}>{item.idx + 1}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.modalInputRow, { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder={`Option ${item.idx + 1}`}
                    placeholderTextColor={colors.textMuted}
                    value={item.val}
                    onChangeText={item.setVal}
                  />
                </View>
              ))}

              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>Explanation / Concept Breakdown:</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Why is this answer correct? Provide the formula or theorem."
                placeholderTextColor={colors.textMuted}
                value={customExplanation}
                onChangeText={setCustomExplanation}
                multiline
              />

              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreateQuestion}
              >
                <Text style={styles.modalSaveBtnText}>Save Card to Deck</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  hudBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudBackText: {
    fontSize: 18,
    fontWeight: '800',
  },
  hudPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  hudPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  flameIcon: {
    fontSize: 15,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  controlsBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  segmentedMode: {
    flexDirection: 'row',
    backgroundColor: '#0F172A20',
    borderRadius: 14,
    padding: 3,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 2 },
    }),
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  shuffleBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shuffleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  mainScroll: {
    padding: 16,
    paddingBottom: 90,
  },
  quizArea: {
    gap: 14,
  },
  questionCard: {
    padding: 24,
    borderRadius: 22,
    minHeight: 140,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  customBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customTag: {
    backgroundColor: '#38BDF830',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  customTagText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  deleteTagText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
  },
  questionCardText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
  },
  tilesContainer: {
    gap: 12,
  },
  tile: {
    padding: 18,
    borderRadius: 18,
    position: 'relative',
    minHeight: 74,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  tileBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  tileText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    paddingRight: 26,
  },
  tileCheckmark: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  tileWrongMark: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  explanationCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
    gap: 10,
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
    paddingVertical: 8,
    borderRadius: 14,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  explanationBody: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  flashcardArea: {
    gap: 16,
  },
  flipCard: {
    minHeight: 260,
    borderRadius: 24,
    borderWidth: 2,
    padding: 22,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  flipCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipCardCategory: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  flipCardCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  flipQuestionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 28,
  },
  flipHintText: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '600',
  },
  correctPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  correctPillText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  flipExplanationText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  flipControls: {
    flexDirection: 'row',
    gap: 12,
  },
  flipNavBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipNavBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyBox: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
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
  modalContent: {
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
  modalScroll: {
    marginBottom: 20,
  },
  modalInputLabel: {
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
  optionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  radioBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalInputRow: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 13,
  },
  modalSaveBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#0B0F19',
  },
  containerLight: {
    backgroundColor: '#F1F5F9',
  },
  topHudDark: {
    backgroundColor: '#111827',
  },
  topHudLight: {
    backgroundColor: '#FFFFFF',
  },
  streakBadgeActive: {
    backgroundColor: '#FEF2F2',
  },
  streakTextActive: {
    color: '#DC2626',
  },
  controlsBarDark: {
    backgroundColor: '#131D31',
  },
  controlsBarLight: {
    backgroundColor: '#E2E8F0',
  },
  questionCardDark: {
    backgroundColor: '#1E1B4B',
  },
  questionCardLight: {
    backgroundColor: '#312E81',
  },
  explanationCardDark: {
    backgroundColor: '#1F2937',
  },
  explanationCardLight: {
    backgroundColor: '#FFFFFF',
  },
  textSuccess: {
    color: '#10B981',
  },
  textDanger: {
    color: '#EF4444',
  },
  flipCardUnflippedDark: {
    backgroundColor: '#1E1B4B',
    borderColor: '#6366F1',
  },
  flipCardUnflippedLight: {
    backgroundColor: '#312E81',
    borderColor: '#6366F1',
  },
  flipCardFlippedDark: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  flipCardFlippedLight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  flipExplanationDark: {
    color: '#D1FAE5',
  },
  flipExplanationLight: {
    color: '#065F46',
  },
});
