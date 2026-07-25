# Appendix A — Defaults & Constants

Все константы вынеси в `src/app/core/constants/*.ts`. Значения ниже — закон по умолчанию; менять можно только согласованно с тестами.

---

## A.1 Физика / скорость света

| Constant | Value | File |
|----------|-------|------|
| `C` | `1000` | `physics.constants.ts` |
| Unit of `C` | world units / second | — |
| `BETA_MIN` | `0` | |
| `BETA_MAX` | `0.999` | |
| `BETA_DEFAULT` | `0` | |
| `BETA_STEP` | `0.001` | hotkeys `[` `]` |
| `GAMMA_EPS` | `1e-12` | floor for `1 - β²` |
| `REST_MASS_DEFAULT` | `1` | условные единицы |
| `SHIP_PROPER_LENGTH` | `80` | world units |
| `SHIP_PROPER_HEIGHT` | `24` | world units |

Педагогический масштаб: \(c = 1000\) px/s (world units/s) согласован с наработками. Реальное \(c\) не требуется.

---

## A.2 Пресеты β

| id | beta | label RU | label EN |
|----|------|----------|----------|
| `rest` | `0` | `0c` | `0c` |
| `half` | `0.5` | `0.5c` | `0.5c` |
| `nine` | `0.9` | `0.9c` | `0.9c` |
| `twin` | `0.99` | `0.99c` | `0.99c` |
| `extreme` | `0.999` | `0.999c` | `0.999c` |

Эталон \(\gamma\):
- 0.5 → \(\gamma \approx 1.1547\)
- 0.9 → \(\gamma \approx 2.2943\)
- 0.99 → \(\gamma \approx 7.0888\)
- 0.999 → \(\gamma \approx 22.3663\)

---

## A.3 Время

| Constant | Value |
|----------|-------|
| `TIME_SCALE_DEFAULT` | `1` |
| `TIME_SCALE_MIN` | `0.25` |
| `TIME_SCALE_MAX` | `16` |
| `CLOCK_RUNNING_DEFAULT` | `true` |

Формат отображения времени: секунды с 2–3 знаками; при больших значениях — `Xh Ym Zs` или scientific для земли на экстремальных β (достаточно `toFixed` + compact).

---

## A.4 Звёздное поле

| Constant | Value |
|----------|-------|
| `STAR_COUNT` | `1000` |
| `STARFIELD_SEED` | `42` |
| `STAR_X_RANGE` | `[-2000, 2000]` |
| `STAR_Y_RANGE` | `[-1200, 1200]` |
| `STAR_Z_RANGE` | `[50, 4000]` |
| `BASE_FREQUENCY_HZ_MIN` | `4.0e14` |
| `BASE_FREQUENCY_HZ_MAX` | `7.5e14` |
| `STAR_RADIUS_PX_MIN` | `0.6` |
| `STAR_RADIUS_PX_MAX` | `2.2` |

Базовые цвета: от тёплого белого до голубоватого; частота согласована с цветом (грубо).

---

## A.5 Планеты

| id | x | y | properRadius | color hint |
|----|---|---|--------------|------------|
| `terra` | `400` | `0` | `28` | blue-white |
| `kepler` | `900` | `40` | `36` | ochre |
| `proxima` | `1500` | `-30` | `22` | red-dwarf tint |
| `gaia` | `2200` | `20` | `44` | ice giant |

`PLANET_COUNT = 4`. Имена — через i18n keys.

`SECTOR_LENGTH = 2800` (для wrap корабля).

---

## A.6 Лазеры

| Constant | Value |
|----------|-------|
| `LASER_MAX_TRAVEL` | `3000` |
| `LASER_WIDTH_PX` | `2` |
| `LASER_FORWARD_COLOR` | `{ r: 120, g: 200, b: 255 }` |
| `LASER_BACKWARD_COLOR` | `{ r: 255, g: 120, b: 90 }` |
| `LASER_FORWARD_FREQ_FACTOR` | `1.0` (visual; Doppler optional extra) |
| `MAX_ACTIVE_LASERS` | `12` |

---

## A.7 Рендер

| Constant | Value |
|----------|-------|
| `MAX_DPR` | `2` |
| `COCKPIT_FOCAL` | `420` | проекция направления → screen |
| `COCKPIT_BG` | `#04060c` |
| `OBSERVER_BG` | `#04060c` |
| `OBSERVER_PX_PER_WORLD` | `0.35` (при zoom=1) |
| `GRID_SPACING_WORLD` | `100` |
| `SHIP_COLOR` | `#3ec6ff` |
| `PLANET_OUTLINE` | `#f0a94a` |

Видимый свет (для Doppler fade):

| | Wavelength nm | Approx Hz |
|--|---------------|-----------|
| Min visible | 380 | \(7.89\times10^{14}\) |
| Max visible | 750 | \(4.00\times10^{14}\) |

В коде зафиксируй `WAVELENGTH_NM_MIN=380`, `WAVELENGTH_NM_MAX=750` и конвертацию \(\nu = c_{\mathrm{light}}/\lambda\) с \(c_{\mathrm{light}}=2.99792458e8\) м/с для спектральной карты. **Не путай** эту константу с симуляционной `C=1000` world units/s.

---

## A.8 UI

| Constant | Value |
|----------|-------|
| `LOCALE_DEFAULT` | `'ru'` |
| `THEME_DEFAULT` | `'dark'` |
| `TELEMETRY_WIDTH_PX` | `320` |
| `BOTTOM_BAR_HEIGHT_PX` | `88` |

---

## A.9 Стартовое состояние

```ts
{
  beta: 0,
  isPlaying: true,
  timeScale: 1,
  earthTimeSec: 0,
  shipTimeSec: 0,
  theme: 'dark',
  locale: 'ru',
  activeCanvas: 'cockpit',
  lasers: []
}
```
