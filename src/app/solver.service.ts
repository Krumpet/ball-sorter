import { Injectable } from '@angular/core';
import { CalculatedMove, GameState, Move, BFSGameStateNode, AStarConfig, AStarStateNode, StringState } from '../types';
import {
  createBFSNodeFromState, stringifyMove, createDFSNodeFromState, isGameOver, areStatesEqual, stringifyState,
  createAStarNodeFromState, getPath, calculateEntropyForState, calculateDistanceHeuristicForState
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
        moves = this.solveBFS(board).moves;
        break;
      case 'AStar':
        moves = this.solveWithPerformance(method, this.solveAStar, board, {
          heuristic: (a) => calculateEntropyForState(a),
          heuristicScale: 35.0,
          costFunction: (a) => a.movesToHere.length,
          costScale: 1.0
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

  solveWithPerformance<In extends unknown[], Out>(name: string, func: (...args: In) => Out, ...args: In): Out {
    const start = 'start' + name, end = 'end' + name;
    performance.mark(start);
    const result = func(...args);
    performance.mark(end);
    performance.measure(name, start, end);
    console.log(name + ' took ' + performance.getEntriesByName(name)[0].duration + ' ms');
    performance.clearMarks();
    performance.clearMeasures();
    return result;
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

  solveBFS(board: GameState): { moves: Move[] | null, nodeStats: { opened: number, totalUnique: number } } {
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

        return { moves: stateToExplore.movesToHere, nodeStats: { totalUnique: exploredStatesNumber, opened: exploredStatesNumber } };
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

    const heuristics: { [k in StringState]: number } = {};
    const stateNode: AStarStateNode = createAStarNodeFromState(state, heuristics, config);
    const gScores: { [k in StringState]: number } = { [stateNode.stringState]: stateNode.distance };
    const parents: { [k in StringState]: AStarStateNode } = { [stateNode.stringState]: null };
    const openSet = new PriorityQueue<AStarStateNode>(
      (a, b) => a.score < b.score ? -1 : a.score > b.score ? 1 : 0,
      (a, b) => a.stringState === b.stringState ? 0 : -1 // is actually only equality comparator
    );

    openSet.add(stateNode, stateNode.score);

    while (openSet.size() > 0) {
      const current = openSet.poll();
      if (isGameOver(current.stateNode)) {
        return getPath(current, parents);
      }

      const possibleNextStates = current.stateNode.possibleMoves
        .map(move => ({ move, after: move.stateAfter }))
        .map(({ move, after }) => createAStarNodeFromState(after, heuristics, config, [...current.stateNode.movesToHere, move]));

      possibleNextStates.forEach(neighbor => {
        // improved score for a state?
        if (!(neighbor.stringState in gScores) || neighbor.distance < gScores[neighbor.stringState]) {
          // parents[neighbor.stringState] = current; // TODO: do I need to maintain parents or is "moves to here" good enough?
          gScores[neighbor.stringState] = neighbor.distance;
          const existingNodeIndicesInOpenSet = openSet.findByValue(neighbor);
          if (existingNodeIndicesInOpenSet.length) {
            if (existingNodeIndicesInOpenSet.length > 1) { console.log('more than one!'); }
            openSet.removeMatching(neighbor);
          }
          openSet.add(neighbor, neighbor.score);
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
