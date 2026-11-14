import { SolverId } from '../screens/HomeScreen';
import { SolverPrefill } from '../services/historyService';

export interface WorkedStep {
  step: string;
  detail: string;
  math: string;
}

export interface InputGuideItem {
  field: string;
  example: string;
  note: string;
}

export interface UserManualSection {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  items: {
    heading: string;
    body: string;
    codeSample?: string;
  }[];
}

export interface TutorialChapter {
  id: string;
  solverId?: SolverId;
  title: string;
  category: 'Root-Finding' | 'Interpolation' | 'Errors & Convergence';
  orderBadge: string;
  guarantee: string;
  accentColor: string;
  tagline: string;
  beautyNarrative: string;
  intuition: string;
  realWorldApplications: string[];
  mathFormula: string;
  formulaExplanation: string;
  derivationSteps: string[];
  conditions: string[];
  pitfalls: string[];
  workedExample: {
    problem: string;
    stepByStep: WorkedStep[];
    finalResult: string;
  };
  calculatorGuide: {
    inputItems: InputGuideItem[];
    usageSteps: string[];
    targetMethod: SolverId;
    prefill?: SolverPrefill;
  };
}

export const USER_MANUAL_SECTIONS: UserManualSection[] = [
  {
    id: 'syntax',
    index: '01',
    title: 'Expression Syntax & Math Keypad',
    subtitle: 'Writing valid mathematical functions f(x) and g(x)',
    summary:
      'Calculix uses a symbolic and numerical expression engine that supports standard algebraic notation, elementary transcendental functions, and scientific constants.',
    items: [
      {
        heading: 'Variables & Exponents',
        body: 'Always use lowercase x as your independent variable. Use the caret symbol (^) for powers and fractional exponents.',
        codeSample: 'x^3 - 2*x - 5    |    (2*x + 5)^(1/3)',
      },
      {
        heading: 'Built-in Mathematical Functions',
        body: 'Trigonometric functions operate in radians. Natural logarithm is written as log(x) or ln(x), and square root as sqrt(x).',
        codeSample: 'cos(x) - x   |   e^(-x) - x   |   sqrt(x + 2)',
      },
      {
        heading: 'Constants & Scientific Notation',
        body: 'Use pi and e directly in formulas. For tolerance (ε), scientific E-notation such as 1e-6 (0.000001) is supported.',
        codeSample: 'Tolerance: 1e-6   |   pi * x^2 - 10',
      },
    ],
  },
  {
    id: 'root-solvers',
    index: '02',
    title: 'Root-Finding Solvers Guide',
    subtitle: 'Navigating Inputs, Solution Steps, and Iteration Tables',
    summary:
      'Each root-finding screen is organized into a 3-tab Segmented Deck below the live function curve so you can move seamlessly from problem setup to full tabular proof.',
    items: [
      {
        heading: 'Tab 1: Inputs & Quick Presets',
        body: 'Tap any preset chip at the top of the input card to load classic textbook functions, or enter your own equation and interval/initial guesses. Expand "Advanced Parameters" to customize tolerance ε and max iterations N.',
      },
      {
        heading: 'Tab 2: Solution & Natural Steps',
        body: 'Displays the converged root x*, execution time, analytical derivative (for Newton-Raphson), and natural-language step cards explaining the arithmetic of each iteration.',
      },
      {
        heading: 'Tab 3: Convergence Iteration Table',
        body: 'Shows every iteration row k, current estimate x_k, function residual f(x_k), and relative approximate error ε_a (%) for homework verification.',
      },
    ],
  },
  {
    id: 'interpolation-solvers',
    index: '03',
    title: 'Interpolation & Coordinate Editor',
    subtitle: 'Fitting exact polynomials through discrete data nodes',
    summary:
      'The Interpolation solvers construct the unique degree-(n-1) polynomial passing through n coordinate pairs and evaluate it at your target query point x*.',
    items: [
      {
        heading: 'Managing Data Nodes (xᵢ, yᵢ)',
        body: 'Add or remove coordinate rows in the Point List Editor. Ensure all x-coordinates are distinct so divided differences and basis denominators never divide by zero.',
        codeSample: '(1, 1), (2, 4), (4, 16)  →  Target x* = 3',
      },
      {
        heading: 'Divided Difference Pyramid & Lagrange Basis',
        body: 'Open the third deck tab ("Matrix" / "Basis") to inspect every column of Newton\'s triangular divided difference table or each individual Lagrange cardinal basis polynomial Lᵢ(x).',
      },
    ],
  },
  {
    id: 'flashcards-manual',
    index: '04',
    title: 'Flashcards & Custom Study Decks',
    subtitle: 'Active recall for numerical analysis exams',
    summary:
      'Use the Flashcards tab to test your understanding of convergence orders, hypotheses, and error bounds using either multiple-choice quizzes or flip cards.',
    items: [
      {
        heading: 'Practice Quiz vs. Flip Study',
        body: 'Switch between "Practice Quiz" (4 choices with instant explanation feedback) and "Flip Study" (tap card to flip between question and theorem). Use "Shuffle" to randomize card order.',
      },
      {
        heading: 'Creating Custom Cards',
        body: 'Tap "+ Create" in the top bar to author your own study questions, four answer choices, and a concept explanation. Filter by "My Cards" to review your custom deck.',
      },
    ],
  },
  {
    id: 'history-export',
    index: '05',
    title: 'History Restoration & Exporting',
    subtitle: 'Re-running saved calculations and sharing reports',
    summary:
      'Every calculation is automatically saved to your local History so you can revisit previous problems or export formatted solutions.',
    items: [
      {
        heading: 'One-Tap History Restoration',
        body: 'Open the top-left menu drawer on the Home screen and select "History". Tapping any saved run immediately opens that solver, restores all parameters, and computes the full solution.',
      },
      {
        heading: 'Markdown & LaTeX Solution Export',
        body: 'Inside any solved result card, tap "Share Markdown" or "Share LaTeX" to copy or share a formatted report containing the problem, root/interpolated value, and iteration summary.',
      },
    ],
  },
];

