import { Injectable } from '@angular/core';

import { Position } from '../shared/interfaces/position';
import { DirectionKeys } from '../shared/types/direction-keys';
import { Model } from '../shared/types/model';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  m!: Model;
  inputDirection: Position = { x: 0, y: 0 };
  lastInputDirection: Position = { x: 0, y: 0 };

  init(m: Model): void {
    this.m = m;
  }

  getInputs(): void {
    window.addEventListener('keydown', (e: KeyboardEvent): void => {
      if (
        !this.m.isPaused &&
        !this.m.gameOver &&
        Object.values(DirectionKeys).includes(e.code as DirectionKeys)
      ) {
        this.setDirection(e.code as DirectionKeys);
      }
    });
  }

  setDirection(direction: DirectionKeys): void {
    this.m.gameOver = false;
    switch (direction) {
      case DirectionKeys.arrowUp:
        if (this.lastInputDirection.y !== 0) break;
        this.inputDirection = { x: 0, y: -1 };
        this.m.headTurn = 180;
        break;
      case DirectionKeys.arrowDown:
        if (this.lastInputDirection.y !== 0) break;
        this.inputDirection = { x: 0, y: 1 };
        this.m.headTurn = 0;
        break;
      case DirectionKeys.arrowLeft:
        if (this.lastInputDirection.x !== 0) break;
        this.inputDirection = { x: -1, y: 0 };
        this.m.headTurn = 90;
        break;
      case DirectionKeys.arrowRight:
        if (this.lastInputDirection.x !== 0) break;
        this.inputDirection = { x: 1, y: 0 };
        this.m.headTurn = -90;
        break;
    }
  }

  getInputDirection(): Position {
    this.lastInputDirection = this.inputDirection;
    return this.inputDirection;
  }
}
