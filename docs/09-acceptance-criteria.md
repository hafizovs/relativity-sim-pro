# 09 — Acceptance Criteria / Definition of Done

Приложение принимается, только если **все** пункты ниже выполнены. Генератор обязан самопроверить список перед финальным ответом.

---

## 9.1 Сборка и запуск

| # | Criterion | Pass condition |
|---|-----------|----------------|
| A1 | Install | `npm install` без ошибок |
| A2 | Serve | `npm start` / `ng serve` открывает приложение без runtime errors в консоли |
| A3 | Build | `npm run build` успешен |
| A4 | Tests | `npm test` — все обязательные physics specs зелёные |

---

## 9.2 Angular / качество кода

| # | Criterion | Pass condition |
|---|-----------|----------------|
| B1 | Standalone | Все компоненты standalone |
| B2 | Signals state | β, часы, metrics, lasers — через signals; нет BehaviorSubject для UI state |
| B3 | Control flow | Нет `*ngIf` / `*ngFor` / `*ngSwitch` |
| B4 | Zoneless | Zone.js не требуется для обновления UI |
| B5 | No stubs | Нет `TODO`, `// ...`, пустых методов, Lorem Ipsum |
| B6 | No forbidden libs | Нет Three.js, Tailwind, Chart.js, D3, Plotly |
| B7 | Separation | Формулы СТО не в шаблонах компонентов |
| B8 | Checklist | [08-file-checklist.md](08-file-checklist.md) выполнен на 100% |

---

## 9.3 Физика СТО

| # | Criterion | Pass condition |
|---|-----------|----------------|
| C1 | Lorentz γ | γ(0)=1; γ(0.6)=1.25; γ(0.99)≈7.0888 |
| C2 | Time dilation | При постоянном β: \(t_E / t_S \approx \gamma\) после нескольких секунд running |
| C3 | Twin paradox UX | На пресете 0.99c земные часы заметно обгоняют корабельные |
| C4 | Length contraction | На Observer длина корабля = \(L_0/\gamma\); при β→0.999 визуально «блин» |
| C5 | Aberration | При росте β звёзды на Cockpit стягиваются к центру (вперёд), не «зумятся» CSS |
| C6 | Doppler | Впереди — blueshift; сзади/на периферии — redshift; вне спектра — fade/hide |
| C7 | Laser c | Для forward и backward в rest frame \|v\|=C независимо от β |
| C8 | No classical light add | Код лазера не делает `v_ship ± c` |
| C9 | Relativistic mass | Телеметрия показывает \(m\gamma = m_0\gamma\) |
| C10 | Numerical safety | β clamped; нет NaN/Infinity в γ при β=BETA_MAX |

---

## 9.4 Визуализации

| # | Criterion | Pass condition |
|---|-----------|----------------|
| D1 | Cockpit canvas | Рисуется starfield + planets + эффекты |
| D2 | Observer canvas | Сетка, планеты, сжатый корабль, лазеры |
| D3 | Ghost ship | Пунктирный контур \(L_0\) на Observer виден |
| D4 | DPR resize | Корректный resize обоих canvas без размытия/обрезки |
| D5 | FPS | ~1000 звёзд, UI отзывчив на среднем desktop |
| D6 | Theme | Смена темы панелей не ломает тёмный космос canvas |

---

## 9.5 UI / UX

| # | Criterion | Pass condition |
|---|-----------|----------------|
| E1 | Slider β | 0…0.999, live update всех derived |
| E2 | Presets | 5 пресетов работают |
| E3 | Play/Pause/Reset | Часы и лазеры подчиняются; Reset не обязан сбрасывать β |
| E4 | Laser buttons | F/B (и кнопки) спавнят импульсы |
| E5 | Telemetry | Earth/Ship time, β, γ, mγ, L/L0 live |
| E6 | i18n | RU↔EN без перезагрузки, все видимые строки |
| E7 | Hotkeys | Space, R, 0–4, F, B, S, T, G, H, Esc |
| E8 | Screenshot | PNG скачивается |
| E9 | Mobile | Вкладки Cockpit/Map/Telemetry usable |
| E10 | a11y | aria-label на controls; slider valuetext; focus-visible |
| E11 | Brand | «RelativitySim Pro» — заметный brand в toolbar |

---

## 9.6 Сценарии приёмки (ручной прогон)

### S1 — Холодный старт
Открыть приложение → dark + ru → β=0 → γ=1 → часы синхронны → поле без стягивания.

### S2 — Разгон
Пресет 0.9c → γ≈2.29 → звёзды к центру → корабль короче → Earth clock быстрее.

### S3 — Парадокс близнецов
Пресет 0.99c, Play 15 с реального времени → \(t_E / t_S\) в пределах ~5% от γ≈7.09.

### S4 — Лазеры
При β=0.99 выстрел вперёд и назад на Observer → оба луча идут с \|v\|=c (визуально одинаковая скорость относительно сетки, разные направления/цвета).

### S5 — Экстремум
β=0.999 → сильный beam; многие звёзды исчезают из видимого спектра; корабль почти плоский.

### S6 — i18n / theme / screenshot
Переключить язык и тему; сделать screenshot без ошибок.

---

## 9.7 Запрещённые «фейковые прохождения»

Не засчитывается, если:
- аберрация заменена `scale`/`zoom` к центру без формулы;
- Доплер — просто «синие в центре, красные с краю» без связи с ν/β;
- часы тикают одинаково при β>0;
- лазер наследует скорость корабля классически;
- отсутствует Observer view;
- тесты пропущены или assert’ят `true`.

---

## 9.8 Финальный отчёт генератора

После генерации кода кратко укажи:
1. Как запустить (`npm install`, `npm start`, `npm test`).
2. Какие файлы physics покрыты тестами.
3. Как воспроизвести S3 и S4.
4. Подтверждение: чеклист 08 = 100%, критерии 09 = pass.

**Только после этого** задача считается выполненной.
