import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  category: 'root-finding' | 'interpolation' | 'errors' | 'custom';
  isCustom?: boolean;
}

export interface QuizStats {
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
}

const STORAGE_CUSTOM_QUESTIONS = '@calculix_custom_quiz_questions_v1';
const STORAGE_QUIZ_STATS = '@calculix_quiz_stats_v1';

export const BUILT_IN_QUESTIONS: QuizQuestion[] = [
  {
    id: 'bi-1',
    question: 'Under what necessary condition does the Bisection Method guarantee finding a real root in [a, b]?',
    options: [
      'f(a) · f(b) < 0 with f continuous',
      'f\'(x) ≠ 0 everywhere in [a, b]',
      'f(a) = f(b) = 0',
      'f"(x) > 0 (strictly convex)',
    ],
    correctIndex: 0,
    explanation:
      'By the Intermediate Value (Bolzano\'s) Theorem, if a continuous function has opposite signs at endpoints (f(a)·f(b) < 0), at least one real root exists in (a, b).',
    category: 'root-finding',
  },
  {
    id: 'bi-2',
    question: 'What is the order of convergence of the standard Newton-Raphson method for a simple root?',
    options: ['Linear (Order 1)', 'Quadratic (Order 2)', 'Golden Ratio (Order 1.618)', 'Cubic (Order 3)'],
    correctIndex: 1,
    explanation:
      'Near a simple root where f\'(r) ≠ 0, Newton-Raphson exhibits quadratic convergence (p = 2). The number of correct decimal digits roughly doubles with each step.',
    category: 'root-finding',
  },
  {
    id: 'bi-3',
    question: 'What is the theoretical maximum absolute error bound for the Bisection Method after n iterations?',
    options: ['(b - a) / 2ⁿ', '(b - a) / n²', '|f(xₙ)| / |f\'(xₙ)|', '(b - a)ⁿ'],
    correctIndex: 0,
    explanation:
      'Each bisection iteration halves the interval length. Hence, after n steps, the interval width is (b - a)/2ⁿ and the maximum error to midpoint is (b - a)/2ⁿ.',
    category: 'root-finding',
  },
  {
    id: 'bi-4',
    question: 'When will the Newton-Raphson iteration xₙ₊₁ = xₙ - f(xₙ)/f\'(xₙ) completely fail to evaluate?',
    options: [
      'When f\'(xₙ) = 0 (horizontal tangent)',
      'When f(xₙ) > 0',
      'When xₙ < 0',
      'When f"(xₙ) = 0',
    ],
    correctIndex: 0,
    explanation:
      'The formula divides by f\'(xₙ). When the tangent line is horizontal (f\'(xₙ) = 0), division by zero occurs and the tangent line never crosses the x-axis.',
    category: 'root-finding',
  },
  {
    id: 'bi-5',
    question: 'What is the convergence order of the Secant Method?',
    options: ['Linear (1.0)', 'Superlinear (≈ 1.618)', 'Quadratic (2.0)', 'Logarithmic (0.5)'],
    correctIndex: 1,
    explanation:
      'The Secant Method converges superlinearly with an order equal to the Golden Ratio φ = (1 + √5)/2 ≈ 1.618, without requiring analytical derivatives.',
    category: 'root-finding',
  },
  {
    id: 'bi-6',
    question: 'In Fixed-Point Iteration x = g(x), what condition guarantees convergence near a fixed point r?',
    options: ['|g\'(r)| < 1', '|g\'(r)| > 1', 'g\'(r) = 0 only', 'g(r) < 0'],
    correctIndex: 0,
    explanation:
      'By the Banach Fixed-Point Theorem, iteration xₙ₊₁ = g(xₙ) converges if |g\'(x)| ≤ k < 1 in an interval around the fixed point.',
    category: 'root-finding',
  },
  {
    id: 'bi-7',
    question: 'How does Regula Falsi (False Position) select the next root estimate compared to Bisection?',
    options: [
      'Linear interpolation (x-intercept of secant)',
      'Arithmetic midpoint (a + b) / 2',
      'Analytical tangent derivative line',
      'Random Monte Carlo sampling',
    ],
    correctIndex: 0,
    explanation:
      'Regula Falsi uses the x-intercept of the secant line joining (a, f(a)) and (b, f(b)), weighting the estimate closer to whichever endpoint has a smaller function value.',
    category: 'root-finding',
  },
  {
    id: 'bi-8',
    question: 'For n given distinct data points, what is the maximum degree of the unique interpolating polynomial?',
    options: ['n - 1', 'n', 'n + 1', '2n'],
    correctIndex: 0,
    explanation:
      'According to polynomial interpolation theory, n distinct data points determine a unique polynomial of degree at most n - 1.',
    category: 'interpolation',
  },
  {
    id: 'bi-9',
    question: 'What is the defining property of the Lagrange cardinal basis polynomial Lᵢ(x) at given data nodes xⱼ?',
    options: [
      'Lᵢ(xⱼ) = 1 if i = j, and 0 if i ≠ j (Kronecker delta)',
      'Lᵢ(xⱼ) = 0 for all j',
      'Lᵢ(xⱼ) = 1 for all j',
      'Lᵢ(xⱼ) = xᵢ - xⱼ',
    ],
    correctIndex: 0,
    explanation:
      'Each Lagrange basis polynomial Lᵢ(x) is designed such that Lᵢ(xᵢ) = 1 and Lᵢ(xⱼ) = 0 whenever j ≠ i. Thus P(x) = Σ yᵢ · Lᵢ(x) passes through every (xᵢ, yᵢ).',
    category: 'interpolation',
  },
  {
    id: 'bi-10',
    question: 'What is a primary computational advantage of Newton\'s Divided Difference over Lagrange interpolation?',
    options: [
      'Adding a new data point does not require recalculating previous terms',
      'It produces a trigonometric Fourier series',
      'It avoids any division operations',
      'It can interpolate complex numbers only',
    ],
    correctIndex: 0,
    explanation:
      'Newton\'s form is incremental: adding a new data point adds one row to the bottom of the difference table and one polynomial term, preserving all prior coefficients.',
    category: 'interpolation',
  },
  {
    id: 'bi-11',
    question: 'What is the recursive definition of the first-order divided difference f[x₀, x₁]?',
    options: [
      '(f(x₁) - f(x₀)) / (x₁ - x₀)',
      '(f(x₁) + f(x₀)) / 2',
      'f(x₁) · f(x₀) / (x₁ - x₀)',
      '(x₁ - x₀) / (f(x₁) - f(x₀))',
    ],
    correctIndex: 0,
    explanation:
      'The divided difference f[x₀, x₁] is the average rate of change between the two points: (f(x₁) - f(x₀)) / (x₁ - x₀).',
    category: 'interpolation',
  },
  {
    id: 'bi-12',
    question: 'What mathematical definition is used for the Relative Approximate Error (εₐ) in root finding?',
    options: [
      '|(x_new - x_old) / x_new| × 100%',
      '|x_new - x_old|',
      '|f(x_new)|',
      '|(True - Approx) / True| × 100%',
    ],
    correctIndex: 0,
    explanation:
      'When the true root is unknown, relative approximate error compares the change between successive iterations divided by the newest iteration: |(xₙ - xₙ₋₁)/xₙ| × 100%.',
    category: 'errors',
  },
  {
    id: 'bi-13',
    question: 'What causes "truncation error" in numerical methods?',
    options: [
      'Approximating an infinite mathematical process with a finite number of steps',
      'Finite 64-bit IEEE-754 precision storage of floating-point numbers',
      'Typographical mistakes entered by the user',
      'Hardware overheating in the CPU arithmetic logic unit',
    ],
    correctIndex: 0,
    explanation:
      'Truncation error arises when an exact mathematical process (such as a Taylor series, limit definition of derivative, or infinite integration) is cut short or truncated.',
    category: 'errors',
  },
  {
    id: 'bi-14',
    question: 'What causes "roundoff error" in numerical computation?',
    options: [
      'The inability of finite binary floating-point representation to store recurring decimals exactly',
      'Terminating an iterative method too early',
      'Using linear interpolation instead of quadratic',
      'Dividing by large numbers',
    ],
    correctIndex: 0,
    explanation:
      'Computers use finite bit representations (e.g. IEEE 754 64-bit float). Real numbers like 1/3 or 0.1 cannot be represented with infinite precision, causing roundoff.',
    category: 'errors',
  },
  {
    id: 'bi-15',
    question: 'Why does the Modified Secant Method use a small fractional perturbation δ (delta)?',
    options: [
      'To approximate the derivative f\'(x) using a single initial point x₀',
      'To accelerate convergence from quadratic to cubic',
      'To prevent the function from having complex roots',
      'To force the iteration interval to stay positive',
    ],
    correctIndex: 0,
    explanation:
      'The Modified Secant uses f\'(xₙ) ≈ (f(xₙ + δ·xₙ) - f(xₙ)) / (δ·xₙ), removing the need for two separate initial guesses while avoiding analytical differentiation.',
    category: 'root-finding',
  },
  {
    id: 'bi-16',
    question: 'What is Runge\'s phenomenon in polynomial interpolation?',
    options: [
      'Severe edge oscillations that occur when using high-degree polynomials with equispaced nodes',
      'The divided difference table becoming all zeros',
      'Lagrange basis polynomials becoming imaginary',
      'Convergence slowing down near local minima',
    ],
    correctIndex: 0,
    explanation:
      'Discovered by Carl Runge, interpolating functions over equispaced intervals with high-degree polynomials causes wild oscillations near the interval boundaries.',
    category: 'interpolation',
  },
  {
    id: 'bi-17',
    question: 'What optimal choice of interpolation nodes minimizes Runge\'s oscillation phenomenon?',
    options: [
      'Chebyshev nodes (roots of Chebyshev polynomials)',
      'Equidistant arithmetic progression nodes',
      'Prime numbered coordinates',
      'Logarithmically spaced points',
    ],
    correctIndex: 0,
    explanation:
      'Chebyshev nodes cluster more points near the interval endpoints, minimizing the maximum value of the interpolation error polynomial according to minimax theory.',
    category: 'interpolation',
  },
  {
    id: 'bi-18',
    question: 'What is the condition number of a mathematical problem a measure of?',
    options: [
      'The sensitivity of the solution to small perturbations or errors in the input data',
      'The number of seconds required to run an algorithm',
      'The degree of the resulting polynomial',
      'The amount of RAM required to store the matrix',
    ],
    correctIndex: 0,
    explanation:
      'A problem is well-conditioned if a small change in inputs causes a small change in output (low condition number), and ill-conditioned if the output changes drastically.',
    category: 'errors',
  },
  {
    id: 'bi-19',
    question: 'If f(x) has a multiple root of multiplicity m > 1, how does Newton-Raphson convergence change?',
    options: [
      'It degrades from quadratic (p=2) to linear (p=1)',
      'It accelerates to cubic (p=3)',
      'It continues with quadratic convergence unaffected',
      'It immediately produces NaN on the first iteration',
    ],
    correctIndex: 0,
    explanation:
      'At a root with multiplicity m > 1, f\'(r) = 0. Standard Newton-Raphson loses its quadratic rate and slows to linear convergence unless modified with factor m.',
    category: 'root-finding',
  },
  {
    id: 'bi-20',
    question: 'Which bracket method is guaranteed to never diverge if the initial interval brackets a root?',
    options: ['Bisection Method', 'Newton-Raphson', 'Secant Method', 'Fixed-Point Iteration'],
    correctIndex: 0,
    explanation:
      'Bisection is unconditionally convergent: as long as the initial bracket [a, b] contains a root of a continuous function, the interval is guaranteed to shrink to the root.',
    category: 'root-finding',
  },
];

