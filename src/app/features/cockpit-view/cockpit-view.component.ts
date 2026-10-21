import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  inject,
  viewChild,
} from '@angular/core';
import { MAX_DPR } from '../../core/constants/render.constants';
import { I18nService } from '../../core/services/i18n.service';
import { RenderLoopService } from '../../core/services/render-loop.service';
import { ScreenshotService } from '../../core/services/screenshot.service';
import { SpaceTimeStore } from '../velocity-controls/space-time.store';
import { UiStore } from '../../core/ui/ui.store';
import { WorldStore } from '../experiment-panel/world.store';
import { drawCockpitFrame } from './cockpit-canvas.renderer';

@Component({
  selector: 'rsp-cockpit-view',
  templateUrl: './cockpit-view.component.html',
  styleUrl: './cockpit-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CockpitViewComponent implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly i18n = inject(I18nService);
  private readonly world = inject(WorldStore);
  private readonly spaceTime = inject(SpaceTimeStore);
  private readonly ui = inject(UiStore);
  private readonly loop = inject(RenderLoopService);
  private readonly screenshot = inject(ScreenshotService);

  private ctx: CanvasRenderingContext2D | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private unregister: (() => void) | null = null;
  private cssW = 0;
  private cssH = 0;

  label(): string {
    return this.i18n.t('a11y.cockpitCanvas');
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d');
    this.screenshot.registerCanvas('cockpit', canvas);
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      this.cssW = entry.contentRect.width;
      this.cssH = entry.contentRect.height;
      this.resizeCanvas();
    });
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.unregister = this.loop.registerDrawer(() => this.draw());
  }

  ngOnDestroy(): void {
    this.unregister?.();
    this.resizeObserver?.disconnect();
    this.screenshot.registerCanvas('cockpit', null);
  }

  onFocus(): void {
    this.ui.setActiveCanvas('cockpit');
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    if (this.cssW <= 0 || this.cssH <= 0) {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.floor(this.cssW * dpr);
    canvas.height = Math.floor(this.cssH * dpr);
    canvas.style.width = `${this.cssW}px`;
    canvas.style.height = `${this.cssH}px`;
    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  private draw(): void {
    if (!this.ctx || this.cssW <= 0 || this.cssH <= 0) {
      return;
    }
    drawCockpitFrame(this.ctx, {
      width: this.cssW,
      height: this.cssH,
      stars: this.world.stars(),
      planets: this.world.planets(),
      ship: this.world.ship(),
      lasers: this.world.lasers(),
      metrics: this.spaceTime.metrics(),
    });
  }
}
