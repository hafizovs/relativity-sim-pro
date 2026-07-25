# Appendix B — Formulas & Algorithms

Справочник формул. Реализации — в `domain/relativity/**` согласно [04-physics-engine.md](04-physics-engine.md).

---

## B.1 Обозначения

| Symbol | Meaning | Unit / range |
|--------|---------|--------------|
| \(c\) | simulation light speed | world units / s (`C=1000`) |
| \(v\) | ship speed along \(+X\) | world units / s |
| \(\beta\) | \(v/c\) | \(0..\beta_{\max}\) |
| \(\gamma\) | Lorentz factor | \(\ge 1\) |
| \(\theta\) | angle from forward axis | rad; \(0\) = forward |
| \(\nu\) | light frequency | Hz |
| \(L_0\) | proper length | world units |
| \(t_{\mathrm{ship}}\) | proper time on ship | s |
| \(t_{\mathrm{Earth}}\) | time in rest frame | s |
| \(m_0\) | rest mass | arbitrary |

---

## B.2 Lorentz factor

\[
\beta = \frac{v}{c},\qquad
\gamma = \frac{1}{\sqrt{1-\beta^{2}}}
\]

Численно:

```ts
function gamma(beta: number): number {
  const b = clamp(beta, 0, BETA_MAX);
  const oneMinus = Math.max(1 - b * b, GAMMA_EPS);
  return 1 / Math.sqrt(oneMinus);
}
```

---

## B.3 Time dilation (twin paradox pedagogy)

Для собственного интервала на корабле \(\Delta t_{\mathrm{ship}}\):

\[
\Delta t_{\mathrm{Earth}} = \gamma\,\Delta t_{\mathrm{ship}}
\]

Интегрирование:

\[
t_{\mathrm{ship}}(T)=\int_0^{T}\mathrm{d}\tau,\qquad
t_{\mathrm{Earth}}(T)=\int_0^{T}\gamma(\tau)\,\mathrm{d}\tau
\]

При постоянном \(\beta\): \(t_{\mathrm{Earth}} = \gamma\, t_{\mathrm{ship}}\).

---

## B.4 Length contraction

Вдоль оси движения:

\[
L = \frac{L_0}{\gamma}
\]

Поперечные размеры (\(Y\)) **не** сжимаются.

Для расстояний между планетами вдоль \(X\) в виде из кабины (педагогическая визуализация): экранная \(\Delta x_{\mathrm{screen}} \propto \Delta x_0/\gamma\).

---

## B.5 Relativistic aberration

Движение наблюдателя со скоростью \(\beta\) в направлении \(\theta=0\). Угол источника в rest/emitted sense \(\theta_{\mathrm{em}}\) преобразуется в наблюдаемый \(\theta_{\mathrm{obs}}\):

\[
\cos\theta_{\mathrm{obs}}
=
\frac{\cos\theta_{\mathrm{em}}-\beta}{1-\beta\cos\theta_{\mathrm{em}}}
\]

Эквивалентно (синусы):

\[
\sin\theta_{\mathrm{obs}}
=
\frac{\sin\theta_{\mathrm{em}}\sqrt{1-\beta^{2}}}{1-\beta\cos\theta_{\mathrm{em}}}
\]

**Алгоритм для звезды в 2D/2.5D кабины:**

1. Вектор от корабля к звезде в rest frame: \(\vec{d}=(x_s-x_{\mathrm{ship}},\, y_s-y_{\mathrm{ship}})\).
2. \(\theta_{\mathrm{em}} = \mathrm{atan2}(d_y, d_x)\) при оси вперёд = \(+X\).
3. Вычислить \(\theta_{\mathrm{obs}}\) через \(\cos/\sin\) выше (с clamp).
4. На экран кабины: центр = «вперёд»;  
   `screenX = width/2 + f * sin(θ_obs) * sign`  
   `screenY = height/2 - f * (опциональный pitch)`  
   Для 2D вида «вперёд» удобно трактовать малые углы вокруг оси: спроецировать \(\theta_{\mathrm{obs}}\) так, чтобы \(\theta=0\) → центр, а рост \(|\theta|\) → периферия. При \(\beta\to 1\) все \(\theta_{\mathrm{obs}}\to 0\) (стягивание в точку вперёд).

Псевдокод проекции:

```ts
const cosObs = (cosEm - beta) / (1 - beta * cosEm);
const sinObs = (Math.sin(thetaEm) * Math.sqrt(Math.max(1 - beta * beta, GAMMA_EPS)))
             / (1 - beta * cosEm);
// view: forward is center
const screenX = cx + COCKPIT_FOCAL * sinObs; // horizontal off-axis
const screenY = cy - COCKPIT_FOCAL * (/* small vertical component from dy */);
```

