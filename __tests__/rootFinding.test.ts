import { solveRoot } from '../src/math/rootFinding';

describe('Root Finding Numerical Methods', () => {
  describe('Bisection Method', () => {
    it('converges to root of x^3 - x - 2 = 0 in [1, 2]', () => {
      const res = solveRoot({
        method: 'bisection',
        functionStr: 'x^3 - x - 2',
        a: 1,
        b: 2,
        tolerance: 1e-5,
        maxIterations: 50,
      });

      expect(res.status).toBe('CONVERGED');
      expect(res.root).not.toBeNull();
      expect(res.root!).toBeCloseTo(1.52138, 4);
      expect(res.iterations.length).toBeGreaterThan(0);
    });

    it('defensively detects invalid bracket when f(a) and f(b) have same sign', () => {
      const res = solveRoot({
        method: 'bisection',
        functionStr: 'x^2 + 1',
        a: 1,
        b: 3,
        tolerance: 1e-5,
        maxIterations: 50,
      });

      expect(res.status).toBe('INVALID_BRACKET');
      expect(res.root).toBeNull();
    });

    it('handles exact roots on boundaries', () => {
      const res = solveRoot({
        method: 'bisection',
        functionStr: 'x - 2',
        a: 2,
        b: 4,
        tolerance: 1e-5,
        maxIterations: 50,
      });

      expect(res.status).toBe('CONVERGED');
      expect(res.root).toBe(2);
    });
  });

  describe('Newton-Raphson Method', () => {
    it('converges quadratically for x^3 - 2*x - 5 = 0 with x0 = 2', () => {
      const res = solveRoot({
        method: 'newton',
        functionStr: 'x^3 - 2*x - 5',
        x0: 2,
        tolerance: 1e-6,
        maxIterations: 50,
      });

      expect(res.status).toBe('CONVERGED');
      expect(res.root).not.toBeNull();
      expect(res.root!).toBeCloseTo(2.094551, 5);
      expect(res.iterations.length).toBeLessThan(10); // Quadratic rate is fast
    });

    it('defensively handles zero derivative f\'(x) = 0', () => {
      const res = solveRoot({
        method: 'newton',
        functionStr: 'x^2 - 4',
        x0: 0, // at x=0, f'(x) = 2x = 0
        tolerance: 1e-6,
        maxIterations: 50,
      });

      expect(res.status).toBe('DERIVATIVE_ZERO');
      expect(res.statusMessage).toContain("Zero derivative");
    });
  });

  describe('Secant Method', () => {
    it('converges for x^3 - 2*x - 5 = 0 with x0 = 1, x1 = 2', () => {
      const res = solveRoot({
        method: 'secant',
        functionStr: 'x^3 - 2*x - 5',
        x0: 1,
        x1: 2,
        tolerance: 1e-6,
        maxIterations: 50,
      });

      expect(res.status).toBe('CONVERGED');
      expect(res.root).not.toBeNull();
      expect(res.root!).toBeCloseTo(2.094551, 5);
    });

    it('defensively detects duplicate initial guesses x0 = x1', () => {
      const res = solveRoot({
        method: 'secant',
        functionStr: 'x^2 - 4',
        x0: 2,
        x1: 2,
        tolerance: 1e-6,
        maxIterations: 50,
      });

      expect(res.status).toBe('DIVISION_BY_ZERO');
      expect(res.statusMessage).toContain('must be distinct');
    });
  });

  describe('Fixed-Point Iteration', () => {
    it('converges for g(x) = (2*x + 5)^(1/3)', () => {
      const res = solveRoot({
        method: 'fixed-point',
        functionStr: 'x^3 - 2*x - 5',
        gFunctionStr: '(2*x + 5)^(1/3)',
        x0: 2,
        tolerance: 1e-6,
        maxIterations: 50,
      });

      expect(res.status).toBe('CONVERGED');
      expect(res.root).not.toBeNull();
      expect(res.root!).toBeCloseTo(2.094551, 4);
    });
  });
});
