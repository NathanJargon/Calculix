import { TUTORIAL_CHAPTERS } from '../src/data/tutorialChapters';
import { solveRoot } from '../src/math/rootFinding';
import { solveInterpolation } from '../src/math/interpolation';
import { RootMethodType } from '../src/types/rootFinding';
import { InterpolationMethodType } from '../src/types/interpolation';

describe('TUTORIAL_CHAPTERS data & prefill solver verification', () => {
  it('contains all 6 core numerical method chapters with complete educational sections', () => {
    expect(TUTORIAL_CHAPTERS.length).toBe(6);
    const ids = TUTORIAL_CHAPTERS.map((c) => c.id);
    expect(ids).toEqual([
      'bisection',
      'newton',
      'secant',
      'fixed-point',
      'newton-divided',
      'lagrange',
    ]);

    for (const ch of TUTORIAL_CHAPTERS) {
      expect(ch.title.length).toBeGreaterThan(0);
      expect(ch.intuition.length).toBeGreaterThan(20);
      expect(ch.mathFormula.length).toBeGreaterThan(0);
      expect(ch.conditions.length).toBeGreaterThan(0);
      expect(ch.pitfalls.length).toBeGreaterThan(0);
      expect(ch.workedExample.stepByStep.length).toBeGreaterThan(0);
      expect(ch.calculatorGuide.inputItems.length).toBeGreaterThan(0);
      expect(ch.calculatorGuide.prefill).toBeDefined();
    }
  });

  it('solves every root-finding chapter prefill example to convergence', () => {
    const rootChapters = TUTORIAL_CHAPTERS.filter((c) => c.category === 'Root-Finding');
    expect(rootChapters.length).toBe(4);

    for (const ch of rootChapters) {
      const rp = ch.calculatorGuide.prefill?.rootParams;
      expect(rp).toBeDefined();
      const res = solveRoot({
        method: ch.calculatorGuide.targetMethod as RootMethodType,
        functionStr: rp!.functionStr,
        a: rp!.a,
        b: rp!.b,
        x0: rp!.x0,
        x1: rp!.x1,
        gFunctionStr: rp!.gFunctionStr,
        tolerance: rp!.tolerance ?? 1e-6,
        maxIterations: rp!.maxIterations ?? 50,
      });

      expect(res.status).toBe('CONVERGED');
      expect(res.root).not.toBeNull();
    }
  });

  it('solves every interpolation chapter prefill example accurately', () => {
    const interpChapters = TUTORIAL_CHAPTERS.filter((c) => c.category === 'Interpolation');
    expect(interpChapters.length).toBe(2);

    for (const ch of interpChapters) {
      const ip = ch.calculatorGuide.prefill?.interpolationParams;
      expect(ip).toBeDefined();
      const res = solveInterpolation({
        method: ch.calculatorGuide.targetMethod as InterpolationMethodType,
        points: ip!.points,
        targetX: ip!.targetX,
      });

      expect(res.errorMessage).toBeUndefined();
      expect(res.interpolatedY).not.toBeNull();
    }
  });
});

