# RelativitySim Pro — Главный промпт генерации проекта

> **Как использовать этот пакет:** вставь содержимое этого файла (INDEX.md) в начало диалога с кодовым агентом, затем укажи: «Прочитай и строго выполни документы `docs/01` → `docs/09` и оба appendix в указанном порядке. Генерируй полный код приложения без сокращений.»

---

## 0. Роль и миссия

Ты — **Senior Angular Engineer** и **Специалист по Теоретической Физике (СТО)**. Твоя задача — **с нуля** создать полноценное, интерактивное, научно-достоверное веб-приложение:

**«RelativitySim Pro: Интерактивный симулятор Специальной теории относительности»**

на **последнем стабильном Angular (22+ на момент генерации)**.

Не спрашивай разрешения «начать с MVP». Выдай **полный рабочий проект**: все файлы, все релятивистские формулы, оба Canvas-вида (кабина + карта наблюдателя), бортовой компьютер на Signals, лазерные эксперименты, телеметрию, i18n, тесты из пакета документов. Выжми максимум из контекста. Не жалей токенов. Пиши шедевр.

Этот INDEX — точка входа. Детальные требования — в связанных документах ниже. При конфликте: **более специфичный документ побеждает**; жёсткие правила из §1 этого файла **неотменяемы**.

---

## 1. ЖЁСТКИЕ ПРАВИЛА ГЕНЕРАЦИИ КОДА (БЕЗ ИСКЛЮЧЕНИЙ)

1. **ПИШИ КОД ПОЛНОСТЬЮ.** Любые сокращения, комментарии вида `// ...`, `// TODO`, `// аналогично`, `/* rest of file */`, `...existing code...` **ЗАПРЕЩЕНЫ**. Каждая строка, каждая функция, каждый класс, каждый шаг симуляции, каждый словарь i18n, каждый тест — целиком. Если файл большой — пиши его целиком.
2. **Только современный Angular:**
   - Standalone-компоненты (`standalone: true` явно, если CLI ещё требует).
   - **Angular Signals** для реактивного состояния корабля, часов и метрик (`signal`, `computed`, `effect`, `linkedSignal`). **Запрещены** `BehaviorSubject` / `Subject` для UI/симуляционного состояния.
   - Новый Control Flow: `@if`, `@for` (с обязательным `track`), `@switch`, `@let`. **Запрещены** `*ngIf`, `*ngFor`, `*ngSwitch`.
   - `input()`, `output()`, `model()` вместо `@Input` / `@Output` декораторов.
   - `inject()` для DI.
   - **Zoneless** change detection (как в новых приложениях Angular 21+/22+). Не опирайся на Zone.js для обновления UI.
   - `ChangeDetectionStrategy.OnPush` (дефолт новых приложений — не отключай).
3. **Разделяй логику:** интерфейсы/модели отдельно, чистая физика Лоренца отдельно, space-time / clock отдельно, Canvas-рендереры отдельно, UI-компоненты отдельно, stores (signals) отдельно. UI **не** считает \(\gamma\), аберрацию и Доплер.
4. **Canvas 2D only.** HTML5 `<canvas>` для вида из кабины и карты сектора. **Запрещены** Three.js, Babylon, WebGL-фреймворки, сырой WebGL, Chart.js, D3, Plotly.
5. **Научная механика СТО обязательна:** Лоренц-фактор, замедление времени, сокращение длины, релятивистская аберрация, релятивистский Доплер, постулат \(c=\mathrm{const}\) для лазерных лучей. Числа и пороги — из [appendix-a-defaults.md](appendix-a-defaults.md). Формулы — из [appendix-b-formulas.md](appendix-b-formulas.md) и [04-physics-engine.md](04-physics-engine.md).
6. **Запрещены заглушки:** пустые методы, `return 0`, fake stars, Lorem Ipsum в UI, `console.log` вместо логики, «потом допишем».
7. **Тесты обязательны** минимум для: \(\gamma(v)\), time dilation, length contraction, aberration angle, Doppler shift, light-speed laser postulate — см. [07-features-extended.md](07-features-extended.md), [09-acceptance-criteria.md](09-acceptance-criteria.md).
8. **i18n RU/EN** через signal-словарь (не `@angular/localize` build-time), см. [07-features-extended.md](07-features-extended.md).
9. **Структура файлов** должна соответствовать [08-file-checklist.md](08-file-checklist.md). Не пропускай файлы из чеклиста.
10. **Стили:** SCSS + CSS variables, тема **Space Dark / Relativistic Cockpit** по умолчанию. Tailwind **не** подключать; визуал кабины / пульта ЦЕРН — на чистом CSS/SCSS.

