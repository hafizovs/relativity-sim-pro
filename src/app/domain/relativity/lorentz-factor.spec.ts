import { describe, expect, it } from 'vitest';
import { BETA_MAX } from '../../core/constants/physics.constants';
import { clampBeta, gamma } from './lorentz-factor';

describe('lorentz-factor', () => {
  it('γ(0) = 1', () => {
    expect(gamma(0)).toBeCloseTo(1, 12);
  });

  it('γ(0.6) = 1.25', () => {
    expect(gamma(0.6)).toBeCloseTo(1.25, 10);
  });

  it('γ(0.8) ≈ 5/3', () => {
    expect(gamma(0.8)).toBeCloseTo(5 / 3, 4);
  });

  it('γ(0.99) ≈ 7.0888', () => {
    expect(gamma(0.99)).toBeCloseTo(7.0888, 3);
  });

  it('γ(0.5) ≈ 1.1547', () => {
    expect(gamma(0.5)).toBeCloseTo(1.1547, 3);
  });

  it('γ(0.9) ≈ 2.2943', () => {
    expect(gamma(0.9)).toBeCloseTo(2.2943, 3);
  });

  it('γ(0.999) ≈ 22.3663', () => {
    expect(gamma(0.999)).toBeCloseTo(22.3663, 3);
  });

  it('clamps β above BETA_MAX', () => {
    expect(clampBeta(1.5)).toBe(BETA_MAX);
    expect(gamma(2)).toBeCloseTo(gamma(BETA_MAX), 10);
  });

  it('never yields NaN or Infinity at BETA_MAX', () => {
    const g = gamma(BETA_MAX);
    expect(Number.isFinite(g)).toBe(true);
    expect(g).toBeGreaterThan(1);
  });
});
