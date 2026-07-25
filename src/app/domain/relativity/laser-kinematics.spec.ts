import { describe, expect, it } from 'vitest';
import { C } from '../../core/constants/physics.constants';
import type { ShipState } from '../../core/models/ship.model';
import {
  createLaserPulse,
  laserSpeed,
  stepLaserPulse,
} from './laser-kinematics';

const shipAt = (velocity: number): ShipState => ({
  x: 100,
  y: 0,
  properLength: 80,
  properHeight: 24,
  restMass: 1,
  velocity,
});

describe('laser-kinematics', () => {
  it('forward pulse has |v| = C independent of ship β', () => {
    const pulse = createLaserPulse(shipAt(0.99 * C), 'forward', 0);
    expect(laserSpeed(pulse)).toBeCloseTo(C, 6);
    expect(pulse.vx).toBe(C);
  });

  it('backward pulse has |v| = C independent of ship β', () => {
    const pulse = createLaserPulse(shipAt(0.99 * C), 'backward', 0);
    expect(laserSpeed(pulse)).toBeCloseTo(C, 6);
    expect(pulse.vx).toBe(-C);
  });

  it('does not use classical v_ship ± c', () => {
    const vShip = 0.5 * C;
    const pulse = createLaserPulse(shipAt(vShip), 'forward', 0);
    expect(pulse.vx).not.toBeCloseTo(vShip + C, 3);
    expect(pulse.vx).toBe(C);
  });

  it('steps as x += vx * dt with |v| unchanged', () => {
    const pulse = createLaserPulse(shipAt(0), 'forward', 0);
    const dt = 0.1;
    const next = stepLaserPulse(pulse, dt);
    expect(next.x).toBeCloseTo(pulse.x + C * dt, 8);
    expect(laserSpeed(next)).toBeCloseTo(C, 6);
  });

  it('backward steps with −c', () => {
    const pulse = createLaserPulse(shipAt(200), 'backward', 1);
    const next = stepLaserPulse(pulse, 0.25);
    expect(next.x).toBeCloseTo(pulse.x - C * 0.25, 8);
  });
});
