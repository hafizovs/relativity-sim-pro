import {
  BASE_FREQUENCY_HZ_MAX,
  BASE_FREQUENCY_HZ_MIN,
  STAR_COUNT,
  STAR_RADIUS_PX_MAX,
  STAR_RADIUS_PX_MIN,
  STAR_X_MAX,
  STAR_X_MIN,
  STAR_Y_MAX,
  STAR_Y_MIN,
  STAR_Z_MAX,
  STAR_Z_MIN,
  STARFIELD_SEED,
} from '../../core/constants/space.constants';
import type { RgbColor } from '../../core/models/rgb.model';
import type { Star } from '../../core/models/star.model';

/** Mulberry32 seeded PRNG for deterministic starfields. */
export function createSeededRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function frequencyToBaseColor(nu: number): RgbColor {
  const t = (nu - BASE_FREQUENCY_HZ_MIN) / (BASE_FREQUENCY_HZ_MAX - BASE_FREQUENCY_HZ_MIN);
  const warm = { r: 255, g: 236, b: 210 };
  const cool = { r: 180, g: 210, b: 255 };
  return {
    r: Math.round(lerp(warm.r, cool.r, t)),
    g: Math.round(lerp(warm.g, cool.g, t)),
    b: Math.round(lerp(warm.b, cool.b, t)),
  };
}

export function generateStarfield(
  count: number = STAR_COUNT,
  seed: number = STARFIELD_SEED,
): Star[] {
  const rnd = createSeededRng(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const baseFrequency = lerp(BASE_FREQUENCY_HZ_MIN, BASE_FREQUENCY_HZ_MAX, rnd());
    stars.push({
      id: i,
      x: lerp(STAR_X_MIN, STAR_X_MAX, rnd()),
      y: lerp(STAR_Y_MIN, STAR_Y_MAX, rnd()),
      z: lerp(STAR_Z_MIN, STAR_Z_MAX, rnd()),
      baseColor: frequencyToBaseColor(baseFrequency),
      baseFrequency,
      radiusPx: lerp(STAR_RADIUS_PX_MIN, STAR_RADIUS_PX_MAX, rnd()),
      brightness: 0.35 + rnd() * 0.65,
    });
  }
  return stars;
}
