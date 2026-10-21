import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAX_ACTIVE_LASERS } from '../../core/constants/space.constants';
import { I18nService } from '../../core/services/i18n.service';
import { WorldService } from './world.service';
import { WorldStore } from './world.store';

@Component({
  selector: 'rsp-experiment-panel',
  templateUrl: './experiment-panel.component.html',
  styleUrl: './experiment-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperimentPanelComponent {
  private readonly worldService = inject(WorldService);
  private readonly world = inject(WorldStore);
  private readonly i18n = inject(I18nService);

  readonly count = computed(() => this.world.lasers().length);
  readonly full = computed(() => this.count() >= MAX_ACTIVE_LASERS);

  t(key: string): string {
    return this.i18n.t(key);
  }

  fireForward(): void {
    this.worldService.fireLaser('forward');
  }

  fireBackward(): void {
    this.worldService.fireLaser('backward');
  }
}
