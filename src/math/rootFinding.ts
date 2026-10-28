import {
  BisectionIteration,
  FixedPointIteration,
  NewtonIteration,
  RootFindingInput,
  RootFindingResult,
  RootIteration,
  SecantIteration,
} from '../types/rootFinding';
import {
  compileFunction,
  computeRelativeError,
} from './evaluator';

export function solveRoot(input: RootFindingInput): RootFindingResult {
  const startTime = Date.now();

  // Validate function compilation
  const { compiled: fComp, error: fErr } = compileFunction(input.functionStr);
  if (!fComp || fErr) {
    return {
      method: input.method,
      root: null,
      totalIterations: 0,
      status: 'PARSING_ERROR',
      statusMessage: fErr || 'Failed to parse function f(x)',
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: input.functionStr,
    };
  }

  const f = fComp.evaluate;

  switch (input.method) {
    case 'bisection':
      return runBisection(input, f, fComp.expression, startTime);
    case 'newton':
      return runNewton(input, f, fComp.evaluateDerivative, fComp.expression, fComp.derivativeExpr, startTime);
    case 'secant':
      return runSecant(input, f, fComp.expression, startTime);
    case 'fixed-point':
      return runFixedPoint(input, f, fComp.expression, startTime);
    default:
      return {
        method: input.method,
        root: null,
        totalIterations: 0,
        status: 'PARSING_ERROR',
        statusMessage: 'Unsupported root-finding method',
        iterations: [],
        executionTimeMs: Date.now() - startTime,
        parsedFunction: input.functionStr,
      };
  }
}

/**
 * 1. Bisection Method
 */
function runBisection(
  input: RootFindingInput,
  f: (x: number) => number,
  parsedFn: string,
  startTime: number
): RootFindingResult {
  const aInit = input.a ?? 0;
  const bInit = input.b ?? 1;
  const tol = input.tolerance > 0 ? input.tolerance : 1e-6;
  const maxIter = input.maxIterations > 0 ? input.maxIterations : 50;

  let fa: number;
  let fb: number;
  try {
    fa = f(aInit);
    fb = f(bInit);
  } catch (err: any) {
    return {
      method: 'bisection',
      root: null,
      totalIterations: 0,
      status: 'PARSING_ERROR',
      statusMessage: `Evaluation error at boundary: ${err.message}`,
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: parsedFn,
    };
  }

  if (Number.isNaN(fa) || Number.isNaN(fb) || !Number.isFinite(fa) || !Number.isFinite(fb)) {
    return {
      method: 'bisection',
      root: null,
      totalIterations: 0,
      status: 'PARSING_ERROR',
      statusMessage: 'Boundary evaluation produced non-finite or NaN value',
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: parsedFn,
    };
  }

  // Exact roots on boundary
  if (Math.abs(fa) < 1e-15) {
    return {
      method: 'bisection',
      root: aInit,
      totalIterations: 0,
      status: 'CONVERGED',
      statusMessage: `Exact root found at lower boundary a = ${aInit}`,
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: parsedFn,
    };
  }
  if (Math.abs(fb) < 1e-15) {
    return {
      method: 'bisection',
      root: bInit,
      totalIterations: 0,
      status: 'CONVERGED',
      statusMessage: `Exact root found at upper boundary b = ${bInit}`,
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: parsedFn,
    };
  }

  // Sign check: f(a) * f(b) must be negative
  if (fa * fb > 0) {
    return {
      method: 'bisection',
      root: null,
      totalIterations: 0,
      status: 'INVALID_BRACKET',
      statusMessage: `Intermediate Value Theorem violated: f(a)=${fa.toFixed(4)} and f(b)=${fb.toFixed(4)} have the same sign. [a, b] does not bracket an odd-multiplicity root.`,
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: parsedFn,
    };
  }

  let a = aInit;
  let b = bInit;
  let prevC: number | null = null;
  const iterations: BisectionIteration[] = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    const c = (a + b) / 2;
    let fc: number;
    try {
      fc = f(c);
    } catch (err: any) {
      return {
        method: 'bisection',
        root: c,
        totalIterations: iter,
        status: 'DIVERGED',
        statusMessage: `Evaluation error at midpoint c=${c}: ${err.message}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    const relErr = prevC !== null ? computeRelativeError(c, prevC) : 100;
    const absErr = Math.abs(b - a) / 2;

    const row: BisectionIteration = {
      iteration: iter,
      a,
      b,
      x_n: c,
      f_xn: fc,
      f_a: fa,
      f_b: fb,
      relError: relErr,
      absError: absErr,
    };
    iterations.push(row);

    // Convergence criteria: |f(c)| < tol or interval width < tol or relErr < tol%
    if (Math.abs(fc) < tol || (prevC !== null && relErr < tol * 100) || absErr < tol) {
      return {
        method: 'bisection',
        root: c,
        totalIterations: iter,
        status: 'CONVERGED',
        statusMessage: `Converged to tolerance ${tol} in ${iter} iteration${iter > 1 ? 's' : ''}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    // Bracket narrowing
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }

    prevC = c;
  }

  return {
    method: 'bisection',
    root: (a + b) / 2,
    totalIterations: maxIter,
    status: 'MAX_ITERATIONS_REACHED',
    statusMessage: `Reached maximum limit of ${maxIter} iterations without reaching tolerance ${tol}`,
    iterations,
    executionTimeMs: Date.now() - startTime,
    parsedFunction: parsedFn,
  };
}

