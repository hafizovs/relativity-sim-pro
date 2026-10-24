## Live demo

https://hafizovs.github.io/relativity-sim-pro/

# RelativitySim Pro

Interactive **special relativity** simulator (Angular 22+, Signals, Canvas 2D).

Component prefix: `rsp`.

## About

RelativitySim Pro is an interactive special-relativity simulator on Angular 22+ with Signals and Canvas 2D (component prefix `rsp`). It shows the Lorentz factor, time dilation and the twin paradox, length contraction, stellar aberration, Doppler shift, and laser pulses at \(c\) in the rest frame. The view is a teaching 2D picture of special relativity, not general relativity or a full radiative model.

## Capabilities

- Lorentz factor \(\gamma\) in the telemetry, growing with \(\beta\)
- Time dilation: Earth clock versus ship clock (twin paradox)
- Length contraction of the ship on the observer map: \(L = L_0/\gamma\)
- Aberration: stars bunch toward “forward” in the cockpit
- Doppler: blueshift ahead, redshift behind, and leaving the visible spectrum
- Lasers: in the rest frame \(|v| = c\) in both directions
- Play/pause, \(\beta\) presets, screenshot, theme, and RU/EN

## Functionality

- Play or pause with Space, and reset time and lasers with `R`
- Pick a \(\beta\) preset (`0`–`4`) or step \(\beta\) with `[` and `]`
- Fire a laser forward (`F`) or backward (`B`) and compare both directions in the rest frame
- Watch \(\gamma\), the two clocks, the contracted ship, the aberrated starfield, and the Doppler color shift
- Screenshot with `S`, toggle theme (`T`) and language (`G`), open help (`H`), and close overlays with Esc

## Start

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

```bash
npm test
npm run build
```

## Special-relativity effects

| Effect | What you see |
|--------|-----------|
| Lorentz factor γ | telemetry; it grows with β |
| Time dilation | Earth clock vs ship clock (twin paradox) |
| Length contraction | ship on the observer map: L = L₀/γ |
| Aberration | stars bunch toward “forward” in the cockpit |
| Doppler | blueshift ahead / redshift behind; leaving the visible spectrum |
| Lasers | in the rest frame \|v\| = c in both directions |

## Hotkeys

| Key | Action |
|---------|----------|
| Space | Play / Pause |
| R | Reset time and lasers |
| 0–4 | β presets |
| [ ] | Step β |
| F / B | Laser forward / backward |
| S | Screenshot |
| T | Theme |
| G | RU ↔ EN |
| H | Help |
| Esc | Close overlay |

## Disclaimer

This is a **teaching 2D visualization** of special relativity. It does not replace a textbook and does not model general relativity, the full relativistic emission of extended disks, or exact spectral synthesis. The term “relativistic mass” \(m\gamma\) is pedagogical.
