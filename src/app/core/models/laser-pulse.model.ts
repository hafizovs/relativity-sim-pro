import type { RgbColor } from './rgb.model';

export type LaserDirection = 'forward' | 'backward';

export interface LaserPulse {
  id: string;
  direction: LaserDirection;
  x: number;
  y: number;
  /** Rest-frame velocity components; |vx| must equal C */
  vx: number;
  vy: number;
  frequency: number;
  color: RgbColor;
  bornAtEarthTime: number;
  maxTravel: number;
  traveled: number;
  alive: boolean;
}
