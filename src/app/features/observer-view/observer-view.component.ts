import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import {
  MAX_DPR,
  OBSERVER_ZOOM_MAX,
  OBSERVER_ZOOM_MIN,
} from '../../core/constants/render.constants';
import { I18nService } from '../../services/i18n.service';
import { RenderLoopService } from '../../services/render-loop.service';
import { ScreenshotService } from '../../services/screenshot.service';
import { SpaceTimeStore } from '../../state/space-time.store';
import { UiStore } from '../../state/ui.store';
import { WorldStore } from '../../state/world.store';
import { drawObserverFrame } from './observer-canvas.renderer';

@Component({
  selector: 'rsp-observer-view',
  templateUrl: './observer-view.component.html',
  styleUrl: './observer-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObserverViewComponent implements AfterViewInit, OnDestroy {
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
    return this.i18n.t('a11y.observerCanvas');
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d');
    this.screenshot.registerCanvas('observer', canvas);
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
    this.screenshot.registerCanvas('observer', null);
  }

  onFocus(): void {
    this.ui.setActiveCanvas('observer');
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoom = this.ui.observerZoom();
    const next = Math.min(
      OBSERVER_ZOOM_MAX,
      Math.max(OBSERVER_ZOOM_MIN, zoom * (event.deltaY < 0 ? 1.08 : 0.92)),
    );
    this.ui.setObserverZoom(next);
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
    drawObserverFrame(this.ctx, {
      width: this.cssW,
      height: this.cssH,
      planets: this.world.planets(),
      ship: this.world.ship(),
      lasers: this.world.lasers(),
      metrics: this.spaceTime.metrics(),
      zoom: this.ui.observerZoom(),
    });
  }
}
