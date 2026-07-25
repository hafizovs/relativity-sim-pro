import { Injectable, inject } from '@angular/core';
import type { Signal } from '@angular/core';
import { BETA_STEP } from '../core/constants/physics.constants';
import type { RelativityMetrics } from '../core/models/relativity-metrics.model';
import { dilateStaticTime } from '../domain/relativity/time-dilation';
import { SimulationStore } from '../state/simulation.store';
import { SpaceTimeStore } from '../state/space-time.store';

@Injectable({ providedIn: 'root' })
export class SpaceTimeService {
  private readonly store = inject(SpaceTimeStore);
  private readonly simulation = inject(SimulationStore);

  readonly beta: Signal<number> = this.store.beta.asReadonly();
  readonly gamma: Signal<number> = this.store.gamma;
  readonly earthTimeSec: Signal<number> = this.store.earthTimeSec.asReadonly();
  readonly shipTimeSec: Signal<number> = this.store.shipTimeSec.asReadonly();
  readonly isPlaying: Signal<boolean> = this.simulation.isPlaying.asReadonly();
  readonly metrics: Signal<RelativityMetrics> = this.store.metrics;

  setBeta(beta: number): void {
    this.store.setBeta(beta);
  }

  nudgeBeta(deltaSteps: number): void {
    this.setBeta(this.store.beta() + deltaSteps * BETA_STEP);
  }

  play(): void {
    this.simulation.setPlaying(true);
  }

  pause(): void {
    this.simulation.setPlaying(false);
  }

  toggle(): void {
    this.simulation.togglePlaying();
  }

  resetClocks(): void {
    this.store.resetClocks();
  }

  setTimeScale(scale: number): void {
    this.simulation.setTimeScale(scale);
  }

  /**
   * Advance clocks: Δt_ship = dtReal * timeScale; Δt_Earth = γ Δt_ship.
   */
  tick(dtRealSec: number): void {
    if (!this.simulation.isPlaying() || dtRealSec <= 0) {
      return;
    }
    const dtShip = dtRealSec * this.simulation.timeScale();
    const g = this.store.gamma();
    const dtEarth = dilateStaticTime(dtShip, g);
    this.store.setClocks(
      this.store.earthTimeSec() + dtEarth,
      this.store.shipTimeSec() + dtShip,
    );
  }
}