export const TUTORIAL_CHAPTERS: TutorialChapter[] = [
  {
    id: 'bisection',
    solverId: 'bisection',
    title: 'Bisection Method',
    category: 'Root-Finding',
    orderBadge: 'Linear (Order 1)',
    guarantee: 'Unconditionally Convergent',
    accentColor: '#00D2D3',
    tagline: 'Reliable interval halving based on the Intermediate Value Theorem',
    beautyNarrative:
      'The beauty of the Bisection Method lies in its absolute topological certainty. Rooted in Bernard Bolzano\'s 1817 proof of the Intermediate Value Theorem, it requires no derivatives, no smooth tangents, and no luck. Even if a function waves wildly inside an interval, a simple sign change at the endpoints traps the root like a mathematical vise. Every single step is guaranteed to cut the uncertainty in half—making it the gold standard of binary search in continuous mathematics.',
    intuition:
      'Imagine guessing a secret number between 1 and 100. If someone tells you whether your guess is too high or too low, the best strategy is always guessing the exact middle (50). The Bisection Method does exactly this for mathematical functions: it tests the midpoint of an interval, checks whether the function crossed zero to the left or right, and discards the other half. It is slow but completely fail-safe.',
    realWorldApplications: [
      ' Aerospace & Control Systems: Used as a fail-safe fallback when Newton-Raphson diverges near singularities.',
      'Computer Graphics Ray Marching: Finding the exact intersection point where a ray crosses an implicit 3D surface.',
      'Quantitative Finance: Computing implied volatility or internal rate of return (IRR) when cash-flow derivatives are discontinuous.',
    ],
    mathFormula: 'cₙ = (aₙ + bₙ) / 2\n\nIf f(aₙ) · f(cₙ) < 0 ⇒ bₙ₊₁ = cₙ\nIf f(aₙ) · f(cₙ) > 0 ⇒ aₙ₊₁ = cₙ',
    formulaExplanation:
      'cₙ is the midpoint. If f(a) and f(c) have opposite signs (their product is negative), Bolzano\'s Theorem proves the root lies in [a, c]. Otherwise, it must lie in [c, b].',
    derivationSteps: [
      '1. By the Intermediate Value Theorem, if f is continuous on [a₀, b₀] and f(a₀)·f(b₀) < 0, there exists at least one root r ∈ (a₀, b₀).',
      '2. Bisect the interval at the midpoint cₙ = (aₙ + bₙ) / 2, leaving two subintervals of equal width (bₙ - aₙ) / 2.',
      '3. After n iterations, the bracket width is (b₀ - a₀) / 2ⁿ, giving the exact a priori error bound |r - cₙ| ≤ (b₀ - a₀) / 2ⁿ.',
      '4. Solving (b₀ - a₀) / 2ⁿ ≤ ε yields the exact number of iterations needed before even computing a single step: n ≥ log₂((b₀ - a₀) / ε).',
    ],
    conditions: [
      'f(x) must be continuous on the closed interval [a, b].',
      'f(a) · f(b) < 0 (the function must have opposite signs at the interval endpoints).',
    ],
    pitfalls: [
      'Cannot find roots with even multiplicity where the curve touches but does not cross the x-axis (e.g. f(x) = (x-2)²).',
      'Relatively slow linear convergence: halving the error requires roughly 3.32 iterations per decimal digit.',
    ],
    workedExample: {
      problem: 'Find a root of f(x) = x³ - x - 2 = 0 in [1, 2] with tolerance ε = 0.05.',
      stepByStep: [
        {
          step: 'Check Initial Bracket',
          detail: 'f(1) = 1 - 1 - 2 = -2 (< 0)\nf(2) = 8 - 2 - 2 = +4 (> 0)\nSign change confirmed (-2 · 4 = -8 < 0). Root r ∈ [1, 2].',
          math: 'f(1) < 0, f(2) > 0',
        },
        {
          step: 'Iteration 1',
          detail: 'Midpoint c₁ = (1 + 2)/2 = 1.5\nEvaluate: f(1.5) = (1.5)³ - 1.5 - 2 = 3.375 - 3.5 = -0.125 (< 0).\nSince f(1.5) < 0, replace lower bound a with 1.5. New interval: [1.5, 2.0].',
          math: 'c₁ = 1.5000, f(c₁) = -0.125',
        },
        {
          step: 'Iteration 2',
          detail: 'Midpoint c₂ = (1.5 + 2)/2 = 1.75\nEvaluate: f(1.75) = 1.75³ - 1.75 - 2 = 5.359 - 3.75 = +1.609 (> 0).\nSince f(1.75) > 0, replace upper bound b with 1.75. New interval: [1.5, 1.75].',
          math: 'c₂ = 1.7500, f(c₂) = +1.609',
        },
        {
          step: 'Iteration 3',
          detail: 'Midpoint c₃ = (1.5 + 1.75)/2 = 1.625\nEvaluate: f(1.625) = 1.625³ - 1.625 - 2 = 4.291 - 3.625 = +0.666 (> 0).\nInterval width is now (1.75 - 1.5)/2 = 0.125. Next step yields c₄ = 1.5625.',
          math: 'c₃ = 1.6250, root ≈ 1.521',
        },
      ],
      finalResult: 'True root is r ≈ 1.52138. The midpoint rapidly narrows within [1.5, 1.5625].',
    },
    calculatorGuide: {
      targetMethod: 'bisection',
      prefill: {
        rootParams: {
          functionStr: 'x^3 - x - 2',
          a: 1,
          b: 2,
          tolerance: 1e-5,
        },
      },
      inputItems: [
        { field: 'Function f(x)', example: 'x^3 - x - 2', note: 'Standard math expression with x variable' },
        { field: 'Start (a)', example: '1', note: 'Lower bound where f(a) has one sign' },
        { field: 'End (b)', example: '2', note: 'Upper bound where f(b) has the opposite sign' },
        { field: 'Accuracy Goal (ε)', example: '1e-5', note: 'Tolerance stop condition' },
      ],
      usageSteps: [
        '1. Switch to Bisection in the Solvers tab.',
        '2. Type the function into the f(x) field.',
        '3. Enter endpoints [a, b] ensuring f(a) and f(b) have opposite signs.',
        '4. Tap "Find Root with Bisection".',
        '5. The screen automatically switches to "Solution & Steps", displaying the step cards and visual graph with a marker on the root.',
      ],
    },
  },
  {
    id: 'newton',
    solverId: 'newton',
    title: 'Newton-Raphson Method',
    category: 'Root-Finding',
    orderBadge: 'Quadratic (Order 2)',
    guarantee: 'Fast Local Convergence',
    accentColor: '#FF2E93',
    tagline: 'High-speed tangent projection doubling correct digits every step',
    beautyNarrative:
      'Newton-Raphson is one of the crowning jewels of calculus. Tracing its roots from ancient Babylonian square-root tables to Isaac Newton (1669) and Joseph Raphson (1690), it embodies the core philosophy of differential calculus: any smooth curve looks like a straight line when you zoom in close enough. By riding the local tangent line down to the x-axis, the error is squared on every step (eₙ₊₁ ≈ C·eₙ²). Going from 1 correct digit to 64 correct digits takes only six iterations.',
    intuition:
      'Instead of cutting intervals in half, Newton-Raphson looks at the slope (derivative) of the curve at your current guess. It draws the tangent line and shoots straight down to where that line hits the x-axis. That x-intercept becomes your next, vastly improved estimate. When close to a simple root, the number of accurate decimal digits roughly doubles on every single iteration.',
    realWorldApplications: [
      'Orbital Mechanics: Solving Kepler\'s Equation M = E - e·sin(E) to pinpoint satellite and planetary positions in real time.',
      'Power Grid Load Flow: Solving massive nonlinear AC power-flow equations across electrical transmission networks.',
      'Robotics Inverse Kinematics: Rapidly computing joint angles needed to place a robotic arm at a target 3D coordinate.',
    ],
    mathFormula: 'xₙ₊₁ = xₙ - f(xₙ) / f\'(xₙ)',
    formulaExplanation:
      'From the point-slope line equation y - f(xₙ) = f\'(xₙ)(x - xₙ), setting y = 0 and solving for x gives the x-intercept xₙ₊₁.',
    derivationSteps: [
      '1. Expand f(x) in a first-order Taylor series around current guess xₙ: f(x) ≈ f(xₙ) + f\'(xₙ)(x - xₙ) + ½f\'\'(ξ)(x - xₙ)².',
      '2. Set f(xₙ₊₁) = 0 for the linear approximation: 0 = f(xₙ) + f\'(xₙ)(xₙ₊₁ - xₙ).',
      '3. Rearranging for xₙ₊₁ yields Newton\'s recurrence: xₙ₊₁ = xₙ - f(xₙ) / f\'(xₙ).',
      '4. Subtracting the true root r shows the error relation eₙ₊₁ ≈ [f\'\'(r) / (2f\'(r))] · eₙ², proving Order-2 quadratic convergence.',
    ],
    conditions: [
      'f(x) must be differentiable and f\'(x) must be continuous near the root.',
      'Initial guess x₀ must be reasonably close to the root to avoid divergence.',
      'f\'(r) ≠ 0 at the root (simple root condition).',
    ],
    pitfalls: [
      'Horizontal Tangent Failure: If f\'(xₙ) ≈ 0, division by zero occurs or the tangent shoots far away.',
      'Inflection Cycles: Can enter an infinite oscillating loop between two values (e.g. f(x) = x³ - 5x).',
    ],
    workedExample: {
      problem: 'Find √2 by computing the positive root of f(x) = x² - 2 = 0 using initial guess x₀ = 2.',
      stepByStep: [
        {
          step: 'Compute Derivative',
          detail: 'f(x) = x² - 2 ⇒ f\'(x) = 2x.\nNewton formula: xₙ₊₁ = xₙ - (xₙ² - 2) / (2xₙ) = (xₙ + 2/xₙ) / 2.',
          math: 'xₙ₊₁ = 0.5 · (xₙ + 2/xₙ)',
        },
        {
          step: 'Iteration 1 (from x₀ = 2)',
          detail: 'x₁ = (2 + 2/2) / 2 = 3/2 = 1.500000\nError |x₁ - √2| ≈ 0.0858.',
          math: 'x₁ = 1.500000',
        },
        {
          step: 'Iteration 2 (from x₁ = 1.5)',
          detail: 'x₂ = (1.5 + 2/1.5) / 2 = (1.5 + 1.333333) / 2 = 1.416667\nError |x₂ - √2| ≈ 0.00245 (quadratically reduced!).',
          math: 'x₂ = 1.416667',
        },
        {
          step: 'Iteration 3 (from x₂ = 1.416667)',
          detail: 'x₃ = (1.416667 + 2/1.416667) / 2 = 1.414216\nError is now under 0.000002. Already accurate to 6 decimal places in just 3 steps!',
          math: 'x₃ = 1.414214',
        },
      ],
      finalResult: 'x ≈ 1.41421356. Quadratic convergence doubled the accuracy each step.',
    },
    calculatorGuide: {
      targetMethod: 'newton',
      prefill: {
        rootParams: {
          functionStr: 'x^2 - 2',
          x0: 2,
          tolerance: 1e-7,
        },
      },
      inputItems: [
        { field: 'Function f(x)', example: 'x^2 - 2', note: 'Calculix automatically computes analytical derivatives' },
        { field: 'Initial Guess (x₀)', example: '2', note: 'Start reasonably close to the expected root' },
        { field: 'Tolerance (ε)', example: '1e-7', note: 'Newton can easily reach 1e-12 in few iterations' },
      ],
      usageSteps: [
        '1. Select Newton in the solver strip.',
        '2. Enter f(x) and your initial guess x₀.',
        '3. Tap "Find Root with Newton".',
        '4. View the tangent steps in "Solution & Steps" and check the quadratic drop in error in the "Iteration Table".',
      ],
    },
  },
  {
    id: 'secant',
    solverId: 'secant',
    title: 'Secant Method',
    category: 'Root-Finding',
    orderBadge: 'Superlinear (Order 1.618)',
    guarantee: 'Fast, Derivative-Free',
    accentColor: '#A855F7',
    tagline: 'Approximates Newton tangents with secant lines across two guesses',
    beautyNarrative:
      'What makes the Secant Method mathematically breathtaking is a hidden appearance of the Golden Ratio (φ = (1 + √5)/2 ≈ 1.618). Predating calculus itself by over 3,000 years, it replaces Newton\'s analytical derivative with a chord drawn through the last two points. Because each step requires only ONE new function evaluation (versus two for Newton when f and f\' are separate), its actual computational efficiency per function call (1.618¹ ≈ 1.618 vs. 2^(1/2) ≈ 1.414) often beats Newton-Raphson in practice!',
    intuition:
      'Newton-Raphson is wonderful, but in the real world, computing exact analytical derivatives f\'(x) can be mathematically intractable or computationally expensive. The Secant Method solves this by approximating the derivative slope using the secant line between your two previous points (xₙ₋₁, xₙ). You get near-Newton speeds without ever taking a derivative.',
    realWorldApplications: [
      'Black-Box Engineering Simulations: Finding roots when f(x) comes from a finite-element or CFD simulation with no closed-form derivative.',
      'Ballistics & Trajectory Targeting: Adjusting launch elevation angles from two previous trial shots to hit a target distance.',
      'Thermodynamic Equations of State: Solving van der Waals or Peng-Robinson gas equations for molar volume.',
    ],
    mathFormula: 'xₙ₊₁ = xₙ - f(xₙ) · [ (xₙ - xₙ₋₁) / (f(xₙ) - f(xₙ₋₁)) ]',
    formulaExplanation:
      'The difference quotient (f(xₙ) - f(xₙ₋₁))/(xₙ - xₙ₋₁) acts as the finite-difference proxy for the tangent derivative f\'(xₙ).',
    derivationSteps: [
      '1. Start from Newton\'s update rule: xₙ₊₁ = xₙ - f(xₙ) / f\'(xₙ).',
      '2. Approximate the derivative f\'(xₙ) by the backward finite difference quotient: f\'(xₙ) ≈ (f(xₙ) - f(xₙ₋₁)) / (xₙ - xₙ₋₁).',
      '3. Substitute this secant slope into Newton\'s formula to obtain the derivative-free recurrence.',
      '4. Error analysis shows eₙ₊₁ ≈ C · eₙ · eₙ₋₁, whose characteristic exponent satisfies p² - p - 1 = 0, yielding the Golden Ratio p = φ ≈ 1.618.',
    ],
    conditions: [
      'Requires two initial points x₀ and x₁ (they do not need to bracket the root).',
      'f(x₀) ≠ f(x₁) to avoid division by zero.',
    ],
    pitfalls: [
      'If f(xₙ) ≈ f(xₙ₋₁), division by near-zero leads to floating-point catastrophic cancellation.',
      'Unlike Bisection, it is open: bad starting points can diverge into infinity.',
    ],
    workedExample: {
      problem: 'Find root of f(x) = x² - 4 = 0 starting from x₀ = 3 and x₁ = 2.5.',
      stepByStep: [
        {
          step: 'Initial Values',
          detail: 'f(x₀) = f(3) = 9 - 4 = 5\nf(x₁) = f(2.5) = 6.25 - 4 = 2.25',
          math: 'f(3) = 5, f(2.5) = 2.25',
        },
        {
          step: 'Iteration 1',
          detail: 'Slope proxy = (2.25 - 5) / (2.5 - 3) = -2.75 / -0.5 = 5.5\nx₂ = 2.5 - 2.25 / 5.5 = 2.5 - 0.4091 = 2.0909',
          math: 'x₂ = 2.090909',
        },
        {
          step: 'Iteration 2',
          detail: 'Evaluate f(2.0909) = 4.3719 - 4 = 0.3719\nSlope proxy = (0.3719 - 2.25) / (2.0909 - 2.5) = -1.8781 / -0.4091 = 4.5908\nx₃ = 2.0909 - 0.3719 / 4.5908 = 2.0099',
          math: 'x₃ = 2.009908',
        },
      ],
      finalResult: 'Root converges directly toward exact root 2.000 in superlinear time.',
    },
    calculatorGuide: {
      targetMethod: 'secant',
      prefill: {
        rootParams: {
          functionStr: 'x^2 - 4',
          x0: 3,
          x1: 2.5,
        },
      },
      inputItems: [
        { field: 'Function f(x)', example: 'x^2 - 4', note: 'Arbitrary continuous mathematical function' },
        { field: 'Point 1 (x₀)', example: '3', note: 'First initial estimate' },
        { field: 'Point 2 (x₁)', example: '2.5', note: 'Second initial estimate near x₀' },
      ],
      usageSteps: [
        '1. Switch to Secant in the solver header.',
        '2. Provide two initial points x₀ and x₁.',
        '3. Tap "Find Root with Secant".',
        '4. View the convergence path across the two-point secant line.',
      ],
    },
  },
  {
    id: 'fixed-point',
    solverId: 'fixed-point',
    title: 'Fixed-Point Iteration',
    category: 'Root-Finding',
    orderBadge: 'Linear (Order 1)',
    guarantee: 'Converges when |g\'(x)| < 1',
    accentColor: '#10B981',
    tagline: 'Transforms roots into attractor points via iteration x = g(x)',
    beautyNarrative:
      'Fixed-Point Iteration reveals the deep connection between algebra and dynamical systems. Formalized by Stefan Banach\'s 1922 Contraction Mapping Theorem, it turns root-finding into a geometric cobweb dance between y = g(x) and the mirror line y = x. Whenever a transformation shrinks distances (|g\'(x)| < 1), repeated application inevitably pulls every point in the basin of attraction into a single stationary equilibrium—the exact same principle behind Google\'s PageRank, Markov chains, and economic Nash equilibria.',
    intuition:
      'Any root problem f(x) = 0 can be rearranged algebraically into the form x = g(x). A point where x = g(x) is called a "fixed point". Geometrically, it is the intersection of y = g(x) with the 45-degree diagonal line y = x. Starting from x₀, you step up to g(x₀), bounce horizontally to y = x, and repeat. If |g\'(x)| < 1, the iteration behaves like a funnel (attractor) spiraling into the answer.',
    realWorldApplications: [
      'Network Ranking (PageRank): Finding the dominant eigenvector of web link graphs via repeated fixed-point power iteration.',
      'Chemical Equilibrium & Fluid Friction: Solving the implicit Colebrook-White equation for pipe friction factors.',
      'Differential Equations (Picard Iteration): Proving existence and uniqueness of ODE solutions by iterating integral operators.',
    ],
    mathFormula: 'xₙ₊₁ = g(xₙ)\n\nConvergence criterion: |g\'(r)| < 1',
    formulaExplanation:
      'By the Banach Fixed-Point Theorem, successive iterations contract distance toward root r as long as the Lipschitz slope |g\'(x)| remains strictly under 1.',
    derivationSteps: [
      '1. Rewrite f(x) = 0 into an equivalent fixed-point equation x = g(x) such that f(r) = 0 ⇔ r = g(r).',
      '2. By the Mean Value Theorem, |xₙ₊₁ - r| = |g(xₙ) - g(r)| = |g\'(ξₙ)| · |xₙ - r| for some ξₙ between xₙ and r.',
      '3. If |g\'(x)| ≤ k < 1 on the interval, then |xₙ - r| ≤ kⁿ |x₀ - r|.',
      '4. Since 0 ≤ k < 1, kⁿ → 0 as n → ∞, guaranteeing convergence to the unique fixed point r.',
    ],
    conditions: [
      'g(x) must map interval [a, b] into itself.',
      '|g\'(x)| ≤ k < 1 for all x in the interval (Contraction Mapping).',
    ],
    pitfalls: [
      'Divergence if |g\'(x)| > 1: The iteration spirals outwards away from the root into infinity.',
      'Different rearrangements of the same f(x) yield completely different g(x) functions; you must choose one with small derivative.',
    ],
    workedExample: {
      problem: 'Find root of f(x) = x² - x - 2 = 0. Rearrange to x = √(x + 2). Start at x₀ = 1.',
      stepByStep: [
        {
          step: 'Check Derivative',
          detail: 'g(x) = (x + 2)^(1/2) ⇒ g\'(x) = 1 / (2√(x + 2)).\nAt x = 2, g\'(2) = 1/(2√4) = 1/4 = 0.25 < 1. Convergence is guaranteed!',
          math: "|g'(x)| = 0.25 < 1",
        },
        {
          step: 'Iteration 1',
          detail: 'x₁ = g(1) = √(1 + 2) = √3 ≈ 1.73205',
          math: 'x₁ = 1.73205',
        },
        {
          step: 'Iteration 2',
          detail: 'x₂ = g(1.73205) = √(1.73205 + 2) = √3.73205 ≈ 1.93185',
          math: 'x₂ = 1.93185',
        },
        {
          step: 'Iteration 3',
          detail: 'x₃ = g(1.93185) = √(3.93185) ≈ 1.98289',
          math: 'x₃ = 1.98289',
        },
      ],
      finalResult: 'Rapidly converges to true root x = 2.000.',
    },
    calculatorGuide: {
      targetMethod: 'fixed-point',
      prefill: {
        rootParams: {
          functionStr: 'x^2 - x - 2',
          gFunctionStr: 'sqrt(x + 2)',
          x0: 1,
        },
      },
      inputItems: [
        { field: 'Original f(x)', example: 'x^2 - x - 2', note: 'Original root statement' },
        { field: 'Iteration Form g(x)', example: 'sqrt(x + 2)', note: 'Must satisfy |g\'(x)| < 1 near root' },
        { field: 'Initial Guess (x₀)', example: '1', note: 'Seed value' },
      ],
      usageSteps: [
        '1. Select Fixed-Point from the solver tab.',
        '2. Enter both f(x) and your rewritten g(x) form.',
        '3. Enter x₀ and tap "Find Root with Fixed-Point".',
        '4. View convergence steps and verify that g(xₙ) approaches xₙ.',
      ],
    },
  },
  {
    id: 'newton-divided',
    solverId: 'newton-divided',
    title: "Newton's Divided Difference",
    category: 'Interpolation',
    orderBadge: 'Degree n-1 Polynomial',
    guarantee: 'Exact Through All Points',
    accentColor: '#0284C7',
    tagline: 'Constructs interpolating polynomials with a triangular difference matrix',
    beautyNarrative:
      'Newton\'s Divided Difference formula is a masterpiece of recursive structure. Just as Taylor series build a function from derivatives at a single point (1, (x-x₀), (x-x₀)²...), Newton builds an exact polynomial across discrete points using nested basis factors: 1, (x-x₀), (x-x₀)(x-x₁)... Its greatest elegance is permanence: if you have a degree-3 polynomial and measure a new 5th data point, all previous coefficients remain untouched—you simply append one new term.',
    intuition:
      'Given a set of coordinate data points (x₀, y₀), (x₁, y₁), ..., how do you find the unique smooth polynomial that passes through all of them? Newton\'s Divided Difference builds this polynomial incrementally using a triangular table of average rates of change. If you later collect another data point, you do not have to restart: you simply add one more row to the bottom of the table.',
    realWorldApplications: [
      'Sensor Calibration & Telemetry: Reconstructing continuous temperature or pressure curves from discrete hardware readings.',
      'Numerical Integration & ODE Solvers: Deriving Adams-Bashforth and backward differentiation multistep formulas.',
      'Computer Animation Keyframing: Generating smooth motion paths across unevenly spaced time keyframes.',
    ],
    mathFormula: 'P(x) = f[x₀] + f[x₀,x₁](x - x₀) + f[x₀,x₁,x₂](x - x₀)(x - x₁) + ...\n\nf[xᵢ, xᵢ₊₁] = (f(xᵢ₊₁) - f(xᵢ)) / (xᵢ₊₁ - xᵢ)',
    formulaExplanation:
      'The coefficients of the polynomial are simply the top diagonal of the triangular divided difference matrix table.',
    derivationSteps: [
      '1. Write Pₙ(x) in nested Newton basis form: Pₙ(x) = a₀ + a₁(x-x₀) + a₂(x-x₀)(x-x₁) + ...',
      '2. Evaluating at x = x₀ immediately forces a₀ = y₀ = f[x₀] since every higher term contains (x₀ - x₀) = 0.',
      '3. Evaluating at x = x₁ gives y₁ = a₀ + a₁(x₁ - x₀), so a₁ = (y₁ - y₀)/(x₁ - x₀) = f[x₀, x₁].',
      '4. By induction, the k-th coefficient is the k-th divided difference: f[x₀,...,xₖ] = (f[x₁,...,xₖ] - f[x₀,...,xₖ₋₁]) / (xₖ - x₀).',
    ],
    conditions: [
      'x-coordinates must all be distinct (no two points can share the exact same x).',
      'n data points determine a unique polynomial of degree at most n - 1.',
    ],
    pitfalls: [
      'Runge Phenomenon: High-degree polynomials with uniformly spaced points can oscillate violently near interval edges.',
    ],
    workedExample: {
      problem: 'Find polynomial passing through (1, 1), (2, 4), and (4, 16). Estimate P(3).',
      stepByStep: [
        {
          step: 'Zeroth-order Differences',
          detail: 'f[x₀] = 1, f[x₁] = 4, f[x₂] = 16',
          math: 'f[1]=1, f[2]=4, f[4]=16',
        },
        {
          step: 'First-order Differences',
          detail: 'f[x₀, x₁] = (4 - 1)/(2 - 1) = 3\nf[x₁, x₂] = (16 - 4)/(4 - 2) = 12/2 = 6',
          math: 'f[x₀,x₁] = 3, f[x₁,x₂] = 6',
        },
        {
          step: 'Second-order Difference',
          detail: 'f[x₀, x₁, x₂] = (6 - 3)/(x₂ - x₀) = (6 - 3)/(4 - 1) = 3/3 = 1',
          math: 'f[x₀,x₁,x₂] = 1',
        },
        {
          step: 'Construct Polynomial & Evaluate P(3)',
          detail: 'P(x) = 1 + 3(x - 1) + 1(x - 1)(x - 2) = 1 + 3x - 3 + x² - 3x + 2 = x²\nAt target x* = 3: P(3) = 3² = 9.',
          math: 'P(3) = 9.000',
        },
      ],
      finalResult: 'Exact interpolating quadratic polynomial P(x) = x² determined.',
    },
    calculatorGuide: {
      targetMethod: 'newton-divided',
      prefill: {
        interpolationParams: {
          points: [
            { id: 'tut-nd-1', x: 1, y: 1 },
            { id: 'tut-nd-2', x: 2, y: 4 },
            { id: 'tut-nd-3', x: 4, y: 16 },
          ],
          targetX: 3,
        },
      },
      inputItems: [
        { field: 'Data Points', example: '(1,1), (2,4), (4,16)', note: 'Add coordinates using the point editor' },
        { field: 'Estimate Target (x*)', example: '3', note: 'Value at which to evaluate the interpolated curve' },
      ],
      usageSteps: [
        '1. Switch to Newton Divided Diff in Interpolation.',
        '2. Add coordinate points (x, y) with the point list editor.',
        '3. Enter your target estimation point x*.',
        '4. Tap "Calculate Interpolation".',
        '5. Open the "Diff Matrix" tab to inspect the triangular divided difference table!',
      ],
    },
  },
  {
    id: 'lagrange',
    solverId: 'lagrange',
    title: 'Lagrange Interpolation',
    category: 'Interpolation',
    orderBadge: 'Weighted Basis Polynomials',
    guarantee: 'Explicit Analytic Solution',
    accentColor: '#F59E0B',
    tagline: 'Weights each y-value with a cardinal basis polynomial Lᵢ(x)',
    beautyNarrative:
      'Published by Joseph-Louis Lagrange in 1795, this method is a triumph of symmetry and linear algebra. Instead of solving a system of equations, Lagrange asked a brilliant question: can we build a polynomial Lᵢ(x) that acts like a digital switch—turning ON (equal to 1) at node xᵢ and turning completely OFF (equal to 0) at every other node xⱼ? By multiplying factors of (x - xⱼ)/(xᵢ - xⱼ), each data point gets its own independent spotlight, and the final curve is simply their weighted sum.',
    intuition:
      'Lagrange interpolation constructs a polynomial without solving systems of linear equations or building difference tables. For each coordinate point (xᵢ, yᵢ), it creates a dedicated basis polynomial Lᵢ(x) that equals 1 at xᵢ and equals 0 at every other node. Multiplying each basis by yᵢ and adding them up produces a curve that effortlessly glides through all points.',
    realWorldApplications: [
      'Cryptography (Shamir\'s Secret Sharing): Splitting a secret key into n shares where any k shares reconstruct the secret via Lagrange interpolation!',
      'Finite Element Analysis (FEA): Defining shape functions across mesh elements in structural engineering.',
      'Digital Signal Processing & Quadrature: Deriving Newton-Cotes integration weights (Simpson\'s Rule, Trapezoidal Rule).',
    ],
    mathFormula: 'P(x) = Σ [ yᵢ · Lᵢ(x) ]\n\nLᵢ(x) = Π [ (x - xⱼ) / (xᵢ - xⱼ) ] for j ≠ i',
    formulaExplanation:
      'Notice that plugging in x = xᵢ yields (xᵢ - xⱼ)/(xᵢ - xⱼ) = 1, while plugging in any other node xₖ produces (xₖ - xₖ) = 0.',
    derivationSteps: [
      '1. To make Lᵢ(x) vanish at all nodes xⱼ (for j ≠ i), include the product of linear factors Π (x - xⱼ).',
      '2. To normalize Lᵢ(xᵢ) = 1 at its own node xᵢ, divide each factor by the constant (xᵢ - xⱼ).',
      '3. Thus Lᵢ(xₖ) = δᵢₖ (the Kronecker delta: 1 if i = k, and 0 if i ≠ k).',
      '4. Taking the linear combination P(x) = Σ yᵢ Lᵢ(x) guarantees P(xₖ) = Σ yᵢ δᵢₖ = yₖ for every node.',
    ],
    conditions: [
      'All x-coordinates must be distinct.',
    ],
    pitfalls: [
      'Computationally expensive to add points: adding one new data point requires recalculating all basis polynomials from scratch.',
    ],
    workedExample: {
      problem: 'Interpolate points (1, 2) and (3, 8). Estimate P(2).',
      stepByStep: [
        {
          step: 'Compute Basis L₀(x)',
          detail: 'L₀(x) = (x - 3)/(1 - 3) = -(x - 3)/2',
          math: 'L₀(x) = (3 - x)/2',
        },
        {
          step: 'Compute Basis L₁(x)',
          detail: 'L₁(x) = (x - 1)/(3 - 1) = (x - 1)/2',
          math: 'L₁(x) = (x - 1)/2',
        },
        {
          step: 'Combine Polynomial & Evaluate',
          detail: 'P(x) = 2 · L₀(x) + 8 · L₁(x) = (3 - x) + 4(x - 1) = 3x - 1\nAt x = 2: P(2) = 3(2) - 1 = 5.',
          math: 'P(2) = 5.000',
        },
      ],
      finalResult: 'Line P(x) = 3x - 1 cleanly interpolates (1,2) and (3,8).',
    },
    calculatorGuide: {
      targetMethod: 'lagrange',
      prefill: {
        interpolationParams: {
          points: [
            { id: 'tut-lag-1', x: 1, y: 2 },
            { id: 'tut-lag-2', x: 3, y: 8 },
          ],
          targetX: 2,
        },
      },
      inputItems: [
        { field: 'Point Table', example: '(1, 2), (3, 8)', note: 'Coordinate pairs' },
        { field: 'Estimation Target (x*)', example: '2', note: 'Query coordinate' },
      ],
      usageSteps: [
        '1. Select Lagrange Interpolation.',
        '2. Enter data point pairs.',
        '3. Enter x* and tap Calculate.',
        '4. View the resulting curve and switch to the "Basis Polynomials" tab to see individual Lᵢ(x) expressions.',
      ],
    },
  },
];
