import type { Planet } from '../../core/models/planet.model';

export function createPlanetCatalog(): Planet[] {
  return [
    {
      id: 'terra',
      nameKey: 'planets.terra',
      x: 400,
      y: 0,
      properRadius: 28,
      baseColor: { r: 170, g: 210, b: 255 },
      label: 'Terra',
    },
    {
      id: 'kepler',
      nameKey: 'planets.kepler',
      x: 900,
      y: 40,
      properRadius: 36,
      baseColor: { r: 220, g: 160, b: 80 },
      label: 'Kepler',
    },
    {
      id: 'proxima',
      nameKey: 'planets.proxima',
      x: 1500,
      y: -30,
      properRadius: 22,
      baseColor: { r: 230, g: 110, b: 90 },
      label: 'Proxima',
    },
    {
      id: 'gaia',
      nameKey: 'planets.gaia',
      x: 2200,
      y: 20,
      properRadius: 44,
      baseColor: { r: 140, g: 200, b: 230 },
      label: 'Gaia',
    },
  ];
}
