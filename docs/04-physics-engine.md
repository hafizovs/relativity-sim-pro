# 04 — Physics Engine (Special Relativity)

Реализуй физику **точно** по этому документу и [appendix-b-formulas.md](appendix-b-formulas.md). Не заменяй аберрацию «zoom к центру». Не нарушай постулат \(c=\mathrm{const}\) для лазеров.

Это **образовательная 2D-визуализация СТО** (инерциальные системы, движение вдоль \(X\)). Не реализуется ОТО, гравитационное линзирование, полный спектральный синтез.

---

## 4.1 Файлы domain

| Файл | Назначение |
|------|------------|
| `domain/relativity/lorentz-factor.ts` | \(\beta\), \(\gamma\) с численной защитой |
| `domain/relativity/time-dilation.ts` | \(\Delta t_{\mathrm{static}} = \gamma\,\Delta t_{\mathrm{ship}}\) |
| `domain/relativity/length-contraction.ts` | \(L = L_0/\gamma\) |
| `domain/relativity/aberration.ts` | трансформация угла / направления |
| `domain/relativity/doppler.ts` | фактор Доплера (head-on + общий) |
| `domain/relativity/frequency-to-rgb.ts` | \(\nu\) → RGB + visibility |
| `domain/relativity/laser-kinematics.ts` | импульсы со скоростью \(c\) |
| `domain/relativity/format-relativity.ts` | humanize β, γ, time |
| `domain/space/starfield-generator.ts` | детерминированное поле звёзд |
| `domain/space/planet-catalog.ts` | каталог планет |
| `domain/space/world-step.ts` | шаг лазеров / опциональный дрейф |
| `services/lorentz-math.service.ts` | оркестрация API физики |
| `services/space-time.service.ts` | β, часы, tick |

---

## 4.2 API `LorentzMathService`

См. сигнатуры в [02-architecture.md](02-architecture.md). Требования к поведению:

### `gamma(beta: number): number`
1. Clamp `beta` к `[0, BETA_MAX]`.
2. `beta2 = beta * beta`.
3. `oneMinus = Math.max(1 - beta2, GAMMA_EPS)`.
4. `return 1 / Math.sqrt(oneMinus)`.

Эталонные значения (тесты):
- \(\beta=0\) → \(\gamma=1\)
- \(\beta=0.6\) → \(\gamma=1.25\)
- \(\beta=0.8\) → \(\gamma\approx 1.6667\)
- \(\beta=0.99\) → \(\gamma\approx 7.0888\)

### `dilateStaticTime(deltaShip, gamma)`
`return deltaShip * gamma`.

### `contractLength(properLength, gamma)`
`return properLength / gamma` (gamma ≥ 1).

### Аберрация
Для движения наблюдателя (корабля) вдоль \(+X\) со скоростью \(v=\beta c\):

\[
\cos\theta_{\mathrm{obs}} = \frac{\cos\theta_{\mathrm{em}} - \beta}{1 - \beta\cos\theta_{\mathrm{em}}}
\]

где \(\theta=0\) — направление **вперёд** (по оси движения), \(\theta=\pi\) — назад.

`aberrateAngle(thetaEmitted, beta)`:
1. `cosEm = clamp(Math.cos(thetaEmitted), -1, 1)`
2. `denom = 1 - beta * cosEm`; если `|denom| < EPS` — защитный clamp.
3. `cosObs = clamp((cosEm - beta) / denom, -1, 1)`
4. Сохранить знак \(\sin\) / квадрант: `sinObs` из непрерывности, либо работать в 2D векторах.

Предпочтительно векторная форма `aberrateDirection(dx, dy, beta)`:
1. Нормализовать направление от корабля к звезде в rest frame → получить \(\cos\theta = \hat{d}\cdot\hat{x}\).
2. Применить формулу к углу или к компонентам (см. Appendix B).
3. Вернуть единичный вектор наблюдаемого направления для проекции на экран кабины.

### Доплер
Head-on (строго на линии движения):

\[
\nu_{\mathrm{obs}} = \nu_{\mathrm{em}} \sqrt{\frac{1-\beta}{1+\beta}}
\quad\text{(источник спереди при приближении — см. знак ниже)}
\]

Для **приближения** к источнику впереди (blueshift):

\[
f_{\mathrm{approach}} = \sqrt{\frac{1+\beta}{1-\beta}}
\]

Для **удаления** (источник сзади, redshift):

\[
f_{\mathrm{recede}} = \sqrt{\frac{1-\beta}{1+\beta}}
\]

