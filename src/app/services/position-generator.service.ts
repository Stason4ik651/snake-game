import { Injectable } from '@angular/core';
import { AppConstants } from '../shared/constans/constants';

import { Position } from '../shared/interfaces/position';
import { Model } from '../shared/types/model';

@Injectable({ providedIn: 'root' })
export class PositionGeneratorService {
  m!: Model;
  private readonly excludeRadius: number;
  private readonly maxX: number;
  private readonly maxY: number;

  constructor() {
    this.excludeRadius = 5;
    this.maxX = AppConstants.gridSizeX;
    this.maxY = AppConstants.gridSizeY;
  }

  init(m: Model): void {
    this.m = m;
  }

  getRandomGridPosition(): Position {
    let newPosition: Position;
    do {
      newPosition = this.generateRandomPosition();
    } while (this.isInvalidPosition(newPosition));

    return newPosition;
  }

  private generateRandomPosition(): Position {
    return {
      x: Math.floor(Math.random() * this.maxX) + 1,
      y: Math.floor(Math.random() * this.maxY) + 1,
    };
  }

  private isInvalidPosition(position: Position): boolean {
    return (
      this.isOccupiedPosition(
        position,
        [this.m.snakeBody[0]],
        this.excludeRadius,
      ) ||
      this.isOccupiedPosition(position, this.m.snakeBody) ||
      this.isOccupiedPosition(position, this.m.obstacles) ||
      this.isOccupiedPosition(position, [this.m.foodPosition])
    );
  }

  private isOccupiedPosition(
    position: Position,
    elements: Position[],
    excludeRadius: number = 1,
  ): boolean {
    return elements.some(
      (element: Position) =>
        Math.abs(element.x - position.x) <= excludeRadius &&
        Math.abs(element.y - position.y) <= excludeRadius,
    );
  }
}
