import { Injectable, signal } from '@angular/core';
import { LOCALE_DEFAULT, THEME_DEFAULT } from '../core/constants/ui.constants';
import type { ActiveCanvasId, MobileTabId } from '../core/models/relativity.types';
import type { LocaleId } from '../core/models/locale.model';
import type { ThemeId } from '../core/models/theme.model';

@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly theme = signal<ThemeId>(THEME_DEFAULT);
  readonly locale = signal<LocaleId>(LOCALE_DEFAULT);
  readonly hotkeysOpen = signal(false);
  readonly activeCanvas = signal<ActiveCanvasId>('cockpit');
  readonly mobileTab = signal<MobileTabId>('cockpit');
  readonly observerZoom = signal(1);

  setTheme(theme: ThemeId): void {
    this.theme.set(theme);
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setLocale(locale: LocaleId): void {
    this.locale.set(locale);
  }

  toggleLocale(): void {
    this.locale.update((l) => (l === 'ru' ? 'en' : 'ru'));
  }

  setHotkeysOpen(open: boolean): void {
    this.hotkeysOpen.set(open);
  }

  toggleHotkeys(): void {
    this.hotkeysOpen.update((v) => !v);
  }

  setActiveCanvas(id: ActiveCanvasId): void {
    this.activeCanvas.set(id);
  }

  setMobileTab(tab: MobileTabId): void {
    this.mobileTab.set(tab);
    if (tab === 'cockpit' || tab === 'observer') {
      this.activeCanvas.set(tab);
    }
  }

  setObserverZoom(zoom: number): void {
    this.observerZoom.set(zoom);
  }
}