---

## 2. Порядок чтения и выполнения документов

Выполняй **строго по порядку**. Не начинай UI, пока не зафиксированы модели и физика.

| Шаг | Документ | Что сделать |
|-----|----------|-------------|
| 1 | [01-product-vision.md](01-product-vision.md) | Понять продукт, UX кабины, journeys, хоткеи, a11y |
| 2 | [02-architecture.md](02-architecture.md) | Создать скелет Angular-проекта и папок |
| 3 | [03-data-model.md](03-data-model.md) + [appendix-a-defaults.md](appendix-a-defaults.md) | Модели звёзд, планет, корабля, метрик, лазеров |
| 4 | [04-physics-engine.md](04-physics-engine.md) + [appendix-b-formulas.md](appendix-b-formulas.md) | \(\gamma\), dilation, contraction, aberration, Doppler, lasers |
| 5 | [05-visualizations.md](05-visualizations.md) | Canvas кабины + Canvas карты наблюдателя |
| 6 | [06-ui-panels.md](06-ui-panels.md) | Dashboard, телеметрия, слайдер \(v/c\), эксперименты |
| 7 | [07-features-extended.md](07-features-extended.md) | Пресеты скорости, screenshot, i18n, тесты, hotkeys |
| 8 | [08-file-checklist.md](08-file-checklist.md) | Сверка: все файлы существуют и полны |
| 9 | [09-acceptance-criteria.md](09-acceptance-criteria.md) | Прогнать DoD / приёмку |

---

## 3. Краткий функциональный объём (обязателен целиком)

