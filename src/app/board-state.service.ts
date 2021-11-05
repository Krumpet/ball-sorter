import { Injectable } from '@angular/core';
import { GameState, Move, BallColor } from '../types';
import { getPossibleMoves, isGameOver, calculateMove, generateBoard, isLegalMove, topBall, CountArrayItemsByFunction } from '../functions';
import { Levels } from '../levels';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ballsPerColor } from '../consts';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {

  private boardSubject: ReplaySubject<GameState> = new ReplaySubject(1);
  board$: Observable<GameState> = this.boardSubject.asObservable();

  private animateVialSubject = new Subject<{ id: number, direction: 'up' | 'down' }>();
  animateVial$ = this.animateVialSubject.asObservable();

  // TODO: to be used when adding animation to the vial that's getting a new ball
  private newBallSubject = new Subject<{ id: number, color: BallColor }>();
  newBall$ = this.newBallSubject.asObservable();

  moveInProgress: Pick<Move, 'fromVial' | 'stateBefore'> | null = null;

  isGameWon = false;

  private _board!: GameState;

  set board(newState: GameState) {
    this._board = newState;
    this.possibleMoves = getPossibleMoves(this._board);
    this.isGameWon = isGameOver(this._board);
    this.boardSubject.next(this._board);
  }

  get board() {
    return this._board;
  }

  possibleMoves: Move[] = [];

  constructor() {
    this.board = generateBoard(Levels[6]);
    const ballsByColor = this.groupBoardBallsByColor(this.board);
    if (!this.boardIsValid(ballsByColor)) {
      console.log('invalid board, found: ', ballsByColor);
    }
  }

  private groupBoardBallsByColor(board: GameState) {
    return CountArrayItemsByFunction(board.vials.map(vial => vial.balls).flat(1), ball => ball.color);
  }

  private boardIsValid(ballsByColor: Partial<Record<BallColor, number>>) {
    return Object.values(ballsByColor).every((amount) => (amount! <= ballsPerColor && amount! >= 0));
  }

  public getPossibleMoves() {
    return this.possibleMoves;
  }

  makeMove(move: Move) {
    const calculatedMove = calculateMove(this.board, move);
    this.board = calculatedMove.stateAfter;
  }

  vialClicked(id: number) {
    if (!this.moveInProgress) { // starting new move
      this.moveInProgress = { stateBefore: this._board, fromVial: this._board.vials[id] };
      this.animateVialSubject.next({ id, direction: 'up' });
    } else { // finish existing move, if legal
      const moveIsLegal = isLegalMove(this.moveInProgress.fromVial, this._board.vials[id]);
      if (moveIsLegal) {
        this.newBallSubject.next({ id, color: topBall(this.moveInProgress.fromVial).color });
        this.makeMove({ ...this.moveInProgress, toVial: this._board.vials[id] });
        this.moveInProgress = null;
      } else { // move is illegal, put down the ball in the original vial and (maybe) pick up the new one
        this.animateVialSubject.next({ id: this.moveInProgress.fromVial.id, direction: 'down' });
        if (id === this.moveInProgress.fromVial.id) { // putting down ball in original vial
          this.moveInProgress = null;
        } else { // pick up the new one
          this.moveInProgress = { stateBefore: this._board, fromVial: this._board.vials[id] };
          this.animateVialSubject.next({ id, direction: 'up' });
        }
      }
    }
  }
}
