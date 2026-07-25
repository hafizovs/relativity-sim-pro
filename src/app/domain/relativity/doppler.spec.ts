import { describe, expect, it } from 'vitest';
import { dopplerFactorGeneral, dopplerFactorHeadOn } from './doppler';
import { gamma } from './lorentz-factor';

describe('doppler', () => {
  it('approach factor > 1 (blueshift)', () => {
    expect(dopplerFactorHeadOn(0.5, true)).toBeGreaterThan(1);
  });

  it('recede factor < 1 (redshift)', () => {
    expect(dopplerFactorHeadOn(0.5, false)).toBeLessThan(1);
  });

  it('general formula at θ_obs=0 matches head-on approach', () => {
    const beta = 0.8;
    const headOn = dopplerFactorHeadOn(beta, true);
    const general = dopplerFactorGeneral(beta, 1);
    expect(general).toBeCloseTo(headOn, 8);
  });

  it('general formula at θ_obs=π matches head-on recede', () => {
    const beta = 0.8;
    const headOn = dopplerFactorHeadOn(beta, false);
    const general = dopplerFactorGeneral(beta, -1);
    expect(general).toBeCloseTo(headOn, 8);
  });

  it('equals 1/(γ(1−β cosθ))', () => {
    const beta = 0.7;
    const cosTheta = 0.3;
    const expected = 1 / (gamma(beta) * (1 - beta * cosTheta));
    expect(dopplerFactorGeneral(beta, cosTheta)).toBeCloseTo(expected, 10);
  });
});
