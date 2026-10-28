export type RootMethodType = 'bisection' | 'newton' | 'secant' | 'fixed-point';

export type ConvergenceStatus =
  | 'CONVERGED'
  | 'MAX_ITERATIONS_REACHED'
  | 'DIVERGED'
  | 'INVALID_BRACKET'
  | 'DERIVATIVE_ZERO'
  | 'DIVISION_BY_ZERO'
  | 'PARSING_ERROR';

export interface BisectionIteration {
  iteration: number;
  a: number;
  b: number;
  x_n: number; // midpoint c
  f_xn: number;
  f_a: number;
  f_b: number;
  relError: number; // in %
  absError: number;
}

export interface NewtonIteration {
  iteration: number;
  x_n: number;
  f_xn: number;
  f_prime_xn: number;
  x_next: number;
  relError: number; // in %
  absError: number;
}

export interface SecantIteration {
  iteration: number;
  x_prev: number; // x_{n-1}
  x_n: number;    // x_n
  f_prev: number; // f(x_{n-1})
  f_xn: number;   // f(x_n)
  x_next: number; // x_{n+1}
  relError: number; // in %
  absError: number;
}

export interface FixedPointIteration {
  iteration: number;
  x_n: number;
  g_xn: number; // x_{n+1}
  f_xn: number;
  relError: number; // in %
  absError: number;
}

export type RootIteration =
  | BisectionIteration
  | NewtonIteration
  | SecantIteration
  | FixedPointIteration;

export interface RootFindingInput {
  method: RootMethodType;
  functionStr: string; // f(x)
  gFunctionStr?: string; // for fixed point: g(x) such that x = g(x)
  a?: number; // lower bound for bisection
  b?: number; // upper bound for bisection
  x0?: number; // initial guess for newton, secant, fixed-point
  x1?: number; // second guess for secant
  tolerance: number; // e.g. 1e-6
  maxIterations: number; // e.g. 100
}

export interface RootFindingResult {
  method: RootMethodType;
  root: number | null;
  totalIterations: number;
  status: ConvergenceStatus;
  statusMessage: string;
  iterations: RootIteration[];
  executionTimeMs: number;
  parsedFunction: string;
  parsedDerivative?: string;
}
