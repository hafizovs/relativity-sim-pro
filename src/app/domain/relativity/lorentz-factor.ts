import { BETA_MAX, BETA_MIN, GAMMA_EPS } from '../../core/constants/physics.constants';

export function clampBeta(beta: number): number {
  if (!Number.isFinite(beta)) {
    return BETA_MIN;
  }
  return Math.min(BETA_MAX, Math.max(BETA_MIN, beta));
}

export function betaFromVelocity(v: number, c: number): number {
  if (c === 0) {
    return 0;
  }
  return clampBeta(v / c);
}

/**
 * Lorentz factor γ = 1 / √(1 − β²) with numerical floor near β → 1.
 */
export function gamma(beta: number): number {
  const b = clampBeta(beta);
  const oneMinus = Math.max(1 - b * b, GAMMA_EPS);
  return 1 / Math.sqrt(oneMinus);
}
