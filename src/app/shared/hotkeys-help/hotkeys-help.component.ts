import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { UiStore } from '../../core/ui/ui.store';

@Component({
  selector: 'rsp-hotkeys-help',
  templateUrl: './hotkeys-help.component.html',
  styleUrl: './hotkeys-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeysHelpComponent {
  private readonly ui = inject(UiStore);
  private readonly i18n = inject(I18nService);

  readonly rows = [
    { keys: 'Space', labelKey: 'hotkeys.space' },
    { keys: 'R', labelKey: 'hotkeys.r' },
    { keys: '0–4', labelKey: 'hotkeys.presets' },
    { keys: '[ ]', labelKey: 'hotkeys.brackets' },
    { keys: 'F', labelKey: 'hotkeys.f' },
    { keys: 'B', labelKey: 'hotkeys.b' },
    { keys: 'S', labelKey: 'hotkeys.s' },
    { keys: 'T', labelKey: 'hotkeys.t' },
    { keys: 'G', labelKey: 'hotkeys.g' },
    { keys: 'H', labelKey: 'hotkeys.h' },
    { keys: 'Esc', labelKey: 'hotkeys.esc' },
  ] as const;

  t(key: string): string {
    return this.i18n.t(key);
  }

  close(): void {
    this.ui.setHotkeysOpen(false);
  }
}