В наработках пользователя указана форма \(\nu_{\mathrm{obs}} = \nu_{\mathrm{em}}\sqrt{(1-\beta)/(1+\beta)}\) для объектов на линии движения — это **redshift для receding**. Реализуй **оба** направления явно; для произвольного угла используй:

\[
\nu_{\mathrm{obs}} = \nu_{\mathrm{em}}\,\frac{\sqrt{1-\beta^2}}{1 - \beta\cos\theta_{\mathrm{obs}}}
\]

(релятивистский Доплер через наблюдаемый угол — см. Appendix B). Именно эту общую формулу применяй к звёздам кабины.

### `frequencyToRgb`
1. Видимый диапазон: `NU_VISIBLE_MIN` .. `NU_VISIBLE_MAX` (или через длину волны 380–750 нм).
2. Вне диапазона: `visible=false`, `alpha=0` (или плавный fade near edges).
3. Внутри — спектральная аппроксимация wavelength→RGB (алгоритм в Appendix B).

### `relativisticMass(restMass, gamma)`
`return restMass * gamma`.

---

## 4.3 API `SpaceTimeService`

### `setBeta(beta)`
1. Clamp к `[0, BETA_MAX]`.
2. Обновить signal `beta`.
3. `gamma` — `computed`.
4. Обновить `velocity = beta * C`.

### `tick(dtRealSec)`
Если `!isPlaying` — return.  
Иначе:

```
dtShip = dtRealSec * timeScale
dtEarth = gamma() * dtShip
shipTime += dtShip
earthTime += dtEarth
```

Это даёт парадокс близнецов: при \(\beta=0.99\) земное время накапливается в \(\approx 7\times\) быстрее собственного времени корабля.

### `resetClocks()`
Обнуляет оба времени; не меняет `beta`; очистка лазеров — через `WorldService.clearLasers()` (вызов из store/UI).

---

## 4.4 Лазеры — постулат постоянства \(c\)

`fireLaser(direction: 'forward' | 'backward')`:
1. Спавн импульса в носу/корме корабля (`ship.x ± offset`).
2. В **системе покоя сектора**:
   - forward: `vx = +C`, `vy = 0`
   - backward: `vx = -C`, `vy = 0`
3. **Запрещено:** `vx = v_ship ± C` (классическое сложение).
4. Частота/цвет: forward — повышенная (blueshift pedagogical color), backward — redshift color; либо частота покоя + визуальный tint.
5. На каждом `world.step(dtEarth)`: `x += vx * dt`, где `dt` — время в системе покоя (используй `dtEarth` или rest-frame dt из render loop). Скорость по модулю остаётся `C`.

Acceptance: измерить \(\Delta x / \Delta t_{\mathrm{Earth}}\) ≈ `C` для обоих направлений независимо от `beta`.

---

## 4.5 Согласованность систем отсчёта

| Величина | Система | Где используется |
|----------|---------|------------------|
| Позиции звёзд/планет/корабля | Rest (сектор) | World store, Observer map |
| Длина корабля на Observer | Rest + контракция \(L_0/\gamma\) | Observer renderer |
| Направления/цвета звёзд | Ship frame (аберрация + Доплер) | Cockpit renderer |
| Часы корабля | Proper time ship | SpaceTimeService |
| Часы Земли | Rest / static | SpaceTimeService |
| Скорость лазера | Rest | World step |

Не смешивай: не применяй аберрацию к Observer map; не рисуй несжатый корабль на Observer при \(\beta>0\).

---

## 4.6 Движение корабля на карте (опционально, но желательно)

Чтобы карта «жила»:
- `ship.x += velocity * dtEarth` (или `beta * C * dt_rest`).
- Планеты неподвижны в rest frame.
- При выходе за конец сектора — wrap или stop at last planet (зафиксируй: **wrap sector** с модулем длины сектора).

Cockpit может оставаться «видом вперёд» без обязательного сдвига камеры — звёзды уже аберрированы.

---

## 4.7 Численная устойчивость

1. Никогда не вычисляй `sqrt(1 - beta²)` при `beta >= 1`.
2. Clamp `beta` на входе всех публичных функций.
3. `acos` аргументы clamp к `[-1, 1]`.
4. Доплер: `1 - beta` и `1 + beta` не должны давать division by zero (`BETA_MAX < 1`).
5. Unit-тесты на граничные значения из [09-acceptance-criteria.md](09-acceptance-criteria.md).

---

## 4.8 Чего не делать

- Не использовать классический Доплер \(c/(c\pm v)\) как единственную модель без \(\gamma\).
- Не масштабировать весь canvas через CSS transform вместо формул.
- Не делать скорость лазера зависящей от \(v\) корабля в rest frame.
- Не оставлять `gamma = 1 / (1 - beta)` или другие неверные аппроксимации.
