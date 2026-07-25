/**
 * Static-frame time interval from ship proper time:
 * Δt_Earth = γ · Δt_ship
 */
export function dilateStaticTime(deltaShip: number, gammaValue: number): number {
  return deltaShip * gammaValue;
}