Уточни вертикаль: сохрани азимутальную структуру — используй нормализованный перпендикулярный компонент направления после аберрации.

---

## B.6 Relativistic Doppler effect

### Head-on

Приближение (источник впереди, сближение):

\[
\frac{\nu_{\mathrm{obs}}}{\nu_{\mathrm{em}}} = \sqrt{\frac{1+\beta}{1-\beta}}
\]

Удаление (источник сзади):

\[
\frac{\nu_{\mathrm{obs}}}{\nu_{\mathrm{em}}} = \sqrt{\frac{1-\beta}{1+\beta}}
\]

### General (use for starfield)

\[
\frac{\nu_{\mathrm{obs}}}{\nu_{\mathrm{em}}}
=
\frac{\sqrt{1-\beta^{2}}}{1-\beta\cos\theta_{\mathrm{obs}}}
=
\frac{1}{\gamma\,(1-\beta\cos\theta_{\mathrm{obs}})}
\]

где \(\theta_{\mathrm{obs}}\) — угол между скоростью наблюдателя и направлением на источник **в системе наблюдателя** (после аберрации).

В коде:

```ts
function dopplerFactorGeneral(beta: number, cosThetaObs: number): number {
  const g = gamma(beta);
  const denom = 1 - beta * clamp(cosThetaObs, -1, 1);
  return 1 / (g * Math.max(denom, 1e-12));
}
```

---

## B.7 Frequency → RGB (simplified)

1. \(\lambda_{\mathrm{nm}} = \dfrac{c_{\mathrm{vac}}}{\nu} \cdot 1e9\) при \(\nu\) в Hz, \(c_{\mathrm{vac}}=2.99792458e8\).
2. Если \(\lambda \notin [380, 750]\) — `visible=false`, `alpha=0` (или soft edge 20 nm).
3. Иначе — piecewise wavelength-to-RGB (стандартная approximация):

Типичные сегменты:
- 380–440: violet → blue
- 440–490: blue → cyan
- 490–510: cyan → green
- 510–580: green → yellow
- 580–645: yellow → red
- 645–750: red

С attenuate near ends (380–420 и 700–750) для alpha. Реализуй полную функцию в `frequency-to-rgb.ts` без внешних библиотек.

Альтернативный упрощённый путь (допустим **только** как fallback): сдвигать RGB базы звезды смешиванием к blue/red по \(\log(\nu_{\mathrm{obs}}/\nu_{\mathrm{em}})\), но **предпочтителен** spectral path через \(\lambda\).

---

## B.8 Relativistic mass (pedagogical)

\[
m_{\mathrm{rel}} = \gamma m_0
\]

Отображай в телеметрии с подписью i18n вроде «релятивистская масса \(m\gamma\)».

---

## B.9 Laser kinematics (rest frame)

Постулат:

\[
|\vec{v}_{\mathrm{laser}}| = c
\quad\text{для любого направления в системе покоя сектора.}
\]

Forward: \(\vec{v}=(c,0)\). Backward: \(\vec{v}=(-c,0)\).

Шаг:

\[
\vec{r}(t+\Delta t)=\vec{r}(t)+\vec{v}\,\Delta t
\]

где \(\Delta t\) — время в системе покоя (Earth/rest).

**Неверно:** \(\vec{v}=(v_{\mathrm{ship}}\pm c, 0)\).

Проверка инварианта в тестах:

```ts
expect(Math.hypot(pulse.vx, pulse.vy)).toBeCloseTo(C, 6);
```

для любого `beta`.

---

## B.10 Lorentz transformation (optional helper)

Координаты события между rest (unprimed) и ship (primed), оси совпадают в \(t=t'=0\), \(v\) вдоль \(X\):

\[
\begin{aligned}
x' &= \gamma (x - v t)\\
t' &= \gamma (t - v x / c^{2})\\
y' &= y\\
z' &= z
\end{aligned}
\]

Для визуализации звёздного поля в реальном времени **достаточно** аберрации + Доплера + контракции; полный 4-векторный пайплайн не обязателен, но helper `lorentzTransformX` допустим в `LorentzMathService` для демонстрации/тестов.

---

## B.11 Sanity checklist (formulas)

| Effect | β=0 | β→1 |
|--------|-----|-----|
| \(\gamma\) | 1 | \(\to\infty\) |
| Time ratio Earth/Ship | 1 | \(\to\infty\) |
| Ship length on map | \(L_0\) | \(\to 0\) |
| Starfield | isotropic | beamed forward |
| Forward stars color | base | blue / UV (disappear) |
| Rear stars color | base | red / IR (disappear) |
| Laser speed (rest) | \(c\) | \(c\) |
