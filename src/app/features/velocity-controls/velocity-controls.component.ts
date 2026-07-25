import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BETA_MAX, BETA_MIN, BETA_STEP } from '../../core/constants/physics.constants';
import { formatBeta, formatGamma } from '../../domain/relativity/format-relativity';
import { I18nService } from '../../services/i18n.service';
import { SpaceTimeService } from '../../services/space-time.service';

@Component({
  selector: 'rsp-velocity-controls',
  templateUrl: './velocity-controls.component.html',
  styleUrl: './velocity-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VelocityControlsComponent {
  private readonly spaceTime = inject(SpaceTimeService);
  private readonly i18n = inject(I18nService);

  readonly min = BETA_MIN;
  readonly max = BETA_MAX;
  readonly step = BETA_STEP;
  readonly beta = this.spaceTime.beta;
  readonly gamma = this.spaceTime.gamma;

  readonly betaText = computed(() => formatBeta(this.beta()));
  readonly gammaText = computed(() => formatGamma(this.gamma()));
  readonly valueText = computed(() => `β=${this.betaText()}, γ=${this.gammaText()}`);

  t(key: string): string {
    return this.i18n.t(key);
  }

  onInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.spaceTime.setBeta(value);
  }

  onNumber(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value)) {
      this.spaceTime.setBeta(value);
    }
  }

  resetSpeed(): void {
    this.spaceTime.setBeta(0);
  }
}
