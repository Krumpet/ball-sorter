import { Injectable } from '@angular/core';
import { GameState, Move, BallColor } from '../types';
import { getPossibleMoves, isGameOver, calculateMove, generateBoard, isLegalMove, topBall } from '../functions';
import { Levels } from '../levels';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {

  boardHistory: GameState[] = [];
  _board!: GameState;

  private boardSubject!: BehaviorSubject<GameState>;
  board$!: Observable<GameState>;

  private animateVialSubject = new Subject<{ id: number, direction: 'up' | 'down' }>();
  animateVial$ = this.animateVialSubject.asObservable();

  private newBallSubject = new Subject<{ id: number, color: BallColor }>();
  newBall$ = this.newBallSubject.asObservable();

  moveInProgress: Pick<Move, 'fromVial' | 'stateBefore'> | null = null;

  isGameWon = false;
  set board(newState: GameState) {
    this._board = newState;
    this.possibleMoves = getPossibleMoves(this._board);
    this.boardHistory.push(this._board); // TODO: option to reset when switching levels
    this.isGameWon = isGameOver(this._board);
    if (!!this.boardSubject) {
      this.boardSubject.next(this._board);
    } else {
      this.boardSubject = new BehaviorSubject(this._board);
      this.board$ = this.boardSubject.asObservable();
    }
  }
  get board() {
    return this._board;
  }
  possibleMoves: Move[] = [];

  constructor() {
    this.board = generateBoard(Levels[4]);
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
