import { describe, expect, it } from 'vitest';
import { aberrateAngle, aberrateDirection } from './aberration';

describe('aberration', () => {
  it('β=0 leaves angle unchanged', () => {
    const theta = Math.PI / 4;
    expect(aberrateAngle(theta, 0)).toBeCloseTo(theta, 10);
  });

  it('β→1 pulls forward angles toward θ=0', () => {
    const theta = Math.PI / 3;
    const obs = aberrateAngle(theta, 0.999);
    expect(Math.abs(obs)).toBeLessThan(Math.abs(theta));
    expect(Math.abs(obs)).toBeLessThan(0.2);
  });

  it('matches line-of-sight cos formula (headlight form)', () => {
    const beta = 0.6;
    const thetaEm = Math.PI / 5;
    const cosEm = Math.cos(thetaEm);
    const cosObsExpected = (cosEm + beta) / (1 + beta * cosEm);
    const thetaObs = aberrateAngle(thetaEm, beta);
    expect(Math.cos(thetaObs)).toBeCloseTo(cosObsExpected, 8);
  });

  it('aberrateDirection returns unit vector', () => {
    const d = aberrateDirection(3, 4, 0.5);
    expect(Math.hypot(d.x, d.y)).toBeCloseTo(1, 10);
  });
});
