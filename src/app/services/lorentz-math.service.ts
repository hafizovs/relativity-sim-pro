import { Injectable } from '@angular/core';
import { C } from '../core/constants/physics.constants';
import { aberrateAngle, aberrateDirection } from '../domain/relativity/aberration';
import {
  dopplerFactorGeneral,
  dopplerFactorHeadOn,
  shiftFrequency,
} from '../domain/relativity/doppler';
import { frequencyToRgb } from '../domain/relativity/frequency-to-rgb';
import { contractLength } from '../domain/relativity/length-contraction';
import { betaFromVelocity, clampBeta, gamma } from '../domain/relativity/lorentz-factor';
import { dilateStaticTime } from '../domain/relativity/time-dilation';

@Injectable({ providedIn: 'root' })
export class LorentzMathService {
  beta(v: number, c: number = C): number {
    return betaFromVelocity(v, c);
  }

  gamma(beta: number): number {
    return gamma(beta);
  }

  clampBeta(beta: number): number {
    return clampBeta(beta);
  }

  dilateStaticTime(deltaShip: number, gammaValue: number): number {
    return dilateStaticTime(deltaShip, gammaValue);
  }

  contractLength(properLength: number, gammaValue: number): number {
    return contractLength(properLength, gammaValue);
  }

  aberrateAngle(thetaEmitted: number, beta: number): number {
    return aberrateAngle(thetaEmitted, beta);
  }

  aberrateDirection(
    dirX: number,
    dirY: number,
    beta: number,
  ): { x: number; y: number } {
    return aberrateDirection(dirX, dirY, beta);
  }

  dopplerFactorHeadOn(beta: number, approaching: boolean): number {
    return dopplerFactorHeadOn(beta, approaching);
  }

  dopplerFactorGeneral(beta: number, cosThetaObserved: number): number {
    return dopplerFactorGeneral(beta, cosThetaObserved);
  }

  shiftFrequency(nuEmitted: number, factor: number): number {
    return shiftFrequency(nuEmitted, factor);
  }

  frequencyToRgb(nuHz: number) {
    return frequencyToRgb(nuHz);
  }

  relativisticMass(restMass: number, gammaValue: number): number {
    return restMass * gammaValue;
  }
}
