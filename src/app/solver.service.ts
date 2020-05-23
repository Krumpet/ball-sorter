import { Injectable } from '@angular/core';
import { CalculatedMove, GameState, Move, BFSGameStateNode } from '../types';
import { createBFSNodeFromState, stringifyMove, createDFSNodeFromState, isGameOver, areStatesEqual, stringifyState } from '../functions';

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  moveList!: CalculatedMove[];

  constructor() { }

  solve(board: GameState, method: 'BFS' | 'BFS-Recursive' | 'DFS' = 'BFS') {
    let moves: Move[] | null = null;
    switch (method) {
      case 'DFS':
        moves = this.solveRecursiveDFS(board);
        break;
      case 'BFS-Recursive':
        moves = this.solveRecursiveBFS(createBFSNodeFromState(board));
        break;
      case 'BFS':
        moves = this.solveBFS(board);
    }
    console.log(moves ? moves.map(stringifyMove) : 'no solution!');
  }

  solveRecursiveDFS(board: GameState, moveList: Move[] = [], depth = 0): Move[] | null {
    // if (depth > 10) {
    //   console.log('too deep');
    //   return null;
    // }
    const boardStateNode = createDFSNodeFromState(board);
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
      const possibleMoveFromCandidateStateAfter = moveList.find(m => areStatesEqual(m.stateBefore, candidate.stateAfter));
      if (possibleMoveFromCandidateStateAfter) {
        const existingState = possibleMoveFromCandidateStateAfter.stateBefore;
        // loop detected
        console.log('loop', existingState, candidate, candidate.stateAfter);
        candidate.isBad = true;
        continue;
      }
      console.log('trying move ', candidate);
      moveList.push(candidate);
      const result = this.solveRecursiveDFS(candidate.stateAfter, moveList, depth + 1);
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

  solveRecursiveBFS(board: BFSGameStateNode,
    statesToExplore: BFSGameStateNode[] = [],
    exploredStates: Set<string> = new Set()): Move[] | null {
    if (isGameOver(board)) {
      return board.movesToHere;
    }

    this.updateNewStates(board, exploredStates, statesToExplore);

    if (statesToExplore.length === 0) {
      return null;
    }
    const nextStateToCheck = <BFSGameStateNode>statesToExplore.shift();
    return this.solveRecursiveBFS(nextStateToCheck, statesToExplore, exploredStates);
  }

  solveBFS(board: GameState): Move[] | null {
    const start = 'startBFS', end = 'endBFS';
    performance.mark(start);
    let exploredStatesNumber = 0;
    const exploredStates = new Set<string>([stringifyState(board)]);
    const boardStateNode = createBFSNodeFromState(board);
    const statesToExplore = [boardStateNode];
    while (statesToExplore.length) {
      exploredStatesNumber++;
      const stateToExplore = statesToExplore.shift();
      if (isGameOver(stateToExplore)) {
        // TODO: single point of return, break from here
        performance.mark(end);
        performance.measure('BFS total time', start, end);
        console.log('BFS took ' + performance.getEntriesByName('BFS total time')[0].duration + ' ms');
        console.log(`BFS explored ${exploredStatesNumber} states`);

        performance.clearMarks();
        performance.clearMeasures();

        return stateToExplore.movesToHere;
      }
      this.updateNewStates(stateToExplore, exploredStates, statesToExplore);
    }
    performance.mark(end);
    performance.measure('BFS total time', start, end);
    console.log('BFS took ' + performance.getEntriesByName('BFS total time')[0].duration + ' ms');
    console.log(`BFS explored ${exploredStatesNumber} states and failed`);

    performance.clearMarks();
    performance.clearMeasures();
    return null;
  }

  private updateNewStates(board: BFSGameStateNode, exploredStates: Set<string>, statesToExplore: BFSGameStateNode[]) {
    board.possibleMoves
      // don't add moves that lead to states we've seen
      .filter(move => !exploredStates.has(stringifyState(move.stateAfter)))
      // append the move leading up to the next state to the moves leading to the current state
      .map(move => createBFSNodeFromState(move.stateAfter, [...board.movesToHere, move]))
      .forEach(state => {
        // add new state to set of seen states
        exploredStates.add(stringifyState(state));
        // add new state to be explored
        statesToExplore.push(state);
      });
  }
}
