import { Subscription } from 'rxjs';
import { Position } from '../interfaces/position';

export class Model {
  timeSubscription!: Subscription;
  lastRenderTime: number = 0;
  requiredObstacles: number = 0;
  gameBoard!: HTMLDivElement;

  bestScore: number = 0;
  score: number = 0;

  newSegments: number = 0;

  foodPosition: Position = { x: -5, y: -5 };
  snakeBody: Position[] = [{ x: 16, y: 9 }];
  obstacles: Position[] = [];

  headTurn: number = 0;

  time: number = 0;

  eatFoodSound: HTMLAudioElement = new Audio('assets/sounds/eating.wav');
  deathSound: HTMLAudioElement = new Audio('assets/sounds/o-kurva.wav');
  eatSnakeSound: HTMLAudioElement = new Audio('assets/sounds/eralash.wav');

  readonly baseSpeed: number = 3;
  private _level: number = 1;
  private _isPaused: boolean = false;
  private _gameOver!: boolean;

  get level(): number {
    return this._level;
  }

  set level(value: number) {
    if (value >= 5) this.gameBoard.style.border = '3px solid blue';
    else this.gameBoard.style.border = '3px solid red';

    if (value >= 10) this.requiredObstacles = value - 5;
    else this.requiredObstacles = 0;

    this._level = value;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  set isPaused(value: boolean) {
    this._isPaused = value;
  }

  get gameOver(): boolean {
    return this._gameOver;
  }

  set gameOver(value: boolean) {
    this._gameOver = value;
    if (value) this.isPaused = true;
  }

  levelUpdate(): void {
    this.level = Math.ceil((this.score + 1) / 10);
  }
}
