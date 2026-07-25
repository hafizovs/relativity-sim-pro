# 03 — Data Model

Все типы — в `src/app/core/models/`. Числа по умолчанию — в [appendix-a-defaults.md](appendix-a-defaults.md). Формулы — в [appendix-b-formulas.md](appendix-b-formulas.md).

Barrel-файл `relativity.types.ts` реэкспортирует публичные интерфейсы (совместимость с наработками).

---

## 3.1 Векторы и цвет

```ts
// vec2.model.ts
export interface Vec2 {
  x: number;
  y: number;
}

// rgb.model.ts
export interface RgbColor {
  r: number; // 0..255
  g: number;
  b: number;
}

export interface RgbVisibility extends RgbColor {
  /** false, если частота вне видимого диапазона после Доплера */
  visible: boolean;
  /** 0..1 прозрачность/яркость для мягкого ухода из спектра */
  alpha: number;
}
```

---

## 3.2 Звезда

```ts
// star.model.ts
export interface Star {
  id: number;
  /** Положение в системе покоя сектора (world units) */
  x: number;
  y: number;
  z: number; // глубина вдоль оси полёта; для 2.5D параллакса / порядка отрисовки
  /** Базовый цвет в системе покоя (излучённый) */
  baseColor: RgbColor;
  /** Базовая частота / представительная ν в Hz (или нормированная, см. Appendix A) */
  baseFrequency: number;
  /** Визуальный радиус в px при β=0 */
  radiusPx: number;
  /** Яркость 0..1 */
  brightness: number;
}
```

Звёзды **не** движутся существенно за кадр в world-space (далеко); искажается только их **наблюдаемое** направление/цвет для пилота. Допускается лёгкий параллаксный дрейф для ощущения полёта — опционально, не ломая аберрацию.

---

## 3.3 Планета

```ts
// planet.model.ts
export interface Planet {
  id: string;
  nameKey: string; // i18n key
  /** Центр в системе покоя */
  x: number;
  y: number;
  /** Собственный радиус (proper) в world units */
  properRadius: number;
  baseColor: RgbColor;
  /** Для телеметрии / подписей */
  label: string;
}
```

На Cockpit: радиус и расстояние по оси \(X\) сжимаются фактором \(1/\gamma\) (см. 05).  
На Observer: планеты — круглые маркеры на карте; корабль летит вдоль \(X\).

---

## 3.4 Корабль

```ts
// ship.model.ts
export interface ShipState {
  /** Положение центра корабля в системе покоя сектора */
  x: number;
  y: number;
  /** Собственная длина вдоль X */
  properLength: number;
  /** Собственная высота (не сжимается по Y в стандартной 1D-контракции вдоль X) */
  properHeight: number;
  /** Масса покоя (условные единицы) */
  restMass: number;
  /** Скорость в world units / sec; согласована с β·c */
  velocity: number;
}
```

Наблюдаемая длина на карте: `contractedLength = properLength / gamma`.

---

## 3.5 Релятивистские метрики

```ts
// relativity-metrics.model.ts
export interface RelativityMetrics {
  beta: number;          // v/c, 0..BETA_MAX
  velocity: number;      // world units / s
  c: number;             // world units / s
  gamma: number;
  earthTimeSec: number;
  shipTimeSec: number;
  timeRatio: number;     // earth/ship ≈ gamma when shipTime>0
  restMass: number;
  relativisticMass: number; // m * gamma (legacy pedagogical term)
  contractedShipLength: number;
}
```

Примечание: термин «релятивистская масса» \(m\gamma\) — **педагогический**; допустим в UI с подписью. В коде можно назвать `relativisticMass` явно.

---

## 3.6 Лазерный импульс

```ts
// laser-pulse.model.ts
export type LaserDirection = 'forward' | 'backward';

export interface LaserPulse {
  id: string;
  direction: LaserDirection;
  /** Положение в системе покоя сектора */
  x: number;
  y: number;
  /** Скорость в системе покоя: +c или −c по X — ВСЕГДА |vx|=c */
  vx: number;
  vy: number;
  /** Частота / цвет в системе покоя (или для отображения) */
  frequency: number;
  color: RgbColor;
  /** Время жизни / максимальная дистанция */
  bornAtEarthTime: number;
  maxTravel: number;
  alive: boolean;
}
```

**Инвариант:** в системе покоя планет/сектора `|velocity_vector| = c` для любого направления выстрела. Скорость корабля **не** прибавляется классически к скорости луча.

---

## 3.7 Часы симуляции

```ts
// simulation-clock.model.ts
export interface SimulationClockState {
  isPlaying: boolean;
  /** Множитель ускорения симуляции времени (1 = realtime ship proper time) */
  timeScale: number;
  earthTimeSec: number;
  shipTimeSec: number;
}
```

---

## 3.8 Фаза / UI модели

```ts
// app-phase.model.ts
export type AppPhase = 'running' | 'paused';

// theme.model.ts
export type ThemeId = 'dark' | 'light';

// locale.model.ts
export type LocaleId = 'ru' | 'en';

// beta-preset.model.ts
export interface BetaPreset {
  id: string;
  beta: number;
  labelKey: string;
}
```

---

## 3.9 Наблюдаемая звезда (кадровый DTO)

Не хранить в store навсегда — вычислять в рендерере:

```ts
export interface ObservedStar {
  screenX: number;
  screenY: number;
  color: RgbVisibility;
  radiusPx: number;
  /** Угол наблюдения после аберрации, радианы */
  thetaObserved: number;
}
```

---

## 3.10 Инварианты модели

1. `0 ≤ beta ≤ BETA_MAX` (`BETA_MAX = 0.999`).
2. `gamma >= 1`; при `beta → 1` — численная защита `1 - beta² ≥ EPSILON`.
3. `earthTimeSec >= shipTimeSec` при `beta ≥ 0` и одинаковом старте с нуля (для этой постановки «корабль = собственное время»).
4. Для лазеров в rest frame: `hypot(vx, vy) === c` (с допуском float).
5. `contractedShipLength = properLength / gamma`.
6. Звёзды с `visible === false` не рисуются как белые точки — либо не рисуются, либо с `alpha→0`.

---

## 3.11 Генерация мира при старте

`WorldService.bootstrap()`:
1. Создаёт `STAR_COUNT` звёзд через `starfield-generator.ts` (детерминированный seed).
2. Создаёт `PLANET_COUNT` планет из `planet-catalog.ts` (фиксированные позиции вдоль коридора полёта).
3. Инициализирует корабль в начале сектора (`ship.x = SHIP_START_X`).
4. `lasers = []`.
