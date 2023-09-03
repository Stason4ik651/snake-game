import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { FoodService } from '../services/food.service';
import { InputService } from '../services/input.service';
import { ObstacleService } from '../services/obstacles.service';
import { PositionGeneratorService } from '../services/position-generator.service';
import { SnakeService } from '../services/snake.service';
import { TimerService } from '../services/timer.service';
import { AppConstants } from '../shared/constans/constants';
import { DirectionKeys } from '../shared/types/direction-keys';
import { Model } from '../shared/types/model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  m: Model = new Model();
  protected readonly DirectionKeys = DirectionKeys;

  constructor(
    readonly foodService: FoodService,
    private readonly snakeService: SnakeService,
    private readonly positionGeneratorService: PositionGeneratorService,
    private readonly inputService: InputService,
    private readonly obstacleService: ObstacleService,
    readonly timer: TimerService,
  ) {}

  get snakeSpeed(): number {
    return this.m.level < 10
      ? this.m.baseSpeed + this.m.level
      : this.m.baseSpeed + 10;
  }

  ngOnInit(): void {
    this.positionGeneratorService.init(this.m);
    this.snakeService.init(this.m);
    this.snakeService.listenToInputs();
    this.foodService.init(this.m);
    this.timer.init(this.m);
    this.inputService.init(this.m);
    this.obstacleService.init(this.m);
    // this.audioService.init(this.m);
    this.m.bestScore =
      Number(localStorage.getItem(AppConstants.localStorageKey)) || 0;

    this.m.timeSubscription = interval(1000).subscribe((): void => {
      if (this.m.gameOver !== undefined) this.timer.updateTime();
    });
  }

  ngAfterViewInit(): void {
    this.m.gameBoard = document.querySelector(
      AppConstants.gameBoardContainer,
    ) as HTMLDivElement;
    if (!this.m.gameBoard)
      throw new Error(
        `Can't find container with selector "${AppConstants.gameBoardContainer}"`,
      );

    window.requestAnimationFrame(this.start.bind(this));
    document.addEventListener('keydown', (event: KeyboardEvent): void => {
      if (event.code === 'Escape' && this.m.gameOver !== undefined)
        this.togglePause();
      if (event.code === 'KeyR') this.restart();
    });
  }

  start(currentTime: any): void {
    if (this.m.isPaused) return;
    window.requestAnimationFrame(this.start.bind(this));
    const secondsSinceLastRender: number =
      (currentTime - this.m.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.snakeSpeed) return;
    this.m.lastRenderTime = currentTime;
    this.update();

    if (!this.m.gameOver) this.draw();
  }

  dPadMovement(direction: DirectionKeys): void {
    this.snakeService.input.setDirection(direction);
  }

  update(): void {
    this.snakeService.update();
    this.foodService.update();
    this.obstacleService.update();
    this.checkDeath();
  }

  draw(): void {
    this.m.gameBoard.innerHTML = '';
    this.snakeService.draw(this.m.gameBoard);
    this.foodService.draw(this.m.gameBoard);
    this.obstacleService.draw(this.m.gameBoard);
  }

  checkDeath(): void {
    if (!this.m.gameOver) return;
    this.m.gameBoard.classList.add('blur');
    this.m.deathSound.play();
  }

  restart(): void {
    window.location.reload();
  }

  togglePause(): void {
    if (this.m.isPaused) {
      this.timer.resumeTimer();
      this.start(performance.now());
    } else {
      this.timer.pauseTimer();
    }
  }

  ngOnDestroy(): void {
    this.m.timeSubscription.unsubscribe();
  }
}
