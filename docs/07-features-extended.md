# 07 — Features Extended

Обязательные расширения. Не помечай их как optional.

---

## 7.1 Beta presets

Реализуй пресеты из Appendix A в toolbar и hotkeys `0`–`4`.  
Пресет только вызывает `setBeta`; не делает Reset clocks.

---

## 7.2 Theme toggle

Dark (default) / Light. Меняет панели через `data-theme`.  
Canvas background остаётся космическим тёмным.

---

## 7.3 i18n RU/EN

Структура:

```
src/app/i18n/
  locale.type.ts
  i18n.keys.ts
  dictionaries/ru.ts
  dictionaries/en.ts
services/i18n.service.ts
```

`I18nService`:
- `locale = signal<LocaleId>('ru')`
- `t(key: string, params?: Record<string, string | number>): string`
- Переключение `toggle()` / `setLocale`.

Минимальный набор ключей (неполный список — расширь по UI):

- `app.title`, `app.subtitle`
- `telemetry.earthClocks`, `telemetry.shipClocks`, `telemetry.gamma`, `telemetry.beta`, `telemetry.relMass`, `telemetry.timeRatio`
- `controls.velocity`, `controls.play`, `controls.pause`, `controls.reset`
- `experiment.laserForward`, `experiment.laserBackward`, `experiment.hint`
- `view.cockpit`, `view.observer`, `view.telemetry`
- `presets.*`
- `hotkeys.*`
- `theme.dark`, `theme.light`
- `a11y.*`

Никакого `@angular/localize` build-time.

---

## 7.4 Screenshot

См. 05. Кнопка toolbar + hotkey `S`.

---

## 7.5 Hotkeys

Сервис `HotkeysService` слушает `window:keydown`, игнорирует ввод в text fields. Карта — из 01 §1.5.

---

## 7.6 Twin-paradox HUD

В нижней панели или телеметрии — компактный индикатор:

«При текущем \(\gamma\) 1 с на корабле ≈ \(\gamma\) с на Земле».

Обновляется computed-строкой i18n.

---

## 7.7 Unit tests (обязательные)

| File | Assertions (минимум) |
|------|----------------------|
| `lorentz-factor.spec.ts` | γ(0)=1; γ(0.6)=1.25; γ(0.8)≈5/3; γ(0.99)≈7.0888; clamp β>BETA_MAX |
| `time-dilation.spec.ts` | Δt_E = γ Δt_S; при β=0 равны |
| `length-contraction.spec.ts` | L=L0/γ; при β=0 L=L0 |
| `aberration.spec.ts` | β=0 → θ'=θ; β→1 → θ'→0 для θ∈(0,π); формула cos |
| `doppler.spec.ts` | approach factor >1; recede <1; general formula at θ=0 matches head-on |
| `laser-kinematics.spec.ts` | \|v\|=C forward & backward независимо от β корабля; шаг x+=vx*dt |

Запускаться через `npm test` / стандартный runner CLI.

---

## 7.8 README disclaimer

Укажи, что:
- это учебная 2D-визуализация СТО;
- «релятивистская масса» — педагогический термин;
- спектральный сдвиг упрощён;
- не моделируется ОТО и полное релятивистское излучение протяжённых дисков.

---

## 7.9 Quality extras (обязательны, если не конфликтуют)

1. Пунктирный ghost корабля \(L_0\) на Observer.
2. Soft fade звёзд у границы видимого спектра (не hard cut только).
3. Форматирование больших γ и времён без переполнения layout.
4. `prefers-reduced-motion`: отключить лёгкий mouse parallax, если был добавлен.
