/** Simulation light speed in world units / second (pedagogical scale). */
export const C = 1000;

export const BETA_MIN = 0;
export const BETA_MAX = 0.999;
export const BETA_DEFAULT = 0;
export const BETA_STEP = 0.001;

/** Floor for `1 - β²` to keep γ finite near β → 1. */
export const GAMMA_EPS = 1e-12;

export const REST_MASS_DEFAULT = 1;
export const SHIP_PROPER_LENGTH = 80;
export const SHIP_PROPER_HEIGHT = 24;

/** Vacuum speed of light for spectral mapping only — not the simulation C. */
export const C_VACUUM_MS = 2.99792458e8;
export const WAVELENGTH_NM_MIN = 380;
export const WAVELENGTH_NM_MAX = 750;
