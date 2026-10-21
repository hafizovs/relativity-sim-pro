import { Injectable, inject } from '@angular/core';
import { UiStore } from '../ui/ui.store';

@Injectable({ providedIn: 'root' })
export class ScreenshotService {
  private readonly ui = inject(UiStore);
  private cockpitCanvas: HTMLCanvasElement | null = null;
  private observerCanvas: HTMLCanvasElement | null = null;

  registerCanvas(id: 'cockpit' | 'observer', canvas: HTMLCanvasElement | null): void {
    if (id === 'cockpit') {
      this.cockpitCanvas = canvas;
    } else {
      this.observerCanvas = canvas;
    }
  }

  captureActive(): void {
    const id = this.ui.activeCanvas();
    const canvas = id === 'observer' ? this.observerCanvas : this.cockpitCanvas;
    if (!canvas) {
      return;
    }
    this.capture(canvas);
  }

  capture(canvas: HTMLCanvasElement): void {
    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, 19);
      a.href = url;
      a.download = `relativity-sim-pro-${stamp}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
}
