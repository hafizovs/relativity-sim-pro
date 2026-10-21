import { Injectable, computed, signal } from '@angular/core';
import {
  BETA_DEFAULT,
  C,
  REST_MASS_DEFAULT,
  SHIP_PROPER_LENGTH,
} from '../../core/constants/physics.constants';
import type { RelativityMetrics } from '../../core/models/relativity-metrics.model';
import { contractLength } from '../../domain/relativity/length-contraction';
import { clampBeta, gamma } from '../../domain/relativity/lorentz-factor';

@Injectable({ providedIn: 'root' })
export class SpaceTimeStore {
  readonly beta = signal(BETA_DEFAULT);
  readonly earthTimeSec = signal(0);
  readonly shipTimeSec = signal(0);
  readonly restMass = signal(REST_MASS_DEFAULT);
  readonly properShipLength = signal(SHIP_PROPER_LENGTH);

  readonly gamma = computed(() => gamma(this.beta()));
  readonly velocity = computed(() => this.beta() * C);

  readonly metrics = computed<RelativityMetrics>(() => {
    const beta = this.beta();
    const g = this.gamma();
    const ship = this.shipTimeSec();
    const earth = this.earthTimeSec();
    const restMass = this.restMass();
    const proper = this.properShipLength();
    return {
      beta,
      velocity: beta * C,
      c: C,
      gamma: g,
      earthTimeSec: earth,
      shipTimeSec: ship,
      timeRatio: ship > 1e-12 ? earth / ship : g,
      restMass,
      relativisticMass: restMass * g,
      contractedShipLength: contractLength(proper, g),
      properShipLength: proper,
    };
  });

  setBeta(beta: number): void {
    this.beta.set(clampBeta(beta));
  }

  setClocks(earth: number, ship: number): void {
    this.earthTimeSec.set(earth);
    this.shipTimeSec.set(ship);
  }

  resetClocks(): void {
    this.earthTimeSec.set(0);
    this.shipTimeSec.set(0);
  }
}
