# 02 — Architecture (Angular 22+)

Создай приложение строго по этой архитектуре. Не сваливай формулы СТО в компоненты. Не используй NgRx/Akita — только Signals stores.

---

## 2.1 Стек и bootstrap

1. Создай проект Angular **latest stable ≥ 22**, standalone, SCSS, **без SSR**, без routing (предпочтительно **без** `@angular/router`).
2. Включи **zoneless** (дефолт новых приложений). Не добавляй `zone.js` обратно.
3. Prefix: `rsp`.
4. Точка входа: `main.ts` → `bootstrapApplication(AppComponent, appConfig)`.
5. `app.config.ts`: `provideZonelessChangeDetection()` (или эквивалент актуального API), никаких обязательных `provideAnimations` (анимации панелей — CSS).

---

## 2.2 Дерево каталогов (обязательное)

```
src/
  index.html
  main.ts
  styles.scss
  app/
    app.component.ts
    app.component.html
    app.component.scss
    app.config.ts

    core/
      constants/
        physics.constants.ts
        space.constants.ts
        render.constants.ts
        time.constants.ts
        ui.constants.ts
      models/
        star.model.ts
        planet.model.ts
        ship.model.ts
        laser-pulse.model.ts
        relativity-metrics.model.ts
        vec2.model.ts
        rgb.model.ts
        simulation-clock.model.ts
        app-phase.model.ts
        theme.model.ts
        locale.model.ts
        beta-preset.model.ts
        relativity.types.ts          # barrel re-exports (алиас из наработок)

    domain/
      relativity/
        lorentz-factor.ts
        time-dilation.ts
        length-contraction.ts
        aberration.ts
        doppler.ts
        frequency-to-rgb.ts
        laser-kinematics.ts
        format-relativity.ts
      space/
        starfield-generator.ts
        planet-catalog.ts
        world-step.ts

    state/
      simulation.store.ts
      space-time.store.ts
      world.store.ts
      ui.store.ts

    services/
      lorentz-math.service.ts        # обязательное имя из наработок
      space-time.service.ts          # обязательное имя из наработок
      world.service.ts
      render-loop.service.ts
      screenshot.service.ts
      hotkeys.service.ts
      i18n.service.ts

    features/
      toolbar/
        toolbar.component.ts
        toolbar.component.html
        toolbar.component.scss
      dashboard/
        dashboard.component.ts
        dashboard.component.html
        dashboard.component.scss
      cockpit-view/
        cockpit-view.component.ts
        cockpit-view.component.html
        cockpit-view.component.scss
        cockpit-canvas.renderer.ts
      observer-view/
        observer-view.component.ts
        observer-view.component.html
        observer-view.component.scss
        observer-canvas.renderer.ts
      telemetry/
        telemetry-panel.component.ts
        telemetry-panel.component.html
        telemetry-panel.component.scss
      velocity-controls/
        velocity-controls.component.ts
        velocity-controls.component.html
        velocity-controls.component.scss
      experiment-panel/
        experiment-panel.component.ts
        experiment-panel.component.html
        experiment-panel.component.scss
      time-player/
        time-player.component.ts
        time-player.component.html
        time-player.component.scss
      hotkeys-help/
        hotkeys-help.component.ts
        hotkeys-help.component.html
        hotkeys-help.component.scss

    i18n/
      locale.type.ts
      i18n.keys.ts
      dictionaries/
        ru.ts
        en.ts

  # tests рядом с domain:
  app/domain/relativity/lorentz-factor.spec.ts
  app/domain/relativity/time-dilation.spec.ts
  app/domain/relativity/length-contraction.spec.ts
  app/domain/relativity/aberration.spec.ts
  app/domain/relativity/doppler.spec.ts
  app/domain/relativity/laser-kinematics.spec.ts
```

Имена могут отличаться суффиксами `.ts`, но **набор ответственности** обязателен. Не склеивай physics + оба canvas + UI в один файл на 3000 строк.

**Алиасы из наработок пользователя (обязательная семантика):**

| Наработка | Куда маппится |
|-----------|----------------|
| `src/app/models/relativity.types.ts` | `core/models/**` + barrel `relativity.types.ts` |
| `lorentz-math.service.ts` | `services/lorentz-math.service.ts` (+ чистые функции в `domain/relativity/**`) |
| `space-time.service.ts` | `services/space-time.service.ts` + `state/space-time.store.ts` |
| `cockpit-view.component.ts` | `features/cockpit-view/**` |
| `observer-view.component.ts` | `features/observer-view/**` |
| `dashboard.component.ts` | `features/dashboard/**` |

---

## 2.3 Потоки данных (Signals)

```
[VelocityControls / presets / hotkeys]
        │
        ▼
 space-time.store  ──β──►  lorentz-math (computed γ, metrics)
        │                         │
        │                         ▼
        │                  world.store (stars, planets, lasers)
        │                         │
        ▼                         ▼
 space-time.service ◄──── render-loop.service (rAF)
   Earth clock / Ship clock       │
        │                         ├─► cockpit renderer (aberration+Doppler)
        │                         └─► observer renderer (length contraction)
        ▼
 telemetry-panel (read signals only)
```

