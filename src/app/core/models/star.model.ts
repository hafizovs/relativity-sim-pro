import type { RgbColor, RgbVisibility } from './rgb.model';

export interface Star {
  id: number;
  /** Position in the sector rest frame (world units) */
  x: number;
  y: number;
  z: number;
  baseColor: RgbColor;
  baseFrequency: number;
  radiusPx: number;
  brightness: number;
}

export interface ObservedStar {
  screenX: number;
  screenY: number;
  color: RgbVisibility;
  radiusPx: number;
  thetaObserved: number;
}
