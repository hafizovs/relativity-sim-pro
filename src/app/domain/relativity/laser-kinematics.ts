import { C } from '../../core/constants/physics.constants';
import {
  LASER_BACKWARD_COLOR,
  LASER_FORWARD_COLOR,
  LASER_MAX_TRAVEL,
  LASER_SPAWN_OFFSET,
} from '../../core/constants/space.constants';
import type { LaserDirection, LaserPulse } from '../../core/models/laser-pulse.model';
import type { ShipState } from '../../core/models/ship.model';

let laserSeq = 0;

/**
 * Create a laser pulse in the sector rest frame with |v| = c.
 * Ship velocity is NEVER added classically.
 */
export function createLaserPulse(
  ship: ShipState,
  direction: LaserDirection,
  earthTimeSec: number,
  baseFrequencyHz = 5.5e14,
): LaserPulse {
  laserSeq += 1;
  const forward = direction === 'forward';
  const offset = forward ? LASER_SPAWN_OFFSET : -LASER_SPAWN_OFFSET;
  return {
    id: `laser-${laserSeq}-${Date.now()}`,
    direction,
    x: ship.x + offset,
    y: ship.y,
    vx: forward ? C : -C,
    vy: 0,
    frequency: baseFrequencyHz,
    color: forward ? { ...LASER_FORWARD_COLOR } : { ...LASER_BACKWARD_COLOR },
    bornAtEarthTime: earthTimeSec,
    maxTravel: LASER_MAX_TRAVEL,
    traveled: 0,
    alive: true,
  };
}

/**
 * Advance pulse in the rest frame. Speed remains exactly C.
 */
export function stepLaserPulse(pulse: LaserPulse, dtEarthSec: number): LaserPulse {
  if (!pulse.alive || dtEarthSec <= 0) {
    return pulse;
  }
  const speed = Math.hypot(pulse.vx, pulse.vy);
  const dx = pulse.vx * dtEarthSec;
  const dy = pulse.vy * dtEarthSec;
  const step = Math.hypot(dx, dy);
  const traveled = pulse.traveled + step;
  const alive = traveled <= pulse.maxTravel && Math.abs(speed - C) < 1e-6;
  return {
    ...pulse,
    x: pulse.x + dx,
    y: pulse.y + dy,
    traveled,
    alive,
  };
}

export function laserSpeed(pulse: LaserPulse): number {
  return Math.hypot(pulse.vx, pulse.vy);
}

export function resetLaserSequence(): void {
  laserSeq = 0;
}
