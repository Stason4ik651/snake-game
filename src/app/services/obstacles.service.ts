import { Injectable } from '@angular/core';
import { Position } from '../shared/interfaces/position';
import { Model } from '../shared/types/model';
import { PositionGeneratorService } from './position-generator.service';

@Injectable({
  providedIn: 'root',
})
export class ObstacleService {
  m!: Model;

  constructor(
    private readonly positionGeneratorService: PositionGeneratorService,
  ) {}

  init(m: Model): void {
    this.m = m;
  }

  update(): void {
    while (this.m.obstacles.length < this.m.requiredObstacles) {
      this.addObstacle();
    }
    while (this.m.obstacles.length > this.m.requiredObstacles) {
      this.m.obstacles.pop();
    }
  }

  draw(gameBoard: any): void {
    this.m.obstacles.forEach((position) => {
      const obstacleElement: HTMLDivElement = document.createElement('div');
      obstacleElement.style.gridRowStart = position.y.toString();
      obstacleElement.style.gridColumnStart = position.x.toString();
      obstacleElement.classList.add('obstacle');
      gameBoard.appendChild(obstacleElement);
    });
  }

  addObstacle(): void {
    this.m.obstacles.push(
      this.positionGeneratorService.getRandomGridPosition(),
    );
  }

  checkObstacleCollision(position: Position): boolean {
    return this.m.obstacles.some(
      (obstacle: Position) =>
        obstacle.x === position.x && obstacle.y === position.y,
    );
  }
}
