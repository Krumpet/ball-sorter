import { Injectable } from '@angular/core';
import { CalculatedMove, GameState, Move, BFSGameStateNode, AStarConfig, AStarStateNode } from '../types';
import {
  createBFSNodeFromState, stringifyMove, createDFSNodeFromState, isGameOver, areStatesEqual, stringifyState,
  createAStarNodeFromState, getPath, calculateEntropyForState
} from '../functions';
import PriorityQueue from '../assets/data structures/PriorityQueue';

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  moveList!: CalculatedMove[];

  constructor() { }

  solve(board: GameState, method: 'BFS' | 'BFS-Recursive' | 'DFS' | 'AStar' = 'AStar') {
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
        break;
      case 'AStar':
        moves = this.solveAStar(board, {
          heuristic: (a) => calculateEntropyForState(a),
          heuristicScale: 1.0, costFunction: (a) => 0, costScale: 0
        });
        break;
    }
    console.log(moves ? moves.map(stringifyMove) : 'no solution!');
    // this is done to check if a greedy best-first search algorithm would work, but we don't always choose the state with lowest entropy:
    // moves.map(move => move.stateBefore).forEach(state => {
    //   const stateEntropy = calculateEntropyForState(state);
    //   const possibleMovesFromHere = createBFSNodeFromState(state).possibleMoves;
    //   const possibleStatesFromHere = possibleMovesFromHere.map(move => move.stateAfter);
    //   const possibleEntropiesFromHere = possibleStatesFromHere.map(calculateEntropyForState);
    //   console.log(`${possibleMovesFromHere.length} possible moves,
    //    state entropy is ${stateEntropy},
    //    lowest entropy after a move is ${Math.min(...possibleEntropiesFromHere)}`);
    // });
  }

  solveRecursiveDFS(board: GameState, moveList: Move[] = [], depth = 0): Move[] | null {
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

  solveAStar(state: GameState, config: AStarConfig) {
    const stateNode: AStarStateNode = createAStarNodeFromState(state, config);
    // const openSet = new MinHeap<AStarStateNode>((a, b) => a.score < b.score ? -1 : a.score > b.score ? 1 : 0);
    const openSet = new PriorityQueue<AStarStateNode>(
      (a, b) => a.score < b.score ? -1 : a.score > b.score ? 1 : 0,
      (a, b) => a.stringState === b.stringState ? 0 : -1 // is acutally only equality comparator
    );
    const gScores: { [k: string]: number } = {};
    // const hScores: { [k: string]: number } = {};
    // const closedNodes: { [k: string]: AStarStateNode } = {};
    const parents: { [k: string]: AStarStateNode } = { [stateNode.stringState]: null };

    openSet.add(stateNode, stateNode.score);

    while (openSet.size() > 0) {
      let current = openSet.poll();
      if (isGameOver(current.stateNode)) {
        return getPath(current, parents);
      }

      // closedNodes[current.stringState] = current;

      const possibleNextStates = current.stateNode.possibleMoves
        .map(move => ({ move, after: move.stateAfter })) // todo: avoid calculating heuristics again
        .map(({ move, after }) => createAStarNodeFromState(after, config, [...current.stateNode.movesToHere, move]));

      possibleNextStates.forEach(neighbor => {
        // improved score for a state?
        if (gScores[neighbor.stringState] == undefined || neighbor.distance < gScores[neighbor.stringState]) { // comparing to undefined in case of score 0
          parents[neighbor.stringState] = current;
          gScores[neighbor.stringState] = neighbor.distance;
          // if (!!closedNodes[neighbor.stringState]) {
          //   delete closedNodes[neighbor.stringState];
          // }
          if (!openSet.findByValue(neighbor).length) { // compares using stringState
            openSet.add(neighbor, neighbor.score);
          }
        }

      });
    }
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
