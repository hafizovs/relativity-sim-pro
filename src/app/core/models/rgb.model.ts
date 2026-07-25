export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface RgbVisibility extends RgbColor {
  /** false if frequency is outside the visible band after Doppler */
  visible: boolean;
  /** 0..1 transparency / brightness for soft spectral fade */
  alpha: number;
}
