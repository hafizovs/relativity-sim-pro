import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  formatBeta,
  formatGamma,
  formatMass,
  formatRatio,
  formatTimeSec,
} from '../../domain/relativity/format-relativity';
import { I18nService } from '../../services/i18n.service';
import { SimulationStore } from '../../state/simulation.store';
import { SpaceTimeStore } from '../../state/space-time.store';
import { WorldStore } from '../../state/world.store';

@Component({
  selector: 'rsp-telemetry-panel',
  templateUrl: './telemetry-panel.component.html',
  styleUrl: './telemetry-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelemetryPanelComponent {
  private readonly spaceTime = inject(SpaceTimeStore);
  private readonly simulation = inject(SimulationStore);
  private readonly world = inject(WorldStore);
  private readonly i18n = inject(I18nService);

  readonly metrics = this.spaceTime.metrics;
  readonly isPlaying = this.simulation.isPlaying;
  readonly laserCount = computed(() => this.world.lasers().length);

  readonly earthText = computed(() => formatTimeSec(this.metrics().earthTimeSec));
  readonly shipText = computed(() => formatTimeSec(this.metrics().shipTimeSec));
  readonly ratioText = computed(() => formatRatio(this.metrics().timeRatio));
  readonly betaText = computed(() => formatBeta(this.metrics().beta));
  readonly gammaText = computed(() => formatGamma(this.metrics().gamma));
  readonly relMassText = computed(() => formatMass(this.metrics().relativisticMass));
  readonly lengthRatioText = computed(() =>
    formatRatio(this.metrics().contractedShipLength / this.metrics().properShipLength),
  );
  readonly velocityText = computed(() => `${this.metrics().velocity.toFixed(1)} wu/s`);

  readonly modeText = computed(() => {
    const b = this.metrics().beta;
    if (b < 0.05) {
      return this.i18n.t('telemetry.modeNewtonian');
    }
    if (b < 0.9) {
      return this.i18n.t('telemetry.modeMild');
    }
    return this.i18n.t('telemetry.modeStrong');
  });

  readonly twinHint = computed(() =>
    this.i18n.t('telemetry.twinHint', { gamma: this.gammaText() }),
  );

  readonly ratioBar = computed(() => {
    const r = this.metrics().timeRatio;
    return Math.min(100, Math.max(4, (Math.log10(r + 1) / Math.log10(25)) * 100));
  });

  t(key: string): string {
    return this.i18n.t(key);
  }
}
