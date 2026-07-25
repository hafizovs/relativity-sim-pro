# 06 — UI Panels

Все панели — standalone-компоненты, OnPush, Signals, новый control flow. Тексты — только через `I18nService.t(key)`.

---

## 6.1 Toolbar

`features/toolbar/toolbar.component.*`

Элементы слева направо:
1. Brand: **RelativitySim Pro** (+ muted subtitle).
2. Beta presets (группа кнопок `0 / 0.5c / 0.9c / 0.99c / 0.999c`).
3. Spacer.
4. Theme toggle.
5. Language RU | EN.
6. Screenshot.
7. Hotkeys help.

Активный пресет: `aria-pressed=true`, визуальный accent.

---

## 6.2 Dashboard shell

`features/dashboard/dashboard.component.*`

Desktop layout (CSS grid):

```
grid-template-columns: 1fr 1fr minmax(280px, 320px);
grid-template-rows: 1fr auto;
```

- `cockpit` | `observer` | `telemetry`
- bottom bar spanning all columns: velocity + time player + experiments

Mobile (`max-width: 1099px`):
- tabs: Cockpit / Map / Telemetry
- bottom bar sticky.

---

## 6.3 Telemetry — бортовой компьютер

`features/telemetry/telemetry-panel.component.*`

Секции (не «карточки-статистика в hero», а консольный readout):

### Часы
| Readout | Source |
|---------|--------|
| Часы на Земле | `earthTimeSec` |
| Часы на Корабле | `shipTimeSec` |
| Отношение \(t_E / t_S\) | `timeRatio` |

Визуально: два крупных mono-значения + progress/bar отношение (Earth быстрее при β>0).

### Кинематика
| Readout | Format |
|---------|--------|
| \(v/c\) | `0.990c` (3 знака) |
| \(v\) | world units/s |
| \(\gamma\) | 4 значащих |
| \(m_0\) | fixed |
| \(m\gamma\) | 4 значащих |
| \(L/L_0\) | `1/gamma` |

### Статус
- Playing / Paused
- Active lasers count
- Короткая подсказка текущего эффекта (i18n): при β≈0 «Ньютоновский режим»; при β>0.9 «Сильно релятивистский режим».

Все значения — `computed` из store; шаблон только отображает.

---

## 6.4 Velocity controls

`features/velocity-controls/velocity-controls.component.*`

1. `<input type="range" min="0" max="0.999" step="0.001">` связан с `beta`.
2. Числовой readout рядом (editable number input опционально; если есть — clamp).
3. Метка «Скорость корабля».
4. Live \(\gamma\) chip рядом со слайдером (не поверх canvas).

`model()` или `(input)` → `spaceTime.setBeta`.

---

## 6.5 Time player

`features/time-player/time-player.component.*`

Кнопки:
- Play / Pause (`aria-pressed`)
- Reset clocks
- Optional: timeScale select `0.25x 1x 2x 4x 8x 16x`

Не путать Reset clocks с Reset beta.

---

## 6.6 Experiment panel

`features/experiment-panel/experiment-panel.component.*`

Кнопки:
1. **Выстрелить лазером вперёд** → `world.fireLaser('forward')`
2. **Выстрелить лазером назад** → `world.fireLaser('backward')`

Короткий help-text (i18n):  
«В системе покоя планет скорость обоих лучей равна \(c\); меняется частота/цвет.»

Индикатор: число активных импульсов; disable, если `MAX_ACTIVE_LASERS`.

---

## 6.7 Hotkeys help overlay

`features/hotkeys-help/*`

Модальный overlay со списком из [01-product-vision.md](01-product-vision.md) §1.5. Закрытие: Esc, кнопка, клик по backdrop.

---

## 6.8 Стили панелей

- Фон панелей: `var(--rsp-bg-panel)`, border `var(--rsp-border)`.
- Readouts: `var(--rsp-font-mono)`.
- Акцент кнопок primary: cyan; danger для лазера назад допустим redshift color.
- Не использовать Tailwind utility-классы.
- SCSS модули компонентов + глобальные CSS variables.

---

## 6.9 Связь с AppComponent

`app.component.html`:

```html
<rsp-toolbar />
<rsp-dashboard />
@if (ui.hotkeysOpen()) {
  <rsp-hotkeys-help />
}
```

`AppComponent` инициализирует `HotkeysService`, theme `effect` на `document.documentElement.dataset.theme`.
