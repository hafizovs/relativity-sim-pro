import type { BetaPreset } from '../models/beta-preset.model';

export const LOCALE_DEFAULT = 'en' as const;
export const THEME_DEFAULT = 'dark' as const;
export const TELEMETRY_WIDTH_PX = 320;
export const BOTTOM_BAR_HEIGHT_PX = 88;
export const MOBILE_BREAKPOINT_PX = 1100;

export const BETA_PRESETS: readonly BetaPreset[] = [
  { id: 'rest', beta: 0, labelKey: 'presets.rest' },
  { id: 'half', beta: 0.5, labelKey: 'presets.half' },
  { id: 'nine', beta: 0.9, labelKey: 'presets.nine' },
  { id: 'twin', beta: 0.99, labelKey: 'presets.twin' },
  { id: 'extreme', beta: 0.999, labelKey: 'presets.extreme' },
] as const;
