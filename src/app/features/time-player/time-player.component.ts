import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TIME_SCALE_OPTIONS } from '../../core/constants/time.constants';
import { I18nService } from '../../core/services/i18n.service';
import { SpaceTimeService } from '../velocity-controls/space-time.service';
import { WorldService } from '../experiment-panel/world.service';
import { SimulationStore } from './simulation.store';

@Component({
  selector: 'rsp-time-player',
  templateUrl: './time-player.component.html',
  styleUrl: './time-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePlayerComponent {
  private readonly spaceTime = inject(SpaceTimeService);
  private readonly world = inject(WorldService);
  private readonly simulation = inject(SimulationStore);
  private readonly i18n = inject(I18nService);

  readonly isPlaying = this.spaceTime.isPlaying;
  readonly timeScale = this.simulation.timeScale;
  readonly scales = TIME_SCALE_OPTIONS;

  t(key: string): string {
    return this.i18n.t(key);
  }

  toggle(): void {
    this.spaceTime.toggle();
  }

  reset(): void {
    this.spaceTime.resetClocks();
    this.world.clearLasers();
  }

  onScale(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.spaceTime.setTimeScale(value);
  }
}
