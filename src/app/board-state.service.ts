import { Injectable } from '@angular/core';
import { GameState, Move } from '../types';
import { getPossibleMoves, isGameOver, calculateMove, generateBoard, isLegalMove, isLegalMove_2 } from '../functions';
import { Levels } from '../levels';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {

  boardHistory: GameState[] = [];
  _board!: GameState;

  private boardSubject: BehaviorSubject<GameState>;
  board$: Observable<GameState>;

  private animateVialSubject = new Subject<{ id: number, direction: 'up' | 'down' }>();
  animateVial$ = this.animateVialSubject.asObservable();

  moveInProgress: Pick<Move, 'fromVial' | 'stateBefore'>;

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
      const moveIsLegal = isLegalMove_2(this.moveInProgress.fromVial, this._board.vials[id]);
      console.log('finishing move, legal: ', moveIsLegal);
      if (moveIsLegal) {
        this.animateVialSubject.next({ id, direction: 'down' }); // bring down the ball on target vial
        this.makeMove({ ...this.moveInProgress, toVial: this._board.vials[id] });
        this.moveInProgress = null;
      } else { // move is illegal, put down the ball in the original vial and pick up the new one
        this.animateVialSubject.next({ id: this.moveInProgress.fromVial.id, direction: 'down' });
        this.moveInProgress = { stateBefore: this._board, fromVial: this._board.vials[id] };
        this.animateVialSubject.next({ id, direction: 'up' });
      }
    }
  }
}
