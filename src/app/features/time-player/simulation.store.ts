import { Injectable, computed, signal } from '@angular/core';
import { CLOCK_RUNNING_DEFAULT, TIME_SCALE_DEFAULT } from '../../core/constants/time.constants';
import type { AppPhase } from '../../core/models/app-phase.model';

@Injectable({ providedIn: 'root' })
export class SimulationStore {
  readonly isPlaying = signal(CLOCK_RUNNING_DEFAULT);
  readonly timeScale = signal(TIME_SCALE_DEFAULT);
  readonly hasActiveLasers = signal(false);

  readonly phase = computed<AppPhase>(() => {
    if (this.hasActiveLasers()) {
      return 'experiment';
    }
    return this.isPlaying() ? 'running' : 'paused';
  });

  setPlaying(playing: boolean): void {
    this.isPlaying.set(playing);
  }

  togglePlaying(): void {
    this.isPlaying.update((v) => !v);
  }

  setTimeScale(scale: number): void {
    this.timeScale.set(scale);
  }

  setHasActiveLasers(active: boolean): void {
    this.hasActiveLasers.set(active);
  }
}
