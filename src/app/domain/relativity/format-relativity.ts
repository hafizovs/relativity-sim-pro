export function formatBeta(beta: number, digits = 3): string {
  return `${beta.toFixed(digits)}c`;
}

export function formatGamma(gammaValue: number): string {
  if (!Number.isFinite(gammaValue)) {
    return '—';
  }
  if (gammaValue >= 100) {
    return gammaValue.toExponential(3);
  }
  if (gammaValue >= 10) {
    return gammaValue.toFixed(2);
  }
  return gammaValue.toFixed(4);
}

export function formatTimeSec(seconds: number): string {
  if (!Number.isFinite(seconds)) {
    return '0.000 s';
  }
  if (Math.abs(seconds) >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s.toFixed(1)}s`;
  }
  if (Math.abs(seconds) >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toFixed(2)}s`;
  }
  return `${seconds.toFixed(3)} s`;
}

export function formatMass(value: number): string {
  if (value >= 100) {
    return value.toExponential(3);
  }
  return value.toFixed(4);
}

export function formatRatio(value: number): string {
  if (!Number.isFinite(value)) {
    return '1.000';
  }
  if (value >= 100) {
    return value.toExponential(3);
  }
  return value.toFixed(3);
}
