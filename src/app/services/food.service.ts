import { Injectable } from '@angular/core';
import { AppConstants } from '../shared/constans/constants';
import { Position } from '../shared/interfaces/position';
import { Model } from '../shared/types/model';
import { PositionGeneratorService } from './position-generator.service';
import { SnakeService } from './snake.service';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  m!: Model;

  constructor(
    private readonly snake: SnakeService,
    private readonly positionGeneratorService: PositionGeneratorService,
  ) {}

  set addScore(val: number) {
    this.m.score += val;
    this.m.levelUpdate();
    if (this.m.score > this.m.bestScore) {
      this.m.bestScore = this.m.score;
      localStorage.setItem(
        AppConstants.localStorageKey,
        this.m.bestScore.toString(),
      );
    }
  }

  get currentScore() {
    return this.m.score;
  }

  init(m: Model): void {
    this.m = m;
    this.m.foodPosition = this.getRandomFoodPosition();
  }

  update(): void {
    if (this.snake.onSnake()) {
      this.snake.expandSnake();
      this.m.foodPosition = this.getRandomFoodPosition();
      this.addScore = 1;
      this.m.eatFoodSound.play();
    }
  }

  draw(gameBoard: any): void {
    const foodElement: HTMLDivElement = document.createElement('div');
    foodElement.style.gridRowStart = this.m.foodPosition.y.toString();
    foodElement.style.gridColumnStart = this.m.foodPosition.x.toString();
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
  }

  getRandomFoodPosition(): Position {
    return this.positionGeneratorService.getRandomGridPosition();
  }
}
