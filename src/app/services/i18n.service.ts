import { Injectable, computed, inject } from '@angular/core';
import { EN } from '../i18n/dictionaries/en';
import { RU } from '../i18n/dictionaries/ru';
import type { I18nKey } from '../i18n/i18n.keys';
import type { LocaleId } from '../i18n/locale.type';
import { UiStore } from '../state/ui.store';

const DICTS: Record<LocaleId, Record<I18nKey, string>> = {
  ru: RU,
  en: EN,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly ui = inject(UiStore);

  readonly locale = this.ui.locale.asReadonly();

  readonly dict = computed(() => DICTS[this.ui.locale()]);

  t(key: I18nKey | string, params?: Record<string, string | number>): string {
    // Read locale signal so templates calling t() re-render on language toggle.
    this.locale();
    const table = this.dict();
    let text = (table as Record<string, string>)[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replaceAll(`{{${k}}}`, String(v));
      }
    }
    return text;
  }

  setLocale(locale: LocaleId): void {
    this.ui.setLocale(locale);
  }

  toggle(): void {
    this.ui.toggleLocale();
  }
}
