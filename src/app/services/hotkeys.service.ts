import { Injectable, inject, OnDestroy } from '@angular/core';
import { BETA_PRESETS } from '../core/constants/ui.constants';
import { SpaceTimeService } from './space-time.service';
import { WorldService } from './world.service';
import { ScreenshotService } from './screenshot.service';
import { UiStore } from '../state/ui.store';

@Injectable({ providedIn: 'root' })
export class HotkeysService implements OnDestroy {
  private readonly spaceTime = inject(SpaceTimeService);
  private readonly world = inject(WorldService);
  private readonly screenshot = inject(ScreenshotService);
  private readonly ui = inject(UiStore);

  private bound = false;
  private readonly onKeyDown = (event: KeyboardEvent) => this.handle(event);

  init(): void {
    if (this.bound || typeof window === 'undefined') {
      return;
    }
    window.addEventListener('keydown', this.onKeyDown);
    this.bound = true;
  }

  ngOnDestroy(): void {
    if (this.bound) {
      window.removeEventListener('keydown', this.onKeyDown);
      this.bound = false;
    }
  }

  private handle(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    const isTextInput =
      tag === 'input' ||
      tag === 'textarea' ||
      target?.isContentEditable === true;

    if (event.key === 'Escape') {
      this.ui.setHotkeysOpen(false);
      return;
    }

    if (isTextInput) {
      if (event.code === 'Space' && tag !== 'input' && tag !== 'textarea') {
        // allow
      } else if (tag === 'input' || tag === 'textarea') {
        return;
      }
    }

    const key = event.key;

    if (event.code === 'Space') {
      event.preventDefault();
      this.spaceTime.toggle();
      return;
    }

    switch (key.toLowerCase()) {
      case 'r':
        this.spaceTime.resetClocks();
        this.world.clearLasers();
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4': {
        const idx = Number(key);
        const preset = BETA_PRESETS[idx];
        if (preset) {
          this.spaceTime.setBeta(preset.beta);
        }
        break;
      }
      case '[':
        this.spaceTime.nudgeBeta(-1);
        break;
      case ']':
        this.spaceTime.nudgeBeta(1);
        break;
      case 'f':
        this.world.fireLaser('forward');
        break;
      case 'b':
        this.world.fireLaser('backward');
        break;
      case 's':
        event.preventDefault();
        this.screenshot.captureActive();
        break;
      case 't':
        this.ui.toggleTheme();
        break;
      case 'g':
        this.ui.toggleLocale();
        break;
      case 'h':
        this.ui.toggleHotkeys();
        break;
      default:
        break;
    }
  }
}