/**
 * 2. Newton-Raphson Method
 */
function runNewton(
  input: RootFindingInput,
  f: (x: number) => number,
  df: ((x: number) => number) | undefined,
  parsedFn: string,
  parsedDeriv: string | undefined,
  startTime: number
): RootFindingResult {
  let x = input.x0 ?? 0;
  const tol = input.tolerance > 0 ? input.tolerance : 1e-6;
  const maxIter = input.maxIterations > 0 ? input.maxIterations : 50;

  const iterations: NewtonIteration[] = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    let fx: number;
    let dfx: number;

    try {
      fx = f(x);
      dfx = df ? df(x) : 0;
    } catch (err: any) {
      return {
        method: 'newton',
        root: x,
        totalIterations: iter - 1,
        status: 'DIVERGED',
        statusMessage: `Evaluation error at x=${x}: ${err.message}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
        parsedDerivative: parsedDeriv,
      };
    }

    if (Math.abs(dfx) < 1e-14 || Number.isNaN(dfx)) {
      return {
        method: 'newton',
        root: x,
        totalIterations: iter - 1,
        status: 'DERIVATIVE_ZERO',
        statusMessage: `Zero derivative f'(${x}) = ${dfx}. Newton step produces division by zero (horizontal tangent).`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
        parsedDerivative: parsedDeriv,
      };
    }

    const xNext = x - fx / dfx;
    const relErr = computeRelativeError(xNext, x);
    const absErr = Math.abs(xNext - x);

    const row: NewtonIteration = {
      iteration: iter,
      x_n: x,
      f_xn: fx,
      f_prime_xn: dfx,
      x_next: xNext,
      relError: relErr,
      absError: absErr,
    };
    iterations.push(row);

    if (!Number.isFinite(xNext) || Number.isNaN(xNext) || Math.abs(xNext) > 1e15) {
      return {
        method: 'newton',
        root: null,
        totalIterations: iter,
        status: 'DIVERGED',
        statusMessage: 'Sequence diverged: x_{n+1} exceeded computational limits',
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
        parsedDerivative: parsedDeriv,
      };
    }

    // Check convergence
    if (Math.abs(fx) < tol || relErr < tol * 100 || absErr < tol) {
      return {
        method: 'newton',
        root: xNext,
        totalIterations: iter,
        status: 'CONVERGED',
        statusMessage: `Converged to tolerance ${tol} in ${iter} iteration${iter > 1 ? 's' : ''}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
        parsedDerivative: parsedDeriv,
      };
    }

    x = xNext;
  }

  return {
    method: 'newton',
    root: x,
    totalIterations: maxIter,
    status: 'MAX_ITERATIONS_REACHED',
    statusMessage: `Maximum iterations (${maxIter}) reached without full convergence to ${tol}`,
    iterations,
    executionTimeMs: Date.now() - startTime,
    parsedFunction: parsedFn,
    parsedDerivative: parsedDeriv,
  };
}

/**
 * 3. Secant Method
 */
function runSecant(
  input: RootFindingInput,
  f: (x: number) => number,
  parsedFn: string,
  startTime: number
): RootFindingResult {
  let xPrev = input.x0 ?? 0;
  let xCurr = input.x1 ?? 1;
  const tol = input.tolerance > 0 ? input.tolerance : 1e-6;
  const maxIter = input.maxIterations > 0 ? input.maxIterations : 50;

  if (Math.abs(xCurr - xPrev) < 1e-15) {
    return {
      method: 'secant',
      root: null,
      totalIterations: 0,
      status: 'DIVISION_BY_ZERO',
      statusMessage: 'Initial guesses x0 and x1 must be distinct (x0 ≠ x1)',
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: parsedFn,
    };
  }

  const iterations: SecantIteration[] = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    let fPrev: number;
    let fCurr: number;

    try {
      fPrev = f(xPrev);
      fCurr = f(xCurr);
    } catch (err: any) {
      return {
        method: 'secant',
        root: xCurr,
        totalIterations: iter - 1,
        status: 'DIVERGED',
        statusMessage: `Evaluation error: ${err.message}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    const deltaF = fCurr - fPrev;
    if (Math.abs(deltaF) < 1e-15) {
      return {
        method: 'secant',
        root: xCurr,
        totalIterations: iter - 1,
        status: 'DIVISION_BY_ZERO',
        statusMessage: `Zero slope denominator: f(x_n) - f(x_{n-1}) = ${deltaF}. Cannot compute next secant line.`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    const xNext = xCurr - fCurr * ((xCurr - xPrev) / deltaF);
    const relErr = computeRelativeError(xNext, xCurr);
    const absErr = Math.abs(xNext - xCurr);

    const row: SecantIteration = {
      iteration: iter,
      x_prev: xPrev,
      x_n: xCurr,
      f_prev: fPrev,
      f_xn: fCurr,
      x_next: xNext,
      relError: relErr,
      absError: absErr,
    };
    iterations.push(row);

    if (!Number.isFinite(xNext) || Number.isNaN(xNext) || Math.abs(xNext) > 1e15) {
      return {
        method: 'secant',
        root: null,
        totalIterations: iter,
        status: 'DIVERGED',
        statusMessage: 'Secant iteration diverged to infinity or NaN',
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    if (Math.abs(fCurr) < tol || relErr < tol * 100 || absErr < tol) {
      return {
        method: 'secant',
        root: xNext,
        totalIterations: iter,
        status: 'CONVERGED',
        statusMessage: `Converged to tolerance ${tol} in ${iter} iteration${iter > 1 ? 's' : ''}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    xPrev = xCurr;
    xCurr = xNext;
  }

  return {
    method: 'secant',
    root: xCurr,
    totalIterations: maxIter,
    status: 'MAX_ITERATIONS_REACHED',
    statusMessage: `Maximum iterations (${maxIter}) reached without converging to tolerance ${tol}`,
    iterations,
    executionTimeMs: Date.now() - startTime,
    parsedFunction: parsedFn,
  };
}

/**
 * 4. Fixed-Point Iteration Method
 * Solves x = g(x)
 */
function runFixedPoint(
  input: RootFindingInput,
  f: (x: number) => number,
  parsedFn: string,
  startTime: number
): RootFindingResult {
  let x = input.x0 ?? 0;
  const tol = input.tolerance > 0 ? input.tolerance : 1e-6;
  const maxIter = input.maxIterations > 0 ? input.maxIterations : 50;

  // Use g(x) if provided, otherwise default to x - f(x)
  const gStr = input.gFunctionStr?.trim() || `${x} - (${input.functionStr})`;
  const { compiled: gComp, error: gErr } = compileFunction(gStr);

  if (!gComp || gErr) {
    return {
      method: 'fixed-point',
      root: null,
      totalIterations: 0,
      status: 'PARSING_ERROR',
      statusMessage: `Invalid iteration function g(x): ${gErr}`,
      iterations: [],
      executionTimeMs: Date.now() - startTime,
      parsedFunction: `g(x) = ${gStr}`,
    };
  }

  const g = gComp.evaluate;
  const iterations: FixedPointIteration[] = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    let gx: number;
    let fx: number;

    try {
      gx = g(x);
      fx = f(x);
    } catch (err: any) {
      return {
        method: 'fixed-point',
        root: x,
        totalIterations: iter - 1,
        status: 'DIVERGED',
        statusMessage: `Evaluation error at x=${x}: ${err.message}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    if (!Number.isFinite(gx) || Number.isNaN(gx) || Math.abs(gx) > 1e14) {
      return {
        method: 'fixed-point',
        root: null,
        totalIterations: iter,
        status: 'DIVERGED',
        statusMessage: `Iteration diverged: |g'(x)| > 1 causing exponential blowup (|x| > 10^14)`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    const relErr = computeRelativeError(gx, x);
    const absErr = Math.abs(gx - x);

    const row: FixedPointIteration = {
      iteration: iter,
      x_n: x,
      g_xn: gx,
      f_xn: fx,
      relError: relErr,
      absError: absErr,
    };
    iterations.push(row);

    if (relErr < tol * 100 || absErr < tol || Math.abs(fx) < tol) {
      return {
        method: 'fixed-point',
        root: gx,
        totalIterations: iter,
        status: 'CONVERGED',
        statusMessage: `Converged to fixed point in ${iter} iteration${iter > 1 ? 's' : ''}`,
        iterations,
        executionTimeMs: Date.now() - startTime,
        parsedFunction: parsedFn,
      };
    }

    x = gx;
  }

  return {
    method: 'fixed-point',
    root: x,
    totalIterations: maxIter,
    status: 'MAX_ITERATIONS_REACHED',
    statusMessage: `Maximum iterations (${maxIter}) reached. Check if |g'(x)| < 1 near root for convergence.`,
    iterations,
    executionTimeMs: Date.now() - startTime,
    parsedFunction: parsedFn,
  };
}
