import { describe, expect, it } from 'vitest';
import { gamma } from './lorentz-factor';
import { contractLength } from './length-contraction';

describe('length-contraction', () => {
  it('L = L0 / γ', () => {
    const L0 = 80;
    const g = gamma(0.99);
    expect(contractLength(L0, g)).toBeCloseTo(L0 / g, 10);
  });

  it('at β=0 L = L0', () => {
    expect(contractLength(80, gamma(0))).toBeCloseTo(80, 12);
  });

  it('approaches pancake at extreme β', () => {
    const L = contractLength(80, gamma(0.999));
    expect(L).toBeLessThan(4);
    expect(L).toBeGreaterThan(0);
  });
});
