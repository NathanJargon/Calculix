import { compile, derivative, parse } from 'mathjs';

export interface EvaluatorCompiled {
  evaluate: (x: number) => number;
  expression: string;
  derivativeExpr?: string;
  evaluateDerivative?: (x: number) => number;
}

/**
 * Safely parses and compiles a mathematical expression string f(x).
 * Supports standard algebraic and transcendental functions:
 * sin, cos, tan, exp, log, sqrt, abs, ^, etc.
 */
export function compileFunction(exprStr: string): {
  compiled?: EvaluatorCompiled;
  error?: string;
} {
  const sanitized = exprStr.trim();
  if (!sanitized) {
    return { error: 'Function string cannot be empty' };
  }

  try {
    // Test parsing
    const parsed = parse(sanitized);
    const compiled = parsed.compile();

    // Verify evaluation at a safe point (e.g. x = 1)
    const testVal = compiled.evaluate({ x: 1, e: Math.E, pi: Math.PI });
    if (typeof testVal !== 'number' && typeof testVal !== 'bigint') {
      // Check if it returned a complex number
      if (typeof testVal === 'object' && testVal !== null && 're' in testVal) {
        // complex is ok if real value is evaluated during run
      } else {
        return { error: 'Expression must evaluate to a real scalar value' };
      }
    }

    // Try computing analytical derivative
    let derivativeExpr: string | undefined;
    let evaluateDerivative: ((x: number) => number) | undefined;

    try {
      const dParsed = derivative(parsed, 'x');
      derivativeExpr = dParsed.toString();
      const dCompiled = dParsed.compile();
      evaluateDerivative = (x: number) => {
        try {
          const res = dCompiled.evaluate({ x, e: Math.E, pi: Math.PI });
          return extractRealNumber(res);
        } catch {
          // Fallback to central difference
          return numericalDerivative((val) => extractRealNumber(compiled.evaluate({ x: val, e: Math.E, pi: Math.PI })), x);
        }
      };
    } catch {
      // If symbolic derivative fails, fallback to high-accuracy central difference
      derivativeExpr = "d/dx [numerical approx]";
      evaluateDerivative = (x: number) => {
        return numericalDerivative((val) => extractRealNumber(compiled.evaluate({ x: val, e: Math.E, pi: Math.PI })), x);
      };
    }

    const safeEvaluate = (x: number): number => {
      const res = compiled.evaluate({ x, e: Math.E, pi: Math.PI });
      return extractRealNumber(res);
    };

    return {
      compiled: {
        evaluate: safeEvaluate,
        expression: sanitized,
        derivativeExpr,
        evaluateDerivative,
      },
    };
  } catch (err: any) {
    return {
      error: err.message || 'Syntax error in mathematical expression',
    };
  }
}

/**
 * Extracts a real number from mathjs result (handling complex numbers if imaginary is negligible).
 */
export function extractRealNumber(val: any): number {
  if (typeof val === 'number') {
    return val;
  }
  if (typeof val === 'bigint') {
    return Number(val);
  }
  if (val && typeof val === 'object' && 're' in val) {
    if (Math.abs(val.im || 0) < 1e-10) {
      return val.re;
    }
    throw new Error('Expression produced a complex number');
  }
  return Number(val);
}

/**
 * 4th order central difference numerical derivative:
 * f'(x) ≈ (-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)) / (12h)
 */
export function numericalDerivative(fn: (x: number) => number, x: number): number {
  const h = Math.max(1e-6, Math.abs(x) * 1e-6);
  const f_p2 = fn(x + 2 * h);
  const f_p1 = fn(x + h);
  const f_m1 = fn(x - h);
  const f_m2 = fn(x - 2 * h);
  return (-f_p2 + 8 * f_p1 - 8 * f_m1 + f_m2) / (12 * h);
}

/**
 * Clean scientific/fixed formatting for numbers in developer UI
 */
export function formatFloat(val: number | null | undefined, precision = 6): string {
  if (val === null || val === undefined || Number.isNaN(val)) {
    return 'NaN';
  }
  if (!Number.isFinite(val)) {
    return val > 0 ? '+Infinity' : '-Infinity';
  }
  if (Math.abs(val) === 0) {
    return '0';
  }

  const absVal = Math.abs(val);
  if (absVal < 1e-4 || absVal >= 1e7) {
    return val.toExponential(precision);
  }

  // Trim trailing zeros for neat display
  const fixed = val.toFixed(precision);
  return fixed.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

/**
 * Computes relative percentage error: |(x_new - x_old) / x_new| * 100
 */
export function computeRelativeError(current: number, previous: number): number {
  if (Math.abs(current) < 1e-15) {
    return Math.abs(current - previous);
  }
  return Math.abs((current - previous) / current) * 100;
}
