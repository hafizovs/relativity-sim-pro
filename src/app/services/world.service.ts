import { Injectable, inject } from '@angular/core';
import { MAX_ACTIVE_LASERS } from '../core/constants/space.constants';
import type { LaserDirection } from '../core/models/laser-pulse.model';
import { createLaserPulse } from '../domain/relativity/laser-kinematics';
import { createPlanetCatalog } from '../domain/space/planet-catalog';
import { generateStarfield } from '../domain/space/starfield-generator';
import { worldStep } from '../domain/space/world-step';
import { SimulationStore } from '../state/simulation.store';
import { SpaceTimeStore } from '../state/space-time.store';
import { WorldStore } from '../state/world.store';

@Injectable({ providedIn: 'root' })
export class WorldService {
  private readonly world = inject(WorldStore);
  private readonly spaceTime = inject(SpaceTimeStore);
  private readonly simulation = inject(SimulationStore);
  private bootstrapped = false;

  bootstrap(): void {
    if (this.bootstrapped) {
      return;
    }
    this.world.setStars(generateStarfield());
    this.world.setPlanets(createPlanetCatalog());
    this.world.patchShip({
      velocity: this.spaceTime.velocity(),
      restMass: this.spaceTime.restMass(),
    });
    this.world.clearLasers();
    this.bootstrapped = true;
  }

  fireLaser(direction: LaserDirection): void {
    const lasers = this.world.lasers();
    if (lasers.length >= MAX_ACTIVE_LASERS) {
      return;
    }
    const pulse = createLaserPulse(
      this.world.ship(),
      direction,
      this.spaceTime.earthTimeSec(),
    );
    this.world.setLasers([...lasers, pulse]);
    this.simulation.setHasActiveLasers(true);
  }

  clearLasers(): void {
    this.world.clearLasers();
    this.simulation.setHasActiveLasers(false);
  }

  /**
   * Rest-frame step: ship motion + laser propagation at c.
   */
  step(dtEarthSec: number): void {
    if (dtEarthSec <= 0) {
      return;
    }
    const velocity = this.spaceTime.velocity();
    const result = worldStep({
      ship: this.world.ship(),
      lasers: this.world.lasers(),
      dtEarthSec,
      velocity,
    });
    this.world.setShip(result.ship);
    this.world.setLasers(result.lasers);
    this.simulation.setHasActiveLasers(result.lasers.length > 0);
  }

  resetWorldMotion(): void {
    this.clearLasers();
    this.world.patchShip({ x: 0, y: 0, velocity: this.spaceTime.velocity() });
  }
}
