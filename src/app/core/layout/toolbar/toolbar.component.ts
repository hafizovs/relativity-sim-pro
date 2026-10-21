import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BETA_PRESETS } from '../../constants/ui.constants';
import { I18nService } from '../../services/i18n.service';
import { ScreenshotService } from '../../services/screenshot.service';
import { SpaceTimeService } from '../../../features/velocity-controls/space-time.service';
import { UiStore } from '../../ui/ui.store';

@Component({
  selector: 'rsp-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  private readonly spaceTime = inject(SpaceTimeService);
  private readonly ui = inject(UiStore);
  private readonly i18n = inject(I18nService);
  private readonly screenshot = inject(ScreenshotService);

  readonly presets = BETA_PRESETS;
  readonly beta = this.spaceTime.beta;
  readonly theme = this.ui.theme;
  readonly locale = this.ui.locale;

  readonly subtitle = computed(() => this.i18n.t('app.subtitle'));
  readonly themeLabel = computed(() =>
    this.i18n.t(this.theme() === 'dark' ? 'theme.dark' : 'theme.light'),
  );

  t(key: string): string {
    return this.i18n.t(key);
  }

  applyPreset(beta: number): void {
    this.spaceTime.setBeta(beta);
  }

  isPresetActive(beta: number): boolean {
    return Math.abs(this.beta() - beta) < 1e-9;
  }

  toggleTheme(): void {
    this.ui.toggleTheme();
  }

  toggleLang(): void {
    this.i18n.toggle();
  }

  takeScreenshot(): void {
    this.screenshot.captureActive();
  }

  openHotkeys(): void {
    this.ui.setHotkeysOpen(true);
  }
}
