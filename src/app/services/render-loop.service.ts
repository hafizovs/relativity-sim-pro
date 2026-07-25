import { Injectable, inject, OnDestroy } from '@angular/core';
import { MAX_FRAME_DT_SEC } from '../core/constants/time.constants';
import { SimulationStore } from '../state/simulation.store';
import { SpaceTimeService } from './space-time.service';
import { WorldService } from './world.service';

export type FrameDrawCallback = (dtSec: number) => void;

/**
 * Single requestAnimationFrame loop for simulation + registered drawers.
 */
@Injectable({ providedIn: 'root' })
export class RenderLoopService implements OnDestroy {
  private readonly spaceTime = inject(SpaceTimeService);
  private readonly world = inject(WorldService);
  private readonly simulation = inject(SimulationStore);

  private rafId = 0;
  private lastTs = 0;
  private running = false;
  private readonly drawers = new Set<FrameDrawCallback>();

  start(): void {
    if (this.running) {
      return;
    }
    this.world.bootstrap();
    this.running = true;
    this.lastTs = 0;
    const loop = (ts: number) => {
      if (!this.running) {
        return;
      }
      if (this.lastTs === 0) {
        this.lastTs = ts;
      }
      const dt = Math.min(MAX_FRAME_DT_SEC, Math.max(0, (ts - this.lastTs) / 1000));
      this.lastTs = ts;

      this.spaceTime.tick(dt);

      if (this.simulation.isPlaying()) {
        const g = this.spaceTime.gamma();
        const dtEarth = dt * this.simulation.timeScale() * g;
        this.world.step(dtEarth);
      }

      for (const draw of this.drawers) {
        draw(dt);
      }

      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  registerDrawer(cb: FrameDrawCallback): () => void {
    this.drawers.add(cb);
    return () => this.drawers.delete(cb);
  }

  ngOnDestroy(): void {
    this.stop();
    this.drawers.clear();
  }
}
