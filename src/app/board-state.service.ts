import { Injectable } from '@angular/core';
import { GameState, Move } from '../types';
import { getPossibleMoves, isGameOver, calculateMove, generateBoard } from '../functions';
import { Levels } from '../levels';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {
  boardHistory: GameState[] = [];
  _board!: GameState;
  isGameWon = false;
  set board(newState: GameState) {
    this._board = newState;
    this.possibleMoves = getPossibleMoves(this._board);
    this.boardHistory.push(this._board); // TODO: option to reset when switching levels
    this.isGameWon = isGameOver(this._board);
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
}
