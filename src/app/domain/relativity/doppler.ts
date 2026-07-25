import { GAMMA_EPS } from '../../core/constants/physics.constants';
import { clampBeta, gamma } from './lorentz-factor';

function clampUnit(value: number): number {
  return Math.min(1, Math.max(-1, value));
}

/**
 * Head-on Doppler factor.
 * approaching=true → blueshift √((1+β)/(1−β))
 * approaching=false → redshift √((1−β)/(1+β))
 */
export function dopplerFactorHeadOn(beta: number, approaching: boolean): number {
  const b = clampBeta(beta);
  const oneMinus = Math.max(1 - b, 1e-12);
  const onePlus = Math.max(1 + b, 1e-12);
  if (approaching) {
    return Math.sqrt(onePlus / oneMinus);
  }
  return Math.sqrt(oneMinus / onePlus);
}

/**
 * General relativistic Doppler using the observed angle:
 * ν_obs / ν_em = √(1−β²) / (1 − β cos θ_obs) = 1 / (γ (1 − β cos θ_obs))
 */
export function dopplerFactorGeneral(beta: number, cosThetaObserved: number): number {
  const b = clampBeta(beta);
  const g = gamma(b);
  const cosObs = clampUnit(cosThetaObserved);
  const denom = 1 - b * cosObs;
  return 1 / (g * Math.max(denom, 1e-12));
}

export function shiftFrequency(nuEmitted: number, factor: number): number {
  return nuEmitted * factor;
}

/** Guard helper exported for tests / numerical checks. */
export function dopplerSafeSqrtTerm(beta: number): number {
  const b = clampBeta(beta);
  return Math.sqrt(Math.max(1 - b * b, GAMMA_EPS));
}
