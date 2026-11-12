import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BUILT_IN_QUESTIONS,
  deleteCustomQuestion,
  getAllQuestions,
  getQuizStats,
  randomizeQuestionOptions,
  recordQuizAnswer,
  resetStreak,
  saveCustomQuestion,
  shuffleArray,
} from '../src/services/quizService';

describe('quizService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('contains at least 20 built-in numerical methods questions with valid structure', () => {
    expect(BUILT_IN_QUESTIONS.length).toBeGreaterThanOrEqual(20);
    BUILT_IN_QUESTIONS.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.question.length).toBeGreaterThan(5);
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(10);
    });
  });

  test('shuffleArray returns array of same length with same elements', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffleArray(original);
    expect(shuffled.length).toBe(original.length);
    expect(shuffled.sort((a, b) => a - b)).toEqual(original);
  });

  test('randomizeQuestionOptions keeps correct answer text tracked correctly', () => {
    const q = BUILT_IN_QUESTIONS[0];
    const expectedAnswer = q.options[q.correctIndex];

    const randomized = randomizeQuestionOptions(q);
    expect(randomized.options.length).toBe(4);
    expect(randomized.options[randomized.correctIndex]).toBe(expectedAnswer);
  });

  test('can save and retrieve custom questions via AsyncStorage', async () => {
    const initialList = await getAllQuestions('custom');
    expect(initialList.length).toBe(0);

    const saved = await saveCustomQuestion({
      question: 'What is Runge-Kutta 4 order?',
      options: ['Order 4', 'Order 1', 'Order 2', 'Order 3'],
      correctIndex: 0,
      explanation: 'RK4 is an explicit fourth-order numerical method.',
    });

    expect(saved.id).toMatch(/^custom-/);
    expect(saved.isCustom).toBe(true);

    const customList = await getAllQuestions('custom');
    expect(customList.length).toBe(1);
    expect(customList[0].question).toBe('What is Runge-Kutta 4 order?');

    await deleteCustomQuestion(saved.id);
    const afterDelete = await getAllQuestions('custom');
    expect(afterDelete.length).toBe(0);
  });

  test('tracks streaks and best streaks correctly', async () => {
    let stats = await getQuizStats();
    expect(stats.streak).toBe(0);
    expect(stats.bestStreak).toBe(0);

    stats = await recordQuizAnswer(true);
    expect(stats.streak).toBe(1);
    expect(stats.bestStreak).toBe(1);

    stats = await recordQuizAnswer(true);
    expect(stats.streak).toBe(2);
    expect(stats.bestStreak).toBe(2);

    stats = await recordQuizAnswer(false);
    expect(stats.streak).toBe(0);
    expect(stats.bestStreak).toBe(2);

    stats = await resetStreak();
    expect(stats.streak).toBe(0);
    expect(stats.bestStreak).toBe(2);
  });
});

