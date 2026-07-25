import { GAMMA_EPS } from '../../core/constants/physics.constants';
import { clampBeta } from './lorentz-factor';

function clampUnit(value: number): number {
  return Math.min(1, Math.max(-1, value));
}

/**
 * Relativistic aberration for the apparent *line-of-sight* to a star.
 *
 * Rest-frame look angle θ_em (0 = forward / +X) transforms to ship-frame θ_obs:
 *   cos θ_obs = (cos θ_em + β) / (1 + β cos θ_em)
 *
 * Equivalent to the photon-propagation form in Appendix B after accounting for
 * look direction = photon direction + π. As β → 1, θ_obs → 0 (headlight effect).
 */
export function aberrateAngle(thetaEmitted: number, beta: number): number {
  const b = clampBeta(beta);
  const cosEm = clampUnit(Math.cos(thetaEmitted));
  const sinEm = Math.sin(thetaEmitted);
  const denom = 1 + b * cosEm;
  const safeDenom = Math.abs(denom) < 1e-12 ? Math.sign(denom || 1) * 1e-12 : denom;
  const cosObs = clampUnit((cosEm + b) / safeDenom);
  const sinObs =
    (sinEm * Math.sqrt(Math.max(1 - b * b, GAMMA_EPS))) / safeDenom;
  return Math.atan2(sinObs, cosObs);
}

/**
 * Vector form: rest-frame direction ship→star (dx, dy) → unit observed direction.
 * Forward axis is +X (θ = 0).
 */
export function aberrateDirection(
  dirX: number,
  dirY: number,
  beta: number,
): { x: number; y: number } {
  const len = Math.hypot(dirX, dirY);
  if (len < 1e-12) {
    return { x: 1, y: 0 };
  }
  const nx = dirX / len;
  const ny = dirY / len;
  const thetaEm = Math.atan2(ny, nx);
  const thetaObs = aberrateAngle(thetaEm, beta);
  return { x: Math.cos(thetaObs), y: Math.sin(thetaObs) };
}