/** Fisher-Yates array shuffle */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Randomize question options while maintaining correct answer tracking */
export function randomizeQuestionOptions(q: QuizQuestion): QuizQuestion {
  const correctOptionText = q.options[q.correctIndex];
  const shuffledOptions = shuffleArray(q.options) as [string, string, string, string];
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...q,
    options: shuffledOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

export async function getCustomQuestions(): Promise<QuizQuestion[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_CUSTOM_QUESTIONS);
    if (!raw) return [];
    return JSON.parse(raw) as QuizQuestion[];
  } catch {
    return [];
  }
}

export async function saveCustomQuestion(
  q: Omit<QuizQuestion, 'id' | 'isCustom' | 'category'>
): Promise<QuizQuestion> {
  const current = await getCustomQuestions();
  const newQuestion: QuizQuestion = {
    ...q,
    id: 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    category: 'custom',
    isCustom: true,
  };
  const updated = [newQuestion, ...current];
  await AsyncStorage.setItem(STORAGE_CUSTOM_QUESTIONS, JSON.stringify(updated));
  return newQuestion;
}

export async function deleteCustomQuestion(id: string): Promise<void> {
  const current = await getCustomQuestions();
  const updated = current.filter((q) => q.id !== id);
  await AsyncStorage.setItem(STORAGE_CUSTOM_QUESTIONS, JSON.stringify(updated));
}

