# 08 — File Checklist

Генератор **обязан** создать каждый файл из списка. Отмечай мысленно ☑. Пропуск файла = провал DoD.

Рядом с путём — краткое содержание (1–2 предложения). Код внутри файла — **полный**, без сокращений.

---

## 8.1 Project root / Angular scaffold

| # | Path | Content |
|---|------|---------|
| 1 | `package.json` | Имя `relativity-sim-pro`, scripts start/build/test |
| 2 | `angular.json` | project config, styles `src/styles.scss` |
| 3 | `tsconfig.json` | base TS config |
| 4 | `tsconfig.app.json` | app TS config |
| 5 | `tsconfig.spec.json` | spec TS config |
| 6 | `src/index.html` | title RelativitySim Pro, fonts IBM Plex, root element |
| 7 | `src/main.ts` | bootstrapApplication |
| 8 | `src/styles.scss` | CSS variables themes, reset, body full viewport |
| 9 | `README.md` | install/start/test, hotkeys, SR disclaimer |

---

## 8.2 App shell

| # | Path | Content |
|---|------|---------|
| 10 | `src/app/app.config.ts` | zoneless providers |
| 11 | `src/app/app.component.ts` | shell + hotkeys init + theme effect |
| 12 | `src/app/app.component.html` | toolbar + dashboard + hotkeys help |
| 13 | `src/app/app.component.scss` | shell layout |

---

## 8.3 Core constants

| # | Path | Content |
|---|------|---------|
| 14 | `src/app/core/constants/physics.constants.ts` | C, BETA_*, GAMMA_EPS, rest mass |
| 15 | `src/app/core/constants/space.constants.ts` | stars, planets, sector, ship sizes |
| 16 | `src/app/core/constants/render.constants.ts` | DPR, focal, colors, grid |
| 17 | `src/app/core/constants/time.constants.ts` | timeScale range, defaults |
| 18 | `src/app/core/constants/ui.constants.ts` | layout widths, presets list |

---

## 8.4 Core models

| # | Path | Content |
|---|------|---------|
| 19 | `src/app/core/models/vec2.model.ts` | Vec2 |
| 20 | `src/app/core/models/rgb.model.ts` | RgbColor, RgbVisibility |
| 21 | `src/app/core/models/star.model.ts` | Star, ObservedStar |
| 22 | `src/app/core/models/planet.model.ts` | Planet |
| 23 | `src/app/core/models/ship.model.ts` | ShipState |
| 24 | `src/app/core/models/laser-pulse.model.ts` | LaserPulse, LaserDirection |
| 25 | `src/app/core/models/relativity-metrics.model.ts` | RelativityMetrics |
| 26 | `src/app/core/models/simulation-clock.model.ts` | SimulationClockState |
| 27 | `src/app/core/models/app-phase.model.ts` | AppPhase |
| 28 | `src/app/core/models/theme.model.ts` | ThemeId |
| 29 | `src/app/core/models/locale.model.ts` | LocaleId |
| 30 | `src/app/core/models/beta-preset.model.ts` | BetaPreset |
| 31 | `src/app/core/models/relativity.types.ts` | barrel re-exports |

---

## 8.5 Domain relativity

| # | Path | Content |
|---|------|---------|
| 32 | `src/app/domain/relativity/lorentz-factor.ts` | beta clamp, gamma |
| 33 | `src/app/domain/relativity/time-dilation.ts` | dilateStaticTime |
| 34 | `src/app/domain/relativity/length-contraction.ts` | contractLength |
| 35 | `src/app/domain/relativity/aberration.ts` | angle + direction |
| 36 | `src/app/domain/relativity/doppler.ts` | head-on + general |
| 37 | `src/app/domain/relativity/frequency-to-rgb.ts` | ν→RGB + visibility |
| 38 | `src/app/domain/relativity/laser-kinematics.ts` | create/step pulses at c |
| 39 | `src/app/domain/relativity/format-relativity.ts` | format β, γ, times |

---

## 8.6 Domain space

| # | Path | Content |
|---|------|---------|
| 40 | `src/app/domain/space/starfield-generator.ts` | seeded stars |
| 41 | `src/app/domain/space/planet-catalog.ts` | 4 planets |
| 42 | `src/app/domain/space/world-step.ts` | ship integrate + lasers step |

---

## 8.7 Domain tests

| # | Path | Content |
|---|------|---------|
| 43 | `src/app/domain/relativity/lorentz-factor.spec.ts` | γ tests |
| 44 | `src/app/domain/relativity/time-dilation.spec.ts` | dilation tests |
| 45 | `src/app/domain/relativity/length-contraction.spec.ts` | contraction tests |
| 46 | `src/app/domain/relativity/aberration.spec.ts` | aberration tests |
| 47 | `src/app/domain/relativity/doppler.spec.ts` | Doppler tests |
| 48 | `src/app/domain/relativity/laser-kinematics.spec.ts` | c postulate tests |

---

## 8.8 State

