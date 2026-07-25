import { COCKPIT_BG, COCKPIT_FOCAL, CROSSHAIR_COLOR } from '../../core/constants/render.constants';
import type { LaserPulse } from '../../core/models/laser-pulse.model';
import type { Planet } from '../../core/models/planet.model';
import type { RelativityMetrics } from '../../core/models/relativity-metrics.model';
import type { ShipState } from '../../core/models/ship.model';
import type { Star } from '../../core/models/star.model';
import { aberrateDirection } from '../../domain/relativity/aberration';
import { dopplerFactorGeneral, shiftFrequency } from '../../domain/relativity/doppler';
import { frequencyToRgb } from '../../domain/relativity/frequency-to-rgb';

export interface CockpitFrameState {
  width: number;
  height: number;
  stars: Star[];
  planets: Planet[];
  ship: ShipState;
  lasers: LaserPulse[];
  metrics: RelativityMetrics;
}

/**
 * Draw cockpit starfield with relativistic aberration + Doppler shift.
 */
export function drawCockpitFrame(
  ctx: CanvasRenderingContext2D,
  state: CockpitFrameState,
): void {
  const { width, height, stars, planets, ship, lasers, metrics } = state;
  if (width <= 0 || height <= 0) {
    return;
  }

  const cx = width / 2;
  const cy = height / 2;
  const beta = metrics.beta;
  const gamma = metrics.gamma;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = COCKPIT_BG;
  ctx.fillRect(0, 0, width, height);

  // Soft radial vignette
  const vignette = ctx.createRadialGradient(cx, cy, height * 0.15, cx, cy, height * 0.85);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    const dx = star.x - ship.x;
    const dy = star.y - ship.y;
    // Fold depth into forward component for 2.5D feel
    const forward = dx + star.z * 0.15;
    const dir = aberrateDirection(forward, dy, beta);
    const cosObs = dir.x;
    const screenX = cx + COCKPIT_FOCAL * dir.y;
    const depthFactor = Math.max(0.35, Math.min(1.4, 400 / (star.z + 80)));
    const screenY = cy - COCKPIT_FOCAL * 0.08 * (dy / (Math.abs(forward) + 80)) * depthFactor;

    if (
      screenX < -20 ||
      screenX > width + 20 ||
      screenY < -20 ||
      screenY > height + 20
    ) {
      continue;
    }

    const factor = dopplerFactorGeneral(beta, cosObs);
    const nuObs = shiftFrequency(star.baseFrequency, factor);
    const color = frequencyToRgb(nuObs);
    if (!color.visible || color.alpha < 0.02) {
      continue;
    }

    const blueshiftBoost = Math.max(0, Math.log2(factor + 1e-9) * 0.15);
    const radius = star.radiusPx * (1 + blueshiftBoost) * star.brightness;
    const alpha = color.alpha * star.brightness;

    const glow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 3);
    glow.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${alpha})`);
    glow.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${alpha})`;
    ctx.beginPath();
    ctx.arc(screenX, screenY, Math.max(0.4, radius), 0, Math.PI * 2);
    ctx.fill();
  }

  for (const planet of planets) {
    const dx = (planet.x - ship.x) / gamma;
    const dy = planet.y - ship.y;
    const dir = aberrateDirection(dx + 200, dy, beta);
    const screenX = cx + COCKPIT_FOCAL * dir.y * 0.85;
    const screenY = cy - COCKPIT_FOCAL * 0.12 * (dy / (Math.abs(dx) + 120));
    const radius = Math.max(2, (planet.properRadius / gamma) * (COCKPIT_FOCAL / 500));

    const factor = dopplerFactorGeneral(beta, dir.x);
    const nu = shiftFrequency(5.2e14, factor);
    const tint = frequencyToRgb(nu);
    const r = tint.visible ? tint.r : planet.baseColor.r;
    const g = tint.visible ? tint.g : planet.baseColor.g;
    const b = tint.visible ? tint.b : planet.baseColor.b;
    const a = tint.visible ? Math.max(0.35, tint.alpha) : 0.5;

    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY, radius / Math.max(1, Math.sqrt(gamma) * 0.6), radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(240, 169, 74, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (const laser of lasers) {
    if (!laser.alive) {
      continue;
    }
    const dx = laser.x - ship.x;
    const dy = laser.y - ship.y;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
      continue;
    }
    const dir = aberrateDirection(dx, dy, beta);
    const sx = cx + COCKPIT_FOCAL * dir.y * 0.5;
    const sy = cy;
    ctx.strokeStyle = `rgba(${laser.color.r},${laser.color.g},${laser.color.b},0.85)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }

  // Prograde crosshair
  ctx.strokeStyle = CROSSHAIR_COLOR;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy);
  ctx.lineTo(cx + 12, cy);
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx, cy + 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();
}
