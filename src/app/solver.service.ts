import { Injectable } from '@angular/core';
import { GameState, CalculatedMove, CalculatedMoveForSolver, GameStateNode, Move } from 'src/types';
import { getPossibleMoves, calculateMove, isGameOver, createNodeFromState, areStatesEqual, stringifyMove } from 'src/functions';

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  moveList: CalculatedMove[];

  constructor() { }

  solve(board: GameState) {
    const boardStateNode: GameStateNode = createNodeFromState(board);
    const moves = this.solveRecursive(boardStateNode);
    console.log(moves ? moves.map(stringifyMove) : 'no solution!');
  }

  solveRecursive(boardStateNode: GameStateNode, moveList: Move[] = [], depth = 0): Move[] | null {
    // if (depth > 10) {
    //   console.log('too deep');
    //   return null;
    // }
    if (isGameOver(boardStateNode)) {
      return moveList;
    }
    const possibleGoodMoves = boardStateNode.possibleMoves.filter(move => !move.isBad);
    if (possibleGoodMoves.length === 0) {
      return null;
    }
    // TODO: sort moves using heuristic
    for (let index = 0; index < possibleGoodMoves.length; index++) {
      const candidate = possibleGoodMoves[index];
      if (moveList.map(m => m.stateBefore).some(state => areStatesEqual(state, candidate.stateAfter))) {
        const existingState = moveList.find(m => areStatesEqual(m.stateBefore, candidate.stateAfter)).stateBefore;
        // loop detected
        console.log('loop', existingState, candidate, candidate.stateAfter);
        candidate.isBad = true;
        continue;
      }
      console.log('trying move ', candidate);
      moveList.push(candidate);
      const newBoardStateNode = createNodeFromState(candidate.stateAfter);
      const result = this.solveRecursive(newBoardStateNode, moveList, depth + 1);
      if (!result) {
        moveList.pop();
        candidate.isBad = true;
      } else {
        return moveList;
      }
    }
    // got here, no solution
    return null;
  }
}
