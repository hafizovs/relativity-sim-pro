import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatRatio } from '../../domain/relativity/format-relativity';
import { CockpitViewComponent } from '../cockpit-view/cockpit-view.component';
import { ExperimentPanelComponent } from '../experiment-panel/experiment-panel.component';
import { ObserverViewComponent } from '../observer-view/observer-view.component';
import { TelemetryPanelComponent } from '../telemetry/telemetry-panel.component';
import { TimePlayerComponent } from '../time-player/time-player.component';
import { VelocityControlsComponent } from '../velocity-controls/velocity-controls.component';
import { I18nService } from '../../core/services/i18n.service';
import { SpaceTimeStore } from '../velocity-controls/space-time.store';
import { UiStore } from '../../core/ui/ui.store';
import type { MobileTabId } from '../../core/models/relativity.types';

@Component({
  selector: 'rsp-dashboard',
  imports: [
    CockpitViewComponent,
    ObserverViewComponent,
    TelemetryPanelComponent,
    VelocityControlsComponent,
    TimePlayerComponent,
    ExperimentPanelComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly ui = inject(UiStore);
  private readonly spaceTime = inject(SpaceTimeStore);
  private readonly i18n = inject(I18nService);

  readonly mobileTab = this.ui.mobileTab;
  readonly twinHud = computed(() =>
    this.i18n.t('bottom.twinHud', {
      ratio: formatRatio(this.spaceTime.metrics().timeRatio),
    }),
  );

  t(key: string): string {
    return this.i18n.t(key);
  }

  setTab(tab: MobileTabId): void {
    this.ui.setMobileTab(tab);
  }
}
