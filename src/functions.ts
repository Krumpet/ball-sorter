import {
  Vial, Ball, GameState, Move,
  CalculatedMove, DFSGameStateNode,
<<<<<<< HEAD
  CalculatedMoveForSolver, GameDescription, VialDescription, BFSGameStateNode, NotEmptyVial, BallColor
} from './types';
import { ballsPerColor, ballsPerVial } from './consts';
import { log } from 'util';
=======
  CalculatedMoveForSolver, GameDescription, VialDescription, BFSGameStateNode, NotEmptyVial
} from './types';
import { ballsPerColor, ballsPerVial } from './consts';
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4

export function topBall(vial: NotEmptyVial): Ball {
  return vial.balls[vial.balls.length - 1];
}

export function hasBalls(vial: Vial): vial is NotEmptyVial {
  return !isEmpty(vial);
}

export function isEmpty(vial: Vial): boolean {
  return vial.balls.length === 0;
}

export function isFull(vial: Vial): boolean {
  return vial.balls.length === ballsPerVial;
}

/**
 * if every vial is empty or has all of balls of the same color
 * @param state gameState
 */
export function isGameOver(state: GameState) {
  return state.vials.every(vial => isEmpty(vial) || isComplete(vial));
}

export function isComplete(vial: Vial): boolean {
  return vial.balls.length === ballsPerColor && vial.balls.every(b => b.color === vial.balls[0].color);
}

export function getPossibleMoves(stateBefore: GameState): Move[] {
  if (isGameOver(stateBefore)) {
    return [];
  }
  const sources = stateBefore.vials.filter((vial: Vial): vial is NotEmptyVial => !isEmpty(vial) && !isComplete(vial));

<<<<<<< HEAD
  // TODO: add moves into empty vials separately so there are less possible moves
  const moves: Move[][] = sources.map(fromVial => {
    const validTargets = stateBefore.vials.filter(possibleTarget => possibleTarget.id !== fromVial.id &&
      !isFull(possibleTarget) &&
      !isEmpty(possibleTarget) &&
      topBall(possibleTarget).color === topBall(fromVial).color);
    const possibleEmptyVialTarget = stateBefore.vials.filter(isEmpty)[0];
    if (!!possibleEmptyVialTarget) {
      validTargets.push(possibleEmptyVialTarget);
    }
=======
  const moves: Move[][] = sources.map(fromVial => {
    const validTargets = stateBefore.vials.filter(possibleTarget => possibleTarget.id !== fromVial.id &&
      !isFull(possibleTarget) &&
      (!hasBalls(possibleTarget) || topBall(possibleTarget).color === topBall(fromVial).color));
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
    return validTargets.map(toVial => ({ fromVial, toVial, stateBefore }));
  });

  return ([] as Move[]).concat(...moves);
}

export function calculateMove(stateBefore: GameState, move: Move): CalculatedMove {
  const newState: GameState = JSON.parse(JSON.stringify(stateBefore));

  const sourceVial = <NotEmptyVial>newState.vials.find(v => v.id === move.fromVial.id);
  const targetVial = <Vial>newState.vials.find(v => v.id === move.toVial.id);
<<<<<<< HEAD
  const movedBall = <Ball>sourceVial.balls.pop();
=======
  const movedBall = <Ball>sourceVial.balls.pop();  
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4

  movedBall.vialId = move.toVial.id;
  targetVial.balls.push(movedBall);

  return { ...move, stateAfter: newState };
}

export function stringifyVial(vial: Vial): string {
  return vial.balls.map(ball => ball.color).join('');
}

export function stringifyState(state: GameState): string {
  return state.vials.map(stringifyVial).sort().join('|');
}

export function stringifyMove(move: Move): string {
  return 'move ' + topBall(move.fromVial).color +
    ' ball from vial ' + move.fromVial.id + ' to vial ' + move.toVial.id;
}

/**
 * sort vials by ball colors so states with similar vials in a different order are considered the same
 */
export function areStatesEqual(one: GameState, two: GameState) {
  const [first, second] = [one, two].map(stringifyState);
  return one.vials.length === two.vials.length && first === second;
}

export function createDFSNodeFromState(board: GameState): DFSGameStateNode {
  const possibleMoves: CalculatedMoveForSolver[] = getPossibleMoves(board)
    .map(move => calculateMove(board, move))
    .map(move => ({ ...move, isBad: false }));
  const boardStateNode: DFSGameStateNode = { ...board, possibleMoves };
  return boardStateNode;
}

<<<<<<< HEAD
export function createBFSNodeFromState(board: GameState, movesToHere: Move[] = []): BFSGameStateNode {
=======
export function createBFSNodeFromState(board: GameState, movesToHere: Move[]): BFSGameStateNode {
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
  const possibleMoves: CalculatedMoveForSolver[] = getPossibleMoves(board)
    .map(move => calculateMove(board, move))
    .map(move => ({ ...move, isBad: false }));
  const boardStateNode: BFSGameStateNode = { ...board, possibleMoves, movesToHere };
  return boardStateNode;
}

// TODO: maintain this state in a service for editing levels
let next_id = 0;

export function generateVial(list: VialDescription): Vial {
  const id = ++next_id;
  return { balls: list.map(color => ({ color, vialId: id })), id };
}

export function generateBoard(params: GameDescription): GameState {
  const vials = params.map(list => generateVial(list));
  return { vials };
}
<<<<<<< HEAD

export function CountArrayItemsByFunction<T extends string, U>(array: U[], splitter: (item: U) => T): Partial<{ [k in T]: number }> {
  const returnValue: Partial<{ [k in T]: number }> = {};
  array.forEach(item => {
    const category = splitter(item);
    if (!returnValue[category]) {
      returnValue[category] = 1;
    } else {
      returnValue[category]++;
    }
  });
  return returnValue;
}

export function groupBallsByColor(vial: Vial) {
  return CountArrayItemsByFunction(vial.balls, (ball) => ball.color);
}

export function entropyOfVial(vial: Vial) {
  const ballsNumber = vial.balls.length;
  if (isEmpty(vial)) {
    return 0;
  }
  const ballsGroupedByColor = groupBallsByColor(vial);
  const vialEntropy = Object.values(ballsGroupedByColor)
    .map(num => {
      if (num === 0) { return 0; } // probability is zero, avoid calculating 0 * -infinity
      const probability = num / ballsNumber;
      return -probability * Math.log(probability);
    })
    .reduce((prev, current) => prev + current); // sum color entropies
  return vialEntropy;
}

export function calculateEntropyForState(state: GameState): number {
  const totalBalls = state.vials
    .map(vial => vial.balls.length)
    .reduce((prev, current) => prev + current);
  const stateEntropy = state.vials
    .map(vial => vial.balls.length * entropyOfVial(vial) / totalBalls)
    .reduce((prev, current) => prev + current);
  return stateEntropy;
}

export function colorsInVial(vial: Vial): BallColor[] {
  return vial.balls.map(ball => ball.color).filter(distinct);
}

export function colorsInState(state: GameState): BallColor[] {
  return ([] as BallColor[]).concat(...state.vials.map(colorsInVial)).filter(distinct);
}

export function distinct<T>(item: T, index: number, array: T[]) {
  return array.indexOf(item) === index;
}
=======
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
