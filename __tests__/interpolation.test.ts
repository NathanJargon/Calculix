import { solveInterpolation } from '../src/math/interpolation';

describe('Interpolation Numerical Methods', () => {
  const quadraticPoints = [
    { id: '1', x: 1, y: 1 },
    { id: '2', x: 2, y: 4 },
    { id: '3', x: 3, y: 9 },
    { id: '4', x: 4, y: 16 },
  ];

  describe("Newton's Divided Difference", () => {
    it('accurately interpolates quadratic polynomial at x* = 2.5', () => {
      const res = solveInterpolation({
        method: 'newton-divided',
        points: quadraticPoints,
        targetX: 2.5,
      });

      expect(res.status).toBe('SUCCESS');
      expect(res.interpolatedY).toBeCloseTo(6.25, 5);
      expect(res.newtonTable).toBeDefined();
      expect(res.newtonTable?.matrix[0][0]).toBe(1); // y0
      expect(res.newtonTable?.matrix[0][1]).toBe(3); // (4 - 1)/(2 - 1) = 3
      expect(res.newtonTable?.matrix[0][2]).toBe(1); // 2nd divided diff = 1
      expect(res.newtonTable?.matrix[0][3]).toBe(0); // 3rd diff for quad = 0
    });

    it('defensively detects duplicate x coordinates', () => {
      const res = solveInterpolation({
        method: 'newton-divided',
        points: [
          { id: '1', x: 2, y: 5 },
          { id: '2', x: 2, y: 8 },
        ],
        targetX: 3,
      });

      expect(res.status).toBe('DUPLICATE_X');
      expect(res.errorMessage).toContain('Duplicate x-coordinates');
    });

    it('rejects fewer than 2 points', () => {
      const res = solveInterpolation({
        method: 'newton-divided',
        points: [{ id: '1', x: 1, y: 2 }],
        targetX: 2,
      });

      expect(res.status).toBe('INSUFFICIENT_POINTS');
    });
  });

  describe('Lagrange Interpolation', () => {
    it('accurately interpolates quadratic polynomial at x* = 2.5', () => {
      const res = solveInterpolation({
        method: 'lagrange',
        points: quadraticPoints,
        targetX: 2.5,
      });

      expect(res.status).toBe('SUCCESS');
      expect(res.interpolatedY).toBeCloseTo(6.25, 5);
      expect(res.lagrangeTerms).toBeDefined();
      expect(res.lagrangeTerms?.length).toBe(4);
    });

    it('satisfies interpolation condition P(x_i) = y_i for all input points', () => {
      for (const pt of quadraticPoints) {
        const res = solveInterpolation({
          method: 'lagrange',
          points: quadraticPoints,
          targetX: pt.x,
        });
        expect(res.interpolatedY).toBeCloseTo(pt.y, 5);
      }
    });
  });
});
