import { Injectable } from '@angular/core';
import { Vial, GameState, Move } from 'src/types';
import { getPossibleMoves, isGameOver } from 'src/functions';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {
  boardHistory: GameState[] = [];
  _board: GameState;
  isGameWon = false;
  set board(v: GameState) {
    this._board = v;
    this.possibleMoves = getPossibleMoves(this._board);
    this.boardHistory.push(this._board);
    this.isGameWon = isGameOver(this._board);
  }
  get board() {
    return this._board;
  }
  possibleMoves: Move[];

  constructor() {
    this.board = { vials: [new Vial(['red']), new Vial(['red', 'red', 'red'])], moveToHere: null };
  }

  public getPossibleMoves() {
    return this.possibleMoves;
  }

  makeMove(move: Move) {
    const newState: GameState = JSON.parse(JSON.stringify(this.board));
    const movedBall = newState.vials.find(v => v.id === move.fromVial.id).balls.pop();
    newState.vials.find(v => v.id === move.toVial.id).balls.push(movedBall);
    newState.moveToHere = move;
    this.board = newState;
  }
}
