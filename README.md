# Numex — Numerical Analysis Toolkit ⚡

**Numex** is a high-performance, developer-grade mobile numerical analysis toolkit built with **bare React Native CLI (TypeScript)** without Expo dependencies. Inspired by modern developer-tool and IDE aesthetics, Numex provides precision root-finding and polynomial interpolation engines with detailed step-by-step mathematical diagnostics.

---

## 🚀 Key Modules

### 1. Root-Finding Engine
Solves continuous scalar non-linear equations $f(x) = 0$ using 4 classical numerical algorithms:

- **Bisection Method ($\mathcal{O}(1)$ Linear)**:
  - Robust bracketing method using the Intermediate Value Theorem.
  - Guarantees convergence on $[a, b]$ when $f(a) \cdot f(b) < 0$.
  - Outputs bracket interval $[a, b]$, midpoint $c_n$, $f(c_n)$, relative percentage error, and interval width.
- **Newton-Raphson Method ($\mathcal{O}(2)$ Quadratic Rate)**:
  - Open tangent-line iteration using analytical symbolic derivatives via `mathjs` (with automatic fallback to 4th-order central difference).
  - Defensive singular derivative detection ($|f'(x)| \approx 0$).
  - Outputs $x_n$, $f(x_n)$, $f'(x_n)$, $x_{n+1}$, and relative error.
- **Secant Method ($\mathcal{O}(1.618)$ Superlinear Rate)**:
  - Finite-difference quasi-Newton method eliminating the need for derivative evaluations.
  - Defensive zero-slope denominator handling ($f(x_n) - f(x_{n-1}) = 0$).
  - Outputs $x_{n-1}$, $x_n$, $f(x_n)$, $x_{n+1}$, and relative error.
- **Fixed-Point Iteration (Contraction Mapping)**:
  - Iterates $x_{n+1} = g(x_n)$ derived from $f(x) = 0$.
  - Verifies local convergence according to the Banach fixed-point theorem.
  - Outputs $x_n$, $g(x_n)$, $f(x_n)$, and relative error.

### 2. Interpolation Engine
Generates and evaluates high-precision polynomial curves from discrete coordinate datasets:

- **Newton's Divided Difference Interpolation**:
  - Full 2D divided difference pyramid/matrix calculation ($f[x_0], f[x_0, x_1], \dots$).
  - Evaluates polynomial $P(x^*)$ at any arbitrary target $x^*$.
  - Displays full divided difference table and step-by-step term breakdown (coefficients, factor products, and cumulative sums).
  - Formats clean algebraic polynomial representation string $P(x)$.
- **Lagrange Interpolation**:
  - Constructs cardinal basis polynomials $L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}$.
  - Computes evaluated basis weights $L_i(x^*)$ and weighted contributions $y_i \cdot L_i(x^*)$.
  - Displays individual algebraic basis formulas and the full polynomial expression.

---

## 🎨 Design Philosophy

- **Dark-Mode-First / Developer Aesthetics**: Built with an Obsidian/Slate carbon color palette (`#0B0F17`, `#131B26`, `#243042`).
- **Precision Typography**: Monospace numbers and variables (`Menlo` / `monospace`) with clean label badges and hair-line border dividers.
- **Status Telemetry**: Real-time convergence status chips (`CONVERGED`, `MAX_ITERATIONS`, `INVALID_BRACKET`, `DERIVATIVE_ZERO`, `DUPLICATE_X`).
- **Zero Placeholder Bloat**: Fully interactive with built-in engineering presets (Kepler equations, thermodynamics steam tables, kinematic trajectories, transcendental functions).

---

## 📂 Project Architecture

```
Calculix/
├── App.tsx                     # App entry point (SafeAreaProvider & StatusBar)
├── index.js                    # React Native AppRegistry
├── package.json                # Bare React Native CLI dependencies
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Unit testing configuration
├── .gitignore                  # Production Git ignore rules
├── __tests__/                  # Unit test suites
│   ├── rootFinding.test.ts     # Bisection, Newton, Secant, Fixed-Point tests
│   ├── interpolation.test.ts   # Newton Divided Diff & Lagrange tests
│   └── App.test.tsx            # App render test
└── src/
    ├── math/                   # Pure mathematical algorithms (no UI dependencies)
    │   ├── evaluator.ts        # Math parser, symbolic/numerical derivatives, formatters
    │   ├── rootFinding.ts      # Pure numerical root-finding solvers
    │   └── interpolation.ts    # Divided difference & Lagrange basis solvers
    ├── types/                  # Strict TypeScript definitions
    │   ├── rootFinding.ts      # Iteration rows, input contracts, results
    │   └── interpolation.ts    # Coordinate pairs, matrix, basis terms
    ├── theme/                  # Design tokens
    │   ├── colors.ts           # Obsidian/slate/emerald developer palette
    │   └── typography.ts       # Monospace & sans typography scale
    ├── components/
    │   ├── common/             # Reusable UI components
    │   │   ├── HeaderBar.tsx   # Top telemetry bar with engine status & info modal trigger
    │   │   ├── TechButton.tsx  # Developer button primitives
    │   │   ├── TechInput.tsx   # Monospace inputs with prefixes & validation
    │   │   ├── StatusBadge.tsx # Convergence chips with glowing indicators
    │   │   ├── MetricCard.tsx  # Precision stat boxes
    │   │   ├── TabSelector.tsx # Segmented algorithm switchers
    │   │   └── CodeBlock.tsx   # Syntax formula & polynomial viewer with copy
    │   ├── rootFinding/        # Root-finding components
    │   │   ├── RootInputForm.tsx    # Dynamic parameter form + presets
    │   │   ├── RootResults.tsx      # Numerical root summary card
    │   │   └── IterationTable.tsx   # Horizontally scrollable step-by-step matrix
    │   └── interpolation/      # Interpolation components
    │       ├── PointListEditor.tsx      # Dynamic coordinate pairs editor
    │       ├── InterpolationResults.tsx # Evaluated y* and polynomial string
    │       ├── DividedDiffTable.tsx     # Full divided difference matrix
    │       └── LagrangeBasisTable.tsx   # Lagrange basis weights & formulas
    ├── screens/
    │   ├── RootFindingScreen.tsx    # Root-Finding workspace
    │   ├── InterpolationScreen.tsx  # Interpolation workspace
    │   └── TheoryGuideModal.tsx     # Numerical methods reference modal
    └── navigation/
        └── RootNavigator.tsx        # Bottom tab navigation
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 22.11.0
- npm or yarn
- Android Studio / Xcode configured for bare React Native CLI

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/numex.git
cd numex

# Install dependencies
npm install
```

### Running Locally

#### Android
```bash
# Launch Metro bundler
npm start

# In a separate terminal, launch Android
npm run android
```

#### iOS
```bash
cd ios && pod install && cd ..
npm run ios
```

### Running Tests
Execute the comprehensive test suite verifying all 4 root-finding methods and both interpolation algorithms:
```bash
npm test
```

---

## 📜 License
MIT License. Built for precision numerical analysis.
