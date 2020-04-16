import { Injectable } from '@angular/core';
import { Vial, GameState, Move } from 'src/types';
import { getPossibleMoves, isGameOver, calculateMove, generateBoard } from 'src/functions';
import { Levels } from 'src/levels';

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
  possibleMoves: Move[] = [];

  constructor() {
    this.board = generateBoard(Levels[1]);
  }

  public getPossibleMoves() {
    return this.possibleMoves;
  }

  makeMove(move: Move) {
    const calculatedMove = calculateMove(this.board, move);
    this.board = calculatedMove.stateAfter;
  }
}
