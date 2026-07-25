import { describe, expect, it } from 'vitest';
import { gamma } from './lorentz-factor';
import { dilateStaticTime } from './time-dilation';

describe('time-dilation', () => {
  it('Δt_E = γ Δt_S', () => {
    const g = gamma(0.99);
    expect(dilateStaticTime(1, g)).toBeCloseTo(g, 10);
  });

  it('at β=0 intervals are equal', () => {
    expect(dilateStaticTime(2.5, gamma(0))).toBeCloseTo(2.5, 12);
  });

  it('scales linearly with ship proper time', () => {
    const g = gamma(0.9);
    expect(dilateStaticTime(3, g)).toBeCloseTo(3 * g, 10);
  });
});
