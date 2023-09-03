import { Injectable } from '@angular/core';
import { AppConstants } from '../shared/constans/constants';
import { Position } from '../shared/interfaces/position';
import { Model } from '../shared/types/model';
import { InputService } from './input.service';
import { ObstacleService } from './obstacles.service';

@Injectable({
  providedIn: 'root',
})
export class SnakeService {
  m!: Model;

  constructor(
    readonly input: InputService,
    private readonly obstacle: ObstacleService,
  ) {}

  init(m: Model): void {
    this.m = m;
  }

  listenToInputs(): void {
    this.input.getInputs();
  }

  update(): void {
    this.moveSnakeBody();
    this.updateSnakeHead();
    this.checkSnakeIntersection();
  }

  draw(gameBoard: any): void {
    this.m.snakeBody.forEach(
      (segment: { x: number; y: number }, i: number): void => {
        const snakeElement: HTMLDivElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y.toString();
        snakeElement.style.gridColumnStart = segment.x.toString();
        snakeElement.classList.add('snake');
        if (i == 0) {
          snakeElement.classList.add('head');
        }
        snakeElement.style.transform = 'rotate(' + this.m.headTurn + 'deg)';
        gameBoard.appendChild(snakeElement);
      },
    );
  }

  expandSnake(): void {
    this.m.newSegments += 1;
  }

  onSnake(): boolean {
    return this.m.snakeBody.some((segment: Position): boolean => {
      return this.equalPositions(segment, this.m.foodPosition);
    });
  }

  equalPositions(pos1: Position, pos2: Position): boolean {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  private outsideGrid(position1: Position, position2: Position): boolean {
    return (
      (position1.x === 1 && position2.x === AppConstants.gridSizeX) ||
      (position1.x === AppConstants.gridSizeX && position2.x === 1) ||
      (position1.y === 1 && position2.y === AppConstants.gridSizeY) ||
      (position1.y === AppConstants.gridSizeY && position2.y === 1)
    );
  }

  private addSegments(): void {
    for (let i: number = 0; i < this.m.newSegments; i++) {
      this.m.snakeBody.push({
        ...this.m.snakeBody[this.m.snakeBody.length - 1],
      });
    }

    this.m.newSegments = 0;
  }

  private moveSnakeBody(): void {
    this.addSegments();

    for (let i: number = this.m.snakeBody.length - 2; i >= 0; i--) {
      this.m.snakeBody[i + 1] = { ...this.m.snakeBody[i] };
    }
  }

  private updateSnakeHead(): void {
    const inputDirection: Position = this.input.getInputDirection();
    const newHeadX: number =
      ((this.m.snakeBody[0].x + inputDirection.x + AppConstants.gridSizeX - 1) %
        AppConstants.gridSizeX) +
      1;
    const newHeadY: number =
      ((this.m.snakeBody[0].y + inputDirection.y + AppConstants.gridSizeY - 1) %
        AppConstants.gridSizeY) +
      1;

    if (
      (this.m.level < 5 &&
        this.outsideGrid(this.m.snakeBody[0], { x: newHeadX, y: newHeadY })) ||
      this.obstacle.checkObstacleCollision(this.m.snakeBody[0])
    ) {
      this.m.gameOver = true;
    }

    this.m.snakeBody[0] = { x: newHeadX, y: newHeadY };
  }

  private snakeIntersection(): number {
    for (let i: number = 1; i < this.m.snakeBody.length; i++) {
      if (this.equalPositions(this.m.snakeBody[0], this.m.snakeBody[i]))
        return i;
    }
    return 0;
  }

  private checkSnakeIntersection(): void {
    const intersectionIndex: number = this.snakeIntersection();

    if (intersectionIndex) {
      if (this.m.level < 10) {
        this.m.gameOver = true;
      } else {
        this.m.eatSnakeSound.play();
        this.m.snakeBody.splice(Number(intersectionIndex));
        this.m.score = this.m.snakeBody.length - 1;
        this.m.levelUpdate();
      }
    }
  }
}
