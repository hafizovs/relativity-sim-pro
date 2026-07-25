# 05 — Visualizations (Canvas Cockpit + Observer)

Реализуй два независимых Canvas 2D пайплайна. **Только Canvas 2D.** Константы — из [appendix-a-defaults.md](appendix-a-defaults.md).

---

## 5.1 Файлы

### Cockpit
- `features/cockpit-view/cockpit-view.component.*` — `<canvas>`, ResizeObserver
- `features/cockpit-view/cockpit-canvas.renderer.ts` — отрисовка кадра

### Observer
- `features/observer-view/observer-view.component.*`
- `features/observer-view/observer-canvas.renderer.ts`

Оба читают состояние из stores / services; **не** дублируют формулы \(\gamma\) — берут готовые metrics.

---

## 5.2 Общий render loop

`RenderLoopService`:
1. `requestAnimationFrame`.
2. `dt = clamp((now - last) / 1000, 0, 0.05)`.
3. `spaceTime.tick(dt)`.
4. `world.step(dt)` (лазеры + ship.x).
5. Пометить кадр / вызвать registered drawers **или** компоненты сами рисуют в своём rAF, читая signals — предпочтительно: **компоненты рисуют в rAF**, а `RenderLoopService` только симулирует время/мир (один rAF на сервис; компоненты подписываются через callback registry).

Зафиксируй:

```ts
// RenderLoopService держит один rAF
// cockpit/observer регистрируют draw(ctxSnapshot) callbacks
```

---

## 5.3 Cockpit View — вид из кабины

### Цель кадра
Показать, что видит пилот: звёзды и планеты с **аберрацией** и **Доплером**; сжатие масштаба по оси движения.

### Pipeline кадра

1. Clear → fill `COCKPIT_BG`.
2. Optional: vignette / HUD crosshair «prograde» в центре (тонкий, без badges-карточек).
3. Для каждой звезды:
   - Вектор ship→star в rest.
   - `thetaEm`, `aberrate` → `thetaObs`, `dirObs`.
   - Проекция в screen (центр = вперёд).
   - `dopplerFactorGeneral(beta, cosThetaObs)` → `nuObs`.
   - `frequencyToRgb(nuObs)` → color / visible / alpha.
   - Если `!visible && alpha≈0` — skip.
   - Draw circle с glow (radial gradient), radius с учётом brightness и mild size boost при blueshift.
4. Для каждой планеты:
   - Аналогично направление + Доплер tint.
   - Радиус на экране: `properRadius / gamma` (length contraction pedagogy) × projection scale.
   - Дистанция по «глубине» также визуально сжата: factor `1/gamma` к off-axis/along-track spacing.
5. Лазерные импульсы (если видны вперёд): короткие штрихи/частицы по проекции.
6. Рамка кабины (опционально): полупрозрачные края / «стекло» — CSS overlay предпочтительнее тяжёлого canvas chrome.

### Интерактивность
- Без pan/zoom обязательно; допустим лёгкий parallax от движения мыши (±4px) — опционально.
- Не закрывать звёзды UI-карточками.

### Ожидаемое поведение при росте β
| β | Вид |
|---|-----|
| 0 | Равномерное поле, натуральные цвета |
| 0.5 | Заметный сдвиг к центру, лёгкий blueshift вперёд |
| 0.9 | Сильное стягивание, яркий blueshift-конус |
| 0.99+ | Почти все звёзды в центральном пятне; края пустеют / краснеют / исчезают |

---

## 5.4 Observer View — карта сектора (rest frame)

### Цель кадра
Вид **сбоку** для неподвижного наблюдателя: траектория \(X\), планеты на местах, корабль сжимается в «блин».

### Pipeline кадра

1. Clear → `OBSERVER_BG`.
2. Нарисовать сетку (`GRID_SPACING_WORLD`) и ось \(X\) (направление полёта).
3. Планеты — круги в rest-координатах (без аберрации, без Доплера обязательно; лёгкий tint допустим).
4. Корабль:
   - Центр `(ship.x, ship.y)`.
   - Ширина (вдоль X) = `properLength / gamma`.
   - Высота = `properHeight` (без контракции).
   - Форма: скруглённый прямоугольник / капсула нос-кормы; нос указывает \(+X\).
5. Вектор скорости / подпись \(\beta\), \(\gamma\) в углу canvas (mono, мелкий HUD).
6. Лазеры: линии/сегменты, движущиеся со скоростью `±C` в rest frame; подпись `|v|=c` при активном эксперименте.
7. Опционально: ghost outline корабля при \(L_0\) (пунктир) для сравнения с сжатым телом — **рекомендуется** как образовательный приём.

### Камера Observer
- Следовать за кораблём по X (`cameraX = ship.x`), Y фиксирован.
- Zoom: колесо мыши опционально (`OBSERVER_ZOOM_MIN/MAX`); default из constants.

---

## 5.5 Resize & DPR

Оба компонента:

```ts
const dpr = Math.min(devicePixelRatio, MAX_DPR);
canvas.width = Math.floor(cssWidth * dpr);
canvas.height = Math.floor(cssHeight * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

`ResizeObserver` на host. При нулевом размере — не падать.

---

## 5.6 Производительность отрисовки

1. Не аллоцировать объекты на каждую звезду каждый кадр без нужды (переиспользуй временные переменные).
2. `STAR_COUNT=1000` должно держать ≥30 FPS на среднем desktop.
3. Offscreen star precompute base arrays once.
4. Не читать layout DOM внутри горячего цикла кроме resize.

---

## 5.7 Screenshot

`ScreenshotService.capture(canvas: HTMLCanvasElement): void` — `canvas.toBlob` → download `relativity-sim-pro-YYYYMMDD-HHmmss.png`.

Активный canvas: cockpit по умолчанию; если пользователь на вкладке/фокусе Observer — observer.

---

## 5.8 Чего не делать в визуализациях

- Three.js / WebGL.
- CSS `transform: scaleX(1/gamma)` на всём canvas вместо контракции корабля.
- Рисовать аберрацию только как «увеличить центральные точки».
- Игнорировать исчезновение из видимого спектра (оставить все звёзды белыми).