### Ядро симуляции (СТО)
- Корабль летит сквозь звёздное поле и круглые «планеты» со скоростью \(v \in [0,\,0.999]\,c\).
- В симуляции \(c\) задаётся как масштабируемая константа (пиксели/сек или нормализованные единицы) — см. Appendix A.
- Обязательные эффекты:
  1. **Лоренц-фактор:** \(\gamma = 1/\sqrt{1 - v^2/c^2}\).
  2. **Замедление времени:** \(\Delta t_{\mathrm{static}} = \gamma \cdot \Delta t_{\mathrm{ship}}\) (парадокс близнецов на двух часах).
  3. **Сокращение длины:** \(L = L_0/\gamma\) по оси движения.
  4. **Аберрация света:** \(\cos\theta' = (\cos\theta - \beta)/(1 - \beta\cos\theta)\), \(\beta=v/c\).
  5. **Релятивистский Доплер:** blueshift впереди / redshift сзади; RGB-сдвиг звёзд; уход в невидимый спектр.
- Лазер вперёд/назад: для неподвижных планет скорость луча строго \(c\); меняется только частота (цвет).

### Интерфейс «кабины / пульта ЦЕРН»
- **Cockpit View (Canvas):** вид из кабины — аберрация + Доплер + сжатие дистанций по оси \(X\).
- **Observer Map (Canvas):** вид сбоку для неподвижного наблюдателя — корабль сжимается в «блин» при \(v\to c\).
- **Бортовой компьютер (Signals):** часы Земли, часы корабля, \(v/c\), \(\gamma\), релятивистская масса \(m\gamma\).
- **Панель экспериментов:** «Выстрелить лазером вперёд / назад».
- Слайдер скорости \(0.0c\) … \(0.999c\); пресеты; Play/Pause/Reset часов.

### Расширения (обязательны)
- Пресеты \(\beta\), screenshot PNG активного canvas, hotkeys, Space Dark + светлая тема панелей, i18n RU/EN.
- Unit-тесты Lorentz / dilation / contraction / aberration / Doppler / laser \(c\).

---

## 4. Технологический стек (зафиксировано)

| Область | Выбор |
|---------|--------|
| Framework | Angular **latest stable ≥ 22** |
| Components | Standalone only |
| State | Signals stores (`providedIn: 'root'` или feature) |
| CD | Zoneless + OnPush |
| Rendering | HTML5 Canvas 2D (cockpit + observer) |
| Forms controls | native + signals / `model()` |
| Styling | SCSS + CSS variables (Space Dark Cockpit); **без** Tailwind |
| i18n | Signal-словари `ru.ts` / `en.ts` + `I18nService.t(key)` |
| Tests | Стандартный test runner CLI проекта (Vitest или Jest) |
| Package manager | npm |
| Language UI default | `ru` |

**Команда старта проекта (ориентир):**

```bash
npx @angular/cli@latest new relativity-sim-pro --routing=false --style=scss --ssr=false
cd relativity-sim-pro
```

Имя приложения в `package.json` / title: **RelativitySim Pro**. Селектор префикс: `rsp`.

---

## 5. Definition of Done (кратко)

Приложение **готово**, только если:

1. `ng serve` / `npm start` запускает симулятор без ошибок.
2. Слайдер \(v/c\) меняет \(\gamma\), часы, аберрацию и цвета звёзд в реальном времени.
3. Cockpit Canvas: звёзды стягиваются к «вперёд» при росте \(v\); центр — blueshift, периферия — redshift / уход из видимого спектра; планеты сжимаются по оси движения.
4. Observer Canvas: сам корабль визуально укорачивается как \(L_0/\gamma\).
5. Два счётчика времени одновременно демонстрируют парадокс близнецов (на \(0.99c\) земные часы уходят далеко вперёд).
6. Лазеры вперёд/назад: скорость луча для планет = \(c\); цвет зависит от Доплера / направления.
7. Телеметрия: \(v/c\), \(\gamma\), \(m\gamma\), оба времени — live через Signals.
8. i18n RU↔EN, theme toggle, hotkeys, screenshot, пресеты \(\beta\) — работают.
9. Unit-тесты physics проходят.
10. В исходниках **нет** `// TODO`, `// ...`, `*ngIf`, `*ngFor`, BehaviorSubject-state, Three.js, Tailwind, Chart.js.
11. Чеклист [08-file-checklist.md](08-file-checklist.md) выполнен на 100%.
12. Все пункты [09-acceptance-criteria.md](09-acceptance-criteria.md) отмечены как выполненные.

Полный текст приёмки — в документе 09.

---

## 6. Стиль ответа генератора

1. Сначала создай структуру проекта и доменный слой (модели → Lorentz math → space-time → stores).
2. Затем Canvas (cockpit + observer), затем UI-панели, затем расширения и тесты.
3. Каждый файл выводи **целиком** с путём.
4. После завершения — кратко перечисли, как запустить и как проверить ключевые сценарии из §5.
5. Не предлагай «упростить физику». Не заменяй аберрацию простым zoom. Не пропускай лазерный постулат \(c=\mathrm{const}\).

---

## 7. Начни сейчас

Прочитай [01-product-vision.md](01-product-vision.md) и приступай к генерации полного проекта **RelativitySim Pro** согласно всему пакету `docs/`.

**Начинай генерацию. Напиши этот проект как Senior Angular Engineer и Специалист по Теоретической Физике.**
