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

export interface TutorialChapter {
  id: string;
  solverId?: SolverId;
  title: string;
  category: 'Root-Finding' | 'Interpolation' | 'Errors & Convergence';
  orderBadge: string;
  guarantee: string;
  accentColor: string;
  tagline: string;
  intuition: string;
  mathFormula: string;
  formulaExplanation: string;
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
    intuition:
      'Imagine guessing a secret number between 1 and 100. If someone tells you whether your guess is too high or too low, the best strategy is always guessing the exact middle (50). The Bisection Method does exactly this for mathematical functions: it tests the midpoint of an interval, checks whether the function crossed zero to the left or right, and discards the other half. It is slow but completely fail-safe.',
    mathFormula: 'cₙ = (aₙ + bₙ) / 2\n\nIf f(aₙ) · f(cₙ) < 0 ⇒ bₙ₊₁ = cₙ\nIf f(aₙ) · f(cₙ) > 0 ⇒ aₙ₊₁ = cₙ',
    formulaExplanation:
      'cₙ is the midpoint. If f(a) and f(c) have opposite signs (their product is negative), Bolzano\'s Theorem proves the root lies in [a, c]. Otherwise, it must lie in [c, b].',
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
        '5. The screen automatically switches to "Solution & Steps", displaying the step cards and visual graph with a blue dot on the root.',
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
    intuition:
      'Instead of cutting intervals in half, Newton-Raphson looks at the slope (derivative) of the curve at your current guess. It draws the tangent line and shoots straight down to where that line hits the x-axis. That x-intercept becomes your next, vastly improved estimate. When close to a simple root, the number of accurate decimal digits roughly doubles on every single iteration.',
    mathFormula: 'xₙ₊₁ = xₙ - f(xₙ) / f\'(xₙ)',
    formulaExplanation:
      'From the point-slope line equation y - f(xₙ) = f\'(xₙ)(x - xₙ), setting y = 0 and solving for x gives the x-intercept xₙ₊₁.',
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
          math: "xₙ₊₁ = 0.5 · (xₙ + 2/xₙ)",
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
    intuition:
      'Newton-Raphson is wonderful, but in the real world, computing exact analytical derivatives f\'(x) can be mathematically intractable or computationally expensive. The Secant Method solves this by approximating the derivative slope using the secant line between your two previous points (xₙ₋₁, xₙ). You get near-Newton speeds without ever taking a derivative.',
    mathFormula: 'xₙ₊₁ = xₙ - f(xₙ) · [ (xₙ - xₙ₋₁) / (f(xₙ) - f(xₙ₋₁)) ]',
    formulaExplanation:
      'The difference quotient (f(xₙ) - f(xₙ₋₁))/(xₙ - xₙ₋₁) acts as the finite-difference proxy for the tangent derivative f\'(xₙ).',
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
    intuition:
      'Any root problem f(x) = 0 can be rearranged algebraically into the form x = g(x). A point where x = g(x) is called a "fixed point". Geometrically, it is the intersection of y = g(x) with the 45-degree diagonal line y = x. Starting from x₀, you step up to g(x₀), bounce horizontally to y = x, and repeat. If |g\'(x)| < 1, the iteration behaves like a funnel (attractor) spiraling into the answer.',
    mathFormula: 'xₙ₊₁ = g(xₙ)\n\nConvergence criterion: |g\'(r)| < 1',
    formulaExplanation:
      'By the Banach Fixed-Point Theorem, successive iterations contract distance toward root r as long as the Lipschitz slope |g\'(x)| remains strictly under 1.',
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
    intuition:
      'Given a set of coordinate data points (x₀, y₀), (x₁, y₁), ..., how do you find the unique smooth polynomial that passes through all of them? Newton\'s Divided Difference builds this polynomial incrementally using a triangular table of average rates of change. If you later collect another data point, you do not have to restart: you simply add one more row to the bottom of the table.',
    mathFormula: 'P(x) = f[x₀] + f[x₀,x₁](x - x₀) + f[x₀,x₁,x₂](x - x₀)(x - x₁) + ...\n\nf[xᵢ, xᵢ₊₁] = (f(xᵢ₊₁) - f(xᵢ)) / (xᵢ₊₁ - xᵢ)',
    formulaExplanation:
      'The coefficients of the polynomial are simply the top diagonal of the triangular divided difference matrix table.',
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
    intuition:
      'Lagrange interpolation constructs a polynomial without solving systems of linear equations or building difference tables. For each coordinate point (xᵢ, yᵢ), it creates a dedicated basis polynomial Lᵢ(x) that equals 1 at xᵢ and equals 0 at every other node. Multiplying each basis by yᵢ and adding them up produces a curve that effortlessly glides through all points.',
    mathFormula: 'P(x) = Σ [ yᵢ · Lᵢ(x) ]\n\nLᵢ(x) = Π [ (x - xⱼ) / (xᵢ - xⱼ) ] for j ≠ i',
    formulaExplanation:
      'Notice that plugging in x = xᵢ yields (xᵢ - xⱼ)/(xᵢ - xⱼ) = 1, while plugging in any other node xₖ produces (xₖ - xₖ) = 0.',
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

