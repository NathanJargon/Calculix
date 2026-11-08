# Calculix — Modern Numerical Analysis & Function Plotting ⚡

<div align="center">

![Calculix UI Preview](./assets/screenshots/calculix_ui_preview.jpg)

**A high-precision, beautifully designed numerical analysis and curve plotting mobile toolkit.**  
Built with **bare React Native CLI (TypeScript)**, featuring interactive SVG function plotting, natural-language solution walkthroughs, persistent onboarding, and a clean pastel/obsidian design system.

[![Version](https://img.shields.io/badge/Release-v1.0.1%20(v2)-success)](https://github.com/your-username/calculix/releases)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.88.1-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Jest](https://img.shields.io/badge/Tests-14%20Passing-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Highlights & Latest Features

- 🎨 **Modern Minimalist & Pastel UI**: Designed with a clean, distraction-free aesthetic inspired by contemporary educational apps. Rounded cards, soft pastel topic tiles, custom pill filters, and uncluttered navigation.
- 📱 **Persistent Onboarding Walkthrough**: An engaging welcome flow introducing core capabilities with an illustrated mascot guide. Persisted via `@react-native-async-storage/async-storage` so it appears once on first launch and never interrupts you again (with an instant replay option in Settings).
- 🧩 **2×2 Category Hub ("Themes")**: Organized category dashboard featuring 4 distinct topic cards:
  - **Root Finding**: Non-linear equation solvers ($f(x) = 0$).
  - **Polynomial Interpolation**: Curve-fitting through discrete coordinate sets.
  - **Matrix & Linear Systems**: Linear algebra & matrix operations *(Coming Soon)*.
  - **Calculus & Series**: Numerical integration & Taylor series expansions *(Coming Soon)*.
- 🎯 **Dedicated Single-Purpose Solver Screens**: Dedicated screens for every algorithm (Bisection, Newton-Raphson, Secant, Fixed-Point, Divided Differences, Lagrange) to keep user focus razor-sharp.
- 📈 **Interactive SVG Function & Curve Plotting**:
  - **`FunctionPlotter`**: Evaluates continuous functions using `mathjs` over dynamic intervals, rendering axes, grid markers, function curves, root highlights, and bracketing bounds via `react-native-svg`.
  - **`InterpolationPlotter`**: Renders data nodes as highlighted coordinate markers and draws the evaluated polynomial curve smoothly through all points.
- 💬 **Natural-Language Step-by-Step Walkthroughs**: Conversational explanation cards explaining *why* each step happens ("Step 1: Check interval signs", "Step 2: Calculate midpoint", "Step 3: Convergence reached").
- ⌨️ **Built-in Quick Math Keypad**: Custom math keyboard with standard operators, powers, parentheses, and variable keys ($x$, $e$, $\pi$) that won't block bottom navigation or native system gestures.
- 🌗 **Light / Dark Theme Support**: Context-driven dynamic theming (`ThemeContext`) with seamless toggle in Settings.

---

## 🚀 Numerical Engines

### 1. Root-Finding Engine
Solves continuous scalar non-linear equations $f(x) = 0$ with configurable tolerance ($\epsilon$) and maximum iteration limits:

- **Bisection Method ($\mathcal{O}(1)$ Linear Rate)**:
  - Robust bracketing method using the Intermediate Value Theorem.
  - Guarantees convergence on $[a, b]$ when $f(a) \cdot f(b) < 0$.
  - Outputs interval bounds $[a, b]$, midpoint $c_n$, $f(c_n)$, relative percentage error, and interval width.
- **Newton-Raphson Method ($\mathcal{O}(2)$ Quadratic Rate)**:
  - Open tangent-line iteration using analytical symbolic derivatives via `mathjs` (with automatic fallback to 4th-order central difference).
  - Defensive singular derivative detection ($|f'(x)| \approx 0$).
  - Outputs $x_n$, $f(x_n)$, $f'(x_n)$, $x_{n+1}$, and relative error.
- **Secant Method ($\mathcal{O}(1.618)$ Superlinear Rate)**:
  - Finite-difference quasi-Newton method eliminating derivative evaluations.
  - Defensive zero-slope denominator handling ($f(x_n) - f(x_{n-1}) = 0$).
  - Outputs $x_{n-1}$, $x_n$, $f(x_n)$, $x_{n+1}$, and relative error.
- **Fixed-Point Iteration (Contraction Mapping)**:
  - Iterates $x_{n+1} = g(x_n)$ derived from $f(x) = 0$.
  - Evaluates local convergence according to the Banach fixed-point theorem.
  - Outputs $x_n$, $g(x_n)$, $f(x_n)$, and relative error.

---

### 2. Interpolation Engine
Constructs and evaluates polynomial curves from arbitrary discrete coordinate datasets:

- **Newton's Divided Difference Interpolation**:
  - Full divided difference pyramid matrix calculation ($f[x_0], f[x_0, x_1], \dots, f[x_0, \dots, x_n]$).
  - Evaluates polynomial $P(x^*)$ at any target $x^*$.
  - Displays full divided difference pyramid table and step-by-step term breakdown (coefficients, factor products, and cumulative sums).
  - Generates human-readable algebraic polynomial strings.
- **Lagrange Interpolation**:
  - Constructs cardinal basis polynomials $L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}$.
  - Computes evaluated basis weights $L_i(x^*)$ and weighted contributions $y_i \cdot L_i(x^*)$.
  - Displays individual algebraic basis formulas and the composite polynomial.

---

## 📂 Project Architecture

```
Calculix/
├── App.tsx                               # App entry point (SafeAreaProvider & ThemeProvider)
├── index.js                              # React Native AppRegistry
├── package.json                          # Bare React Native CLI dependencies
├── tsconfig.json                         # Strict TypeScript configuration
├── jest.config.js                        # Jest configuration (AsyncStorage & SVG transforms)
├── assets/
│   └── screenshots/                      # Preview assets & UI screenshots
│       └── calculix_ui_preview.jpg       # App preview illustration
├── __tests__/                            # Comprehensive unit test suites (14 tests)
│   ├── rootFinding.test.ts               # Bisection, Newton, Secant, Fixed-Point tests
│   ├── interpolation.test.ts             # Newton Divided Diff & Lagrange tests
│   └── App.test.tsx                      # App root render test
└── src/
    ├── math/                             # Pure mathematical algorithms (zero UI dependencies)
    │   ├── evaluator.ts                  # Symbolic parsing, derivative engine, formatters
    │   ├── rootFinding.ts                # Pure root-finding numerical algorithms
    │   └── interpolation.ts              # Divided difference & Lagrange basis solvers
    ├── types/                            # Strict TypeScript interface contracts
    │   ├── rootFinding.ts                # Iteration tables, input params, convergence status
    │   └── interpolation.ts              # Coordinate points, table rows, basis evaluations
    ├── theme/                            # Theme system & color definitions
    │   ├── colors.ts                     # Light & Dark color palettes
    │   ├── ThemeContext.tsx              # Dynamic theme provider with persistent switch
    │   └── typography.ts                 # Font sizes, line heights, font weights
    ├── navigation/
    │   └── RootNavigator.tsx             # Stack & bottom tab navigator with intro gating
    ├── components/
    │   ├── common/                       # Reusable visual components
    │   │   ├── FunctionPlotter.tsx       # SVG function curve plotter with root marker
    │   │   ├── InterpolationPlotter.tsx  # SVG polynomial curve plotter with data nodes
    │   │   ├── StepExplanationCards.tsx  # Natural language step walkthrough cards
    │   │   ├── MathKeypad.tsx            # Floating math keypad
    │   │   ├── HeaderBar.tsx             # Clean top navigation header
    │   │   ├── TechButton.tsx            # Rounded action buttons
    │   │   ├── TechInput.tsx             # Parameter input fields with prefix badges
    │   │   ├── StatusBadge.tsx           # Convergence status indicators
    │   │   ├── MetricCard.tsx            # Stat & precision diagnostic cards
    │   │   ├── TabSelector.tsx           # Segmented pill switches
    │   │   └── CodeBlock.tsx             # Monospace syntax formula viewer
    │   ├── rootFinding/                  # Root-finding UI components
    │   │   ├── RootInputForm.tsx         # Algorithm parameter forms + presets
    │   │   ├── RootResults.tsx           # Solution summary card
    │   │   └── IterationTable.tsx        # Horizontally scrollable convergence matrix
    │   └── interpolation/                # Interpolation UI components
    │       ├── PointListEditor.tsx       # Dynamic (x, y) coordinate pair editor
    │       ├── InterpolationResults.tsx  # Evaluated y* result & polynomial string
    │       ├── DividedDiffTable.tsx      # Divided difference table visualizer
    │       └── LagrangeBasisTable.tsx    # Lagrange basis weights & formulas
    └── screens/
        ├── HomeScreen.tsx                # Explore Hub with 2x2 Category Grid & quick chips
        ├── DedicatedSolverScreen.tsx     # Single-purpose root solver screen with plot & steps
        ├── DedicatedInterpolationScreen.tsx # Dedicated interpolation screen with curve plot
        ├── RootFindingScreen.tsx         # Multi-tab root-finding workspace
        ├── InterpolationScreen.tsx       # Multi-tab interpolation workspace
        ├── SettingsScreen.tsx            # Dark/Light theme toggle & onboarding reset
        ├── TheoryGuideModal.tsx          # Numerical methods theory & formula guide
        └── intro/
            └── IntroScreen.tsx           # 3-step illustrated onboarding carousel
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** >= 20.x
- **npm** or **yarn**
- **Android Studio** (Android SDK, Build-Tools 35.0.0, NDK 27.1+)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/calculix.git
cd calculix

# Install dependencies
npm install
```

### Running Locally

#### Android
```bash
# Start Metro Bundler
npm start

# In a separate terminal, run on Android device/emulator
npm run android
```

#### iOS (macOS only)
```bash
cd ios && pod install && cd ..
npm run ios
```

---

## 🧪 Running Unit Tests

Calculix includes a comprehensive unit testing suite covering convergence properties, quadratic acceleration, bracketing bounds, matrix correctness, and UI rendering:

```bash
npm test
```

```text
PASS __tests__/interpolation.test.ts
PASS __tests__/rootFinding.test.ts
PASS __tests__/App.test.tsx

Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        ~23s
Ran all test suites.
```

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.
