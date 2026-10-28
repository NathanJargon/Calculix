export type InterpolationMethodType = 'newton-divided' | 'lagrange';

export interface DataPoint {
  id: string;
  x: number;
  y: number;
}

export interface DividedDifferenceStep {
  order: number; // 0 for f[x_i], 1 for f[x_i, x_{i+1}], etc.
  values: number[]; // row values
}

export interface NewtonTermBreakdown {
  index: number;
  coefficient: number; // f[x_0, ..., x_k]
  factors: string; // e.g. "(x - 1)(x - 2)"
  evaluatedFactor: number; // (x* - 1)(x* - 2)
  termValue: number; // coefficient * evaluatedFactor
  cumulativeSum: number;
}

export interface LagrangeBasisTerm {
  index: number;
  xi: number;
  yi: number;
  basisFormula: string; // e.g. "(x - x1)(x - x2) / ((x0 - x1)(x0 - x2))"
  evaluatedBasisWeight: number; // L_i(x*)
  weightedValue: number; // y_i * L_i(x*)
  cumulativeSum: number;
}

export interface InterpolationInput {
  method: InterpolationMethodType;
  points: DataPoint[];
  targetX: number; // x*
}

export interface InterpolationResult {
  method: InterpolationMethodType;
  interpolatedY: number | null;
  targetX: number;
  points: DataPoint[];
  polynomialString: string;
  newtonTable?: {
    headers: string[];
    matrix: number[][]; // full divided difference table
    terms: NewtonTermBreakdown[];
  };
  lagrangeTerms?: LagrangeBasisTerm[];
  status: 'SUCCESS' | 'DUPLICATE_X' | 'INSUFFICIENT_POINTS' | 'ERROR';
  errorMessage?: string;
  executionTimeMs: number;
}
