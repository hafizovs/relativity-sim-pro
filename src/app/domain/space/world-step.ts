import { SECTOR_LENGTH } from '../../core/constants/space.constants';
import type { LaserPulse } from '../../core/models/laser-pulse.model';
import type { ShipState } from '../../core/models/ship.model';
import { stepLaserPulse } from '../relativity/laser-kinematics';

export interface WorldStepInput {
  ship: ShipState;
  lasers: LaserPulse[];
  dtEarthSec: number;
  velocity: number;
}

export interface WorldStepResult {
  ship: ShipState;
  lasers: LaserPulse[];
}

/**
 * Integrate ship along +X in the rest frame and advance laser pulses at c.
 */
export function worldStep(input: WorldStepInput): WorldStepResult {
  const { dtEarthSec, velocity } = input;
  let x = input.ship.x + velocity * dtEarthSec;
  x = ((x % SECTOR_LENGTH) + SECTOR_LENGTH) % SECTOR_LENGTH;

  const ship: ShipState = {
    ...input.ship,
    x,
    velocity,
  };

  const lasers = input.lasers
    .map((pulse) => stepLaserPulse(pulse, dtEarthSec))
    .filter((pulse) => pulse.alive);

  return { ship, lasers };
}
