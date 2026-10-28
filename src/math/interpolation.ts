import {
  DataPoint,
  InterpolationInput,
  InterpolationResult,
  LagrangeBasisTerm,
  NewtonTermBreakdown,
} from '../types/interpolation';
import { formatFloat } from './evaluator';

export function solveInterpolation(input: InterpolationInput): InterpolationResult {
  const startTime = Date.now();
  const { points, targetX, method } = input;

  // Validation
  if (!points || points.length < 2) {
    return {
      method,
      interpolatedY: null,
      targetX,
      points: points || [],
      polynomialString: '',
      status: 'INSUFFICIENT_POINTS',
      errorMessage: 'At least 2 distinct data points are required for interpolation.',
      executionTimeMs: Date.now() - startTime,
    };
  }

  // Check for duplicate X values
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (Math.abs(points[i].x - points[j].x) < 1e-12) {
        return {
          method,
          interpolatedY: null,
          targetX,
          points,
          polynomialString: '',
          status: 'DUPLICATE_X',
          errorMessage: `Duplicate x-coordinates detected at indices ${i + 1} and ${j + 1} (x = ${points[i].x}). Interpolation requires distinct abscissas.`,
          executionTimeMs: Date.now() - startTime,
        };
      }
    }
  }

  if (method === 'newton-divided') {
    return runNewtonDivided(points, targetX, startTime);
  } else {
    return runLagrange(points, targetX, startTime);
  }
}

/**
 * Newton's Divided Difference Method
 */
function runNewtonDivided(
  points: DataPoint[],
  targetX: number,
  startTime: number
): InterpolationResult {
  const n = points.length;

  // Create table matrix of size n x n
  // Column 0 = y_i, Column 1 = 1st divided diff, etc.
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    matrix[i][0] = points[i].y;
  }

  // Compute divided differences
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      const numerator = matrix[i + 1][j - 1] - matrix[i][j - 1];
      const denominator = points[i + j].x - points[i].x;
      matrix[i][j] = numerator / denominator;
    }
  }

  // Prepare table headers
  const headers = ['x', 'y'];
  for (let j = 1; j < n; j++) {
    headers.push(j === 1 ? '1st Diff' : j === 2 ? '2nd Diff' : j === 3 ? '3rd Diff' : `${j}th Diff`);
  }

  // Build terms and evaluate polynomial at targetX
  const terms: NewtonTermBreakdown[] = [];
  let evaluatedY = 0;
  const polyParts: string[] = [];

  for (let k = 0; k < n; k++) {
    const coeff = matrix[0][k];
    let evaluatedFactor = 1;
    const factorStrings: string[] = [];

    for (let j = 0; j < k; j++) {
      const xj = points[j].x;
      evaluatedFactor *= (targetX - xj);
      const sign = xj >= 0 ? `- ${formatFloat(xj, 4)}` : `+ ${formatFloat(Math.abs(xj), 4)}`;
      factorStrings.push(`(x ${sign})`);
    }

    const termVal = coeff * evaluatedFactor;
    evaluatedY += termVal;

    const factorStr = factorStrings.length > 0 ? factorStrings.join('') : '1';
    terms.push({
      index: k,
      coefficient: coeff,
      factors: factorStr,
      evaluatedFactor,
      termValue: termVal,
      cumulativeSum: evaluatedY,
    });

    // Format polynomial representation
    if (Math.abs(coeff) > 1e-12 || k === 0) {
      const coeffStr = formatFloat(coeff, 4);
      if (k === 0) {
        polyParts.push(coeffStr);
      } else {
        const factorPart = factorStrings.join('');
        if (coeff >= 0) {
          polyParts.push(`+ ${coeffStr}${factorPart}`);
        } else {
          polyParts.push(`- ${formatFloat(Math.abs(coeff), 4)}${factorPart}`);
        }
      }
    }
  }

  const polynomialString = polyParts.length > 0 ? `P(x) = ${polyParts.join(' ')}` : 'P(x) = 0';

  return {
    method: 'newton-divided',
    interpolatedY: evaluatedY,
    targetX,
    points,
    polynomialString,
    newtonTable: {
      headers,
      matrix,
      terms,
    },
    status: 'SUCCESS',
    executionTimeMs: Date.now() - startTime,
  };
}

/**
 * Lagrange Interpolation Method
 */
function runLagrange(
  points: DataPoint[],
  targetX: number,
  startTime: number
): InterpolationResult {
  const n = points.length;
  const lagrangeTerms: LagrangeBasisTerm[] = [];
  let evaluatedY = 0;
  const polyTerms: string[] = [];

  for (let i = 0; i < n; i++) {
    const xi = points[i].x;
    const yi = points[i].y;

    let numeratorProd = 1;
    let denominatorProd = 1;
    const numFactorStrs: string[] = [];
    const denFactorStrs: string[] = [];

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const xj = points[j].x;
        numeratorProd *= (targetX - xj);
        denominatorProd *= (xi - xj);

        const xSign = xj >= 0 ? `- ${formatFloat(xj, 4)}` : `+ ${formatFloat(Math.abs(xj), 4)}`;
        numFactorStrs.push(`(x ${xSign})`);
        denFactorStrs.push(`(${formatFloat(xi, 4)} ${xSign})`);
      }
    }

    const basisWeight = denominatorProd !== 0 ? numeratorProd / denominatorProd : 0;
    const weightedVal = yi * basisWeight;
    evaluatedY += weightedVal;

    const numStr = numFactorStrs.join('');
    const denStr = formatFloat(denominatorProd, 4);
    const basisFormula = `[${numStr}] / ${denStr}`;

    lagrangeTerms.push({
      index: i,
      xi,
      yi,
      basisFormula,
      evaluatedBasisWeight: basisWeight,
      weightedValue: weightedVal,
      cumulativeSum: evaluatedY,
    });

    const yiStr = formatFloat(yi, 4);
    if (Math.abs(yi) > 1e-12) {
      polyTerms.push(`${yiStr} · L_${i}(x)`);
    }
  }

  const polynomialString = polyTerms.length > 0 ? `P(x) = ${polyTerms.join(' + ')}` : 'P(x) = 0';

  return {
    method: 'lagrange',
    interpolatedY: evaluatedY,
    targetX,
    points,
    polynomialString,
    lagrangeTerms,
    status: 'SUCCESS',
    executionTimeMs: Date.now() - startTime,
  };
}
