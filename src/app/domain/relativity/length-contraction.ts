/**
 * Length contraction along the boost axis: L = L₀ / γ
 */
export function contractLength(properLength: number, gammaValue: number): number {
  const g = Math.max(gammaValue, 1);
  return properLength / g;
}
