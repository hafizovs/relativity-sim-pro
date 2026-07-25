import {
  GHOST_SHIP_COLOR,
  GRID_SPACING_WORLD,
  OBSERVER_BG,
  OBSERVER_PX_PER_WORLD,
  PLANET_OUTLINE,
  SHIP_COLOR,
} from '../../core/constants/render.constants';
import type { LaserPulse } from '../../core/models/laser-pulse.model';
import type { Planet } from '../../core/models/planet.model';
import type { RelativityMetrics } from '../../core/models/relativity-metrics.model';
import type { ShipState } from '../../core/models/ship.model';
import { formatBeta, formatGamma } from '../../domain/relativity/format-relativity';

export interface ObserverFrameState {
  width: number;
  height: number;
  planets: Planet[];
  ship: ShipState;
  lasers: LaserPulse[];
  metrics: RelativityMetrics;
  zoom: number;
}

function worldToScreen(
  x: number,
  y: number,
  cameraX: number,
  width: number,
  height: number,
  scale: number,
): { sx: number; sy: number } {
  return {
    sx: width / 2 + (x - cameraX) * scale,
    sy: height / 2 - y * scale,
  };
}

/**
 * Rest-frame sector map with length-contracted ship and c-speed lasers.
 */
export function drawObserverFrame(
  ctx: CanvasRenderingContext2D,
  state: ObserverFrameState,
): void {
  const { width, height, planets, ship, lasers, metrics, zoom } = state;
  if (width <= 0 || height <= 0) {
    return;
  }

  const scale = OBSERVER_PX_PER_WORLD * zoom;
  const cameraX = ship.x;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = OBSERVER_BG;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = 'rgba(62, 198, 255, 0.08)';
  ctx.lineWidth = 1;
  const grid = GRID_SPACING_WORLD;
  const x0 = cameraX - width / (2 * scale);
  const x1 = cameraX + width / (2 * scale);
  const startX = Math.floor(x0 / grid) * grid;
  for (let x = startX; x <= x1; x += grid) {
    const p = worldToScreen(x, 0, cameraX, width, height, scale);
    ctx.beginPath();
    ctx.moveTo(p.sx, 0);
    ctx.lineTo(p.sx, height);
    ctx.stroke();
  }
  const ySpan = height / (2 * scale);
  const startY = Math.floor(-ySpan / grid) * grid;
  for (let y = startY; y <= ySpan; y += grid) {
    const p = worldToScreen(cameraX, y, cameraX, width, height, scale);
    ctx.beginPath();
    ctx.moveTo(0, p.sy);
    ctx.lineTo(width, p.sy);
    ctx.stroke();
  }

  // Flight axis
  ctx.strokeStyle = 'rgba(62, 198, 255, 0.35)';
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  for (const planet of planets) {
    const p = worldToScreen(planet.x, planet.y, cameraX, width, height, scale);
    const r = planet.properRadius * scale;
    ctx.fillStyle = `rgb(${planet.baseColor.r},${planet.baseColor.g},${planet.baseColor.b})`;
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, Math.max(3, r), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLANET_OUTLINE;
    ctx.stroke();
    ctx.fillStyle = 'rgba(230, 238, 249, 0.75)';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText(planet.label, p.sx + r + 4, p.sy + 4);
  }

  const contracted = metrics.contractedShipLength;
  const proper = metrics.properShipLength;
  const shipH = ship.properHeight * scale;
  const shipCenter = worldToScreen(ship.x, ship.y, cameraX, width, height, scale);

  // Ghost proper-length outline
  const ghostW = proper * scale;
  ctx.strokeStyle = GHOST_SHIP_COLOR;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(shipCenter.sx - ghostW / 2, shipCenter.sy - shipH / 2, ghostW, shipH);
  ctx.setLineDash([]);

  // Contracted ship body
  const bodyW = Math.max(2, contracted * scale);
  ctx.fillStyle = SHIP_COLOR;
  roundRect(
    ctx,
    shipCenter.sx - bodyW / 2,
    shipCenter.sy - shipH / 2,
    bodyW,
    shipH,
    Math.min(6, shipH / 3),
  );
  ctx.fill();

  // Nose tip
  ctx.fillStyle = '#f0a94a';
  ctx.beginPath();
  ctx.moveTo(shipCenter.sx + bodyW / 2, shipCenter.sy);
  ctx.lineTo(shipCenter.sx + bodyW / 2 + 8, shipCenter.sy - 4);
  ctx.lineTo(shipCenter.sx + bodyW / 2 + 8, shipCenter.sy + 4);
  ctx.closePath();
  ctx.fill();

  for (const laser of lasers) {
    if (!laser.alive) {
      continue;
    }
    const a = worldToScreen(laser.x - 18, laser.y, cameraX, width, height, scale);
    const b = worldToScreen(laser.x + 18, laser.y, cameraX, width, height, scale);
    ctx.strokeStyle = `rgb(${laser.color.r},${laser.color.g},${laser.color.b})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  if (lasers.some((l) => l.alive)) {
    ctx.fillStyle = 'rgba(230, 238, 249, 0.8)';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText('|v| = c', 12, height - 14);
  }

  ctx.fillStyle = 'rgba(230, 238, 249, 0.85)';
  ctx.font = '12px "IBM Plex Mono", monospace';
  ctx.fillText(`β ${formatBeta(metrics.beta)}  γ ${formatGamma(metrics.gamma)}`, 12, 20);
  ctx.fillText(`L = L₀/γ = ${contracted.toFixed(2)}`, 12, 38);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