| # | Path | Content |
|---|------|---------|
| 49 | `src/app/state/simulation.store.ts` | playing, timeScale, phase |
| 50 | `src/app/state/space-time.store.ts` | beta, clocks, metrics computed |
| 51 | `src/app/state/world.store.ts` | stars, planets, ship, lasers |
| 52 | `src/app/state/ui.store.ts` | theme, locale, hotkeys, activeCanvas, mobile tab |

---

## 8.9 Services

| # | Path | Content |
|---|------|---------|
| 53 | `src/app/services/lorentz-math.service.ts` | physics façade |
| 54 | `src/app/services/space-time.service.ts` | beta + clocks + tick |
| 55 | `src/app/services/world.service.ts` | bootstrap world, fireLaser, step |
| 56 | `src/app/services/render-loop.service.ts` | single rAF loop |
| 57 | `src/app/services/screenshot.service.ts` | PNG export |
| 58 | `src/app/services/hotkeys.service.ts` | keyboard map |
| 59 | `src/app/services/i18n.service.ts` | t(key), locale signal |

---

## 8.10 Features — toolbar & dashboard

| # | Path | Content |
|---|------|---------|
| 60 | `src/app/features/toolbar/toolbar.component.ts` | logic |
| 61 | `src/app/features/toolbar/toolbar.component.html` | template |
| 62 | `src/app/features/toolbar/toolbar.component.scss` | styles |
| 63 | `src/app/features/dashboard/dashboard.component.ts` | layout shell |
| 64 | `src/app/features/dashboard/dashboard.component.html` | grid + mobile tabs |
| 65 | `src/app/features/dashboard/dashboard.component.scss` | responsive layout |

---

## 8.11 Features — cockpit & observer

| # | Path | Content |
|---|------|---------|
| 66 | `src/app/features/cockpit-view/cockpit-view.component.ts` | canvas host |
| 67 | `src/app/features/cockpit-view/cockpit-view.component.html` | canvas element |
| 68 | `src/app/features/cockpit-view/cockpit-view.component.scss` | fill panel |
| 69 | `src/app/features/cockpit-view/cockpit-canvas.renderer.ts` | aberration+Doppler draw |
| 70 | `src/app/features/observer-view/observer-view.component.ts` | canvas host |
| 71 | `src/app/features/observer-view/observer-view.component.html` | canvas element |
| 72 | `src/app/features/observer-view/observer-view.component.scss` | fill panel |
| 73 | `src/app/features/observer-view/observer-canvas.renderer.ts` | map + length contraction |

---

## 8.12 Features — controls & telemetry

| # | Path | Content |
|---|------|---------|
| 74 | `src/app/features/telemetry/telemetry-panel.component.ts` | readouts |
| 75 | `src/app/features/telemetry/telemetry-panel.component.html` | template |
| 76 | `src/app/features/telemetry/telemetry-panel.component.scss` | console styles |
| 77 | `src/app/features/velocity-controls/velocity-controls.component.ts` | slider |
| 78 | `src/app/features/velocity-controls/velocity-controls.component.html` | template |
| 79 | `src/app/features/velocity-controls/velocity-controls.component.scss` | styles |
| 80 | `src/app/features/time-player/time-player.component.ts` | play/pause/reset |
| 81 | `src/app/features/time-player/time-player.component.html` | template |
| 82 | `src/app/features/time-player/time-player.component.scss` | styles |
| 83 | `src/app/features/experiment-panel/experiment-panel.component.ts` | lasers UI |
| 84 | `src/app/features/experiment-panel/experiment-panel.component.html` | template |
| 85 | `src/app/features/experiment-panel/experiment-panel.component.scss` | styles |
| 86 | `src/app/features/hotkeys-help/hotkeys-help.component.ts` | overlay |
| 87 | `src/app/features/hotkeys-help/hotkeys-help.component.html` | template |
| 88 | `src/app/features/hotkeys-help/hotkeys-help.component.scss` | styles |

---

## 8.13 i18n

| # | Path | Content |
|---|------|---------|
| 89 | `src/app/i18n/locale.type.ts` | LocaleId re-export / type |
| 90 | `src/app/i18n/i18n.keys.ts` | key union or const map |
| 91 | `src/app/i18n/dictionaries/ru.ts` | полный RU словарь |
| 92 | `src/app/i18n/dictionaries/en.ts` | полный EN словарь |

---

## 8.14 Допустимые дополнительные файлы

Разрешены: `public/favicon.ico`, environment stubs, `vitest.config` / `jest.config` по CLI, helper `math.util.ts`, `seeded-rng.ts`.  
**Нельзя** заменять обязательные файлы «одним mega-component».

Минимум файлов из таблицы: **92**. Если CLI создаёт лишние (`app.routes.ts`) — удали routing или не используй.

---

## 8.15 Сверка с наработками пользователя

Обязательная семантика сохранена:

| Наработка | Статус в чеклисте |
|-----------|-------------------|
| `relativity.types.ts` | #31 |
| `lorentz-math.service.ts` | #53 |
| `space-time.service.ts` | #54 |
| `cockpit-view` | #66–69 |
| `observer-view` | #70–73 |
| `dashboard` | #63–65 |
