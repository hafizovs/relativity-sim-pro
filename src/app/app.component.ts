import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HotkeysHelpComponent } from './shared/hotkeys-help/hotkeys-help.component';
import { ToolbarComponent } from './core/layout/toolbar/toolbar.component';
import { HotkeysService } from './core/services/hotkeys.service';
import { RenderLoopService } from './core/services/render-loop.service';
import { WorldService } from './features/experiment-panel/world.service';
import { UiStore } from './core/ui/ui.store';

@Component({
  selector: 'rsp-root',
  imports: [ToolbarComponent, DashboardComponent, HotkeysHelpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly ui = inject(UiStore);
  private readonly hotkeys = inject(HotkeysService);
  private readonly loop = inject(RenderLoopService);
  private readonly world = inject(WorldService);

  constructor() {
    effect(() => {
      const theme = this.ui.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.dataset['theme'] = theme;
      }
    });
  }

  ngOnInit(): void {
    this.world.bootstrap();
    this.hotkeys.init();
    this.loop.start();
    if (typeof document !== 'undefined') {
      document.documentElement.dataset['theme'] = this.ui.theme();
    }
  }
}
