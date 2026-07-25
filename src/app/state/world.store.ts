import { Injectable, signal } from '@angular/core';
import {
  REST_MASS_DEFAULT,
  SHIP_PROPER_HEIGHT,
  SHIP_PROPER_LENGTH,
} from '../core/constants/physics.constants';
import { SHIP_START_X, SHIP_START_Y } from '../core/constants/space.constants';
import type { LaserPulse } from '../core/models/laser-pulse.model';
import type { Planet } from '../core/models/planet.model';
import type { ShipState } from '../core/models/ship.model';
import type { Star } from '../core/models/star.model';

@Injectable({ providedIn: 'root' })
export class WorldStore {
  readonly stars = signal<Star[]>([]);
  readonly planets = signal<Planet[]>([]);
  readonly ship = signal<ShipState>({
    x: SHIP_START_X,
    y: SHIP_START_Y,
    properLength: SHIP_PROPER_LENGTH,
    properHeight: SHIP_PROPER_HEIGHT,
    restMass: REST_MASS_DEFAULT,
    velocity: 0,
  });
  readonly lasers = signal<LaserPulse[]>([]);

  setStars(stars: Star[]): void {
    this.stars.set(stars);
  }

  setPlanets(planets: Planet[]): void {
    this.planets.set(planets);
  }

  setShip(ship: ShipState): void {
    this.ship.set(ship);
  }

  patchShip(partial: Partial<ShipState>): void {
    this.ship.update((s) => ({ ...s, ...partial }));
  }

  setLasers(lasers: LaserPulse[]): void {
    this.lasers.set(lasers);
  }

  clearLasers(): void {
    this.lasers.set([]);
  }
}
