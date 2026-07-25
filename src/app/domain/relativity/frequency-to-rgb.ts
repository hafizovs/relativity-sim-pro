import {
  C_VACUUM_MS,
  WAVELENGTH_NM_MAX,
  WAVELENGTH_NM_MIN,
} from '../../core/constants/physics.constants';
import type { RgbVisibility } from '../../core/models/rgb.model';

/**
 * Approximate wavelength (nm) → RGB using a classic piecewise spectrum map.
 */
function wavelengthToRgb(wavelengthNm: number): { r: number; g: number; b: number; factor: number } {
  let r = 0;
  let g = 0;
  let b = 0;

  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    r = -(wavelengthNm - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    r = 0;
    g = (wavelengthNm - 440) / (490 - 440);
    b = 1;
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    r = 0;
    g = 1;
    b = -(wavelengthNm - 510) / (510 - 490);
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    r = (wavelengthNm - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    r = 1;
    g = -(wavelengthNm - 645) / (645 - 580);
    b = 0;
  } else if (wavelengthNm >= 645 && wavelengthNm <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  let factor = 1;
  if (wavelengthNm >= 380 && wavelengthNm < 420) {
    factor = 0.3 + (0.7 * (wavelengthNm - 380)) / (420 - 380);
  } else if (wavelengthNm > 700 && wavelengthNm <= 750) {
    factor = 0.3 + (0.7 * (750 - wavelengthNm)) / (750 - 700);
  }

  return {
    r: Math.round(255 * Math.min(1, Math.max(0, r * factor))),
    g: Math.round(255 * Math.min(1, Math.max(0, g * factor))),
    b: Math.round(255 * Math.min(1, Math.max(0, b * factor))),
    factor,
  };
}

/**
 * Convert frequency (Hz) to RGB + soft visibility near spectral edges.
 */
export function frequencyToRgb(nuHz: number): RgbVisibility {
  if (!Number.isFinite(nuHz) || nuHz <= 0) {
    return { r: 0, g: 0, b: 0, visible: false, alpha: 0 };
  }

  const wavelengthNm = (C_VACUUM_MS / nuHz) * 1e9;
  const soft = 20;

  if (wavelengthNm < WAVELENGTH_NM_MIN - soft || wavelengthNm > WAVELENGTH_NM_MAX + soft) {
    return { r: 0, g: 0, b: 0, visible: false, alpha: 0 };
  }

  const clampedNm = Math.min(
    WAVELENGTH_NM_MAX,
    Math.max(WAVELENGTH_NM_MIN, wavelengthNm),
  );
  const rgb = wavelengthToRgb(clampedNm);

  let alpha = 1;
  if (wavelengthNm < WAVELENGTH_NM_MIN) {
    alpha = Math.max(0, 1 - (WAVELENGTH_NM_MIN - wavelengthNm) / soft);
  } else if (wavelengthNm > WAVELENGTH_NM_MAX) {
    alpha = Math.max(0, 1 - (wavelengthNm - WAVELENGTH_NM_MAX) / soft);
  } else {
    alpha = Math.min(1, Math.max(0.15, rgb.factor));
  }

  const visible = alpha > 0.02 && wavelengthNm >= WAVELENGTH_NM_MIN - soft &&
    wavelengthNm <= WAVELENGTH_NM_MAX + soft;

  return {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    visible,
    alpha,
  };
}
