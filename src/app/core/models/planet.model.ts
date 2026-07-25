import type { RgbColor } from './rgb.model';

export interface Planet {
  id: string;
  nameKey: string;
  x: number;
  y: number;
  properRadius: number;
  baseColor: RgbColor;
  label: string;
}