export async function getAllQuestions(filter: 'all' | 'built-in' | 'custom' = 'all'): Promise<QuizQuestion[]> {
  const custom = await getCustomQuestions();
  if (filter === 'custom') return custom;
  if (filter === 'built-in') return BUILT_IN_QUESTIONS;
  return [...BUILT_IN_QUESTIONS, ...custom];
}

export async function getQuizStats(): Promise<QuizStats> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_QUIZ_STATS);
    if (!raw) {
      return { streak: 0, bestStreak: 0, totalAnswered: 0, totalCorrect: 0 };
    }
    return JSON.parse(raw) as QuizStats;
  } catch {
    return { streak: 0, bestStreak: 0, totalAnswered: 0, totalCorrect: 0 };
  }
}

export async function recordQuizAnswer(isCorrect: boolean): Promise<QuizStats> {
  const stats = await getQuizStats();
  const newStreak = isCorrect ? stats.streak + 1 : 0;
  const bestStreak = Math.max(stats.bestStreak, newStreak);
  const updated: QuizStats = {
    streak: newStreak,
    bestStreak,
    totalAnswered: stats.totalAnswered + 1,
    totalCorrect: isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect,
  };
  await AsyncStorage.setItem(STORAGE_QUIZ_STATS, JSON.stringify(updated));
  return updated;
}

export async function resetStreak(): Promise<QuizStats> {
  const stats = await getQuizStats();
  const updated: QuizStats = { ...stats, streak: 0 };
  await AsyncStorage.setItem(STORAGE_QUIZ_STATS, JSON.stringify(updated));
  return updated;
}