Правила:
1. **UI читает** `signal` / `computed`, **не** пишет физику напрямую.
2. Изменение \(\beta\) → мгновенный пересчёт \(\gamma\), \(L\), Doppler factors через `computed`.
3. Часы тикают в `SpaceTimeService` через `requestAnimationFrame` или общий `RenderLoopService`.
4. Canvas-компоненты подписываются через `effect()` на нужные signals и перерисовывают кадр; либо единый rAF читает snapshot состояния.
5. Запрещено дублировать \(\gamma\) в трёх местах разными формулами — единый источник: `LorentzMathService` / `domain/relativity/lorentz-factor.ts`.

---

## 2.4 Ответственность сервисов

### `LorentzMathService`
Чистая физика. Без DOM, без Canvas, без rAF.

```ts
@Injectable({ providedIn: 'root' })
export class LorentzMathService {
  beta(v: number, c: number): number;
  gamma(beta: number): number;
  dilateStaticTime(deltaShip: number, gamma: number): number;
  contractLength(properLength: number, gamma: number): number;
  aberrateAngle(thetaEmitted: number, beta: number): number;
  aberrateDirection(dirX: number, dirY: number, beta: number): { x: number; y: number };
  dopplerFactorHeadOn(beta: number, approaching: boolean): number;
  dopplerFactorGeneral(beta: number, cosThetaObserved: number): number;
  shiftFrequency(nuEmitted: number, factor: number): number;
  frequencyToRgb(nuHz: number): { r: number; g: number; b: number; visible: boolean };
  relativisticMass(restMass: number, gamma: number): number;
}
```

Реализация делегирует в `domain/relativity/*`.

### `SpaceTimeService`
Управление временем и скоростью на Signals.

```ts
@Injectable({ providedIn: 'root' })
export class SpaceTimeService {
  readonly beta: Signal<number>;
  readonly gamma: Signal<number>;
  readonly earthTimeSec: Signal<number>;
  readonly shipTimeSec: Signal<number>;
  readonly isPlaying: Signal<boolean>;
  readonly metrics: Signal<RelativityMetrics>;

  setBeta(beta: number): void;
  play(): void;
  pause(): void;
  toggle(): void;
  resetClocks(): void;
  tick(dtRealSec: number): void;
}
```

На каждом `tick`:
- \(\Delta t_{\mathrm{ship}} = \mathrm{dtRealSec}\) (или с time-scale multiplier),
- \(\Delta t_{\mathrm{Earth}} = \gamma \cdot \Delta t_{\mathrm{ship}}\),
- накопление обоих счётчиков.

### `WorldService`
Генерация/хранение звёзд, планет, лазерных импульсов; шаг движения лучей со скоростью \(c\).

### `RenderLoopService`
Единый `requestAnimationFrame`: вызывает `spaceTime.tick`, `world.stepLasers`, уведомляет рендереры (или рендереры сами в своих `effect`/`rAF` — выбери **один** подход и зафиксируй: **единый RenderLoopService**).

---

## 2.5 Компоненты — границы

| Компонент | Делает | Не делает |
|-----------|--------|-----------|
| `DashboardComponent` | layout колонок, вкладки mobile | формулы |
| `CockpitViewComponent` | canvas, resize, rAF draw call | хранение \(\beta\) |
| `ObserverViewComponent` | canvas карты | расчёт \(\gamma\) локально «на глаз» |
| `TelemetryPanelComponent` | вывод signals | мутация времени |
| `VelocityControlsComponent` | slider + presets → `setBeta` | — |
| `ExperimentPanelComponent` | fire laser forward/back | кинематика \(c\) в шаблоне |
| `TimePlayerComponent` | play/pause/reset | — |
| `ToolbarComponent` | brand, theme, lang, screenshot, help | — |

---

## 2.6 Производительность

1. Звёздное поле: `STAR_COUNT` из Appendix A (по умолчанию 800–1200); не пересоздавать массив каждый кадр.
2. Аберрация/Доплер — per-star за кадр; допустимо. При необходимости — TypedArrays (`Float32Array` для x/y/ν).
3. DPR: `Math.min(devicePixelRatio, MAX_DPR)`.
4. Не триггерить лишний CD: обновление canvas через rAF, не через `setInterval` + тысячи signal writes на звезду.
5. Signals пишутся на тике часов / смене \(\beta\) / лазерах — не на каждую звезду.

---

## 2.7 README

`README.md` в корне приложения должен содержать:
- install / start / test;
- краткое описание эффектов СТО;
- disclaimer: образовательная визуализация СТО в 2D, не замена учебнику / полной релятивистской оптике;
- hotkeys;
- префикс `rsp`.
