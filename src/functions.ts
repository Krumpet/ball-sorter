import {
  Vial, Ball, GameState, Move,
  CalculatedMove, DFSGameStateNode,
  CalculatedMoveForSolver, GameDescription, VialDescription, BFSGameStateNode, NotEmptyVial
} from './types';
import { ballsPerColor, ballsPerVial } from './consts';

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

  const moves: Move[][] = sources.map(fromVial => {
    const validTargets = stateBefore.vials.filter(possibleTarget => possibleTarget.id !== fromVial.id &&
      !isFull(possibleTarget) &&
      (!hasBalls(possibleTarget) || topBall(possibleTarget).color === topBall(fromVial).color));
    return validTargets.map(toVial => ({ fromVial, toVial, stateBefore }));
  });

  return ([] as Move[]).concat(...moves);
}

export function calculateMove(stateBefore: GameState, move: Move): CalculatedMove {
  const newState: GameState = JSON.parse(JSON.stringify(stateBefore));

  const sourceVial = <NotEmptyVial>newState.vials.find(v => v.id === move.fromVial.id);
  const targetVial = <Vial>newState.vials.find(v => v.id === move.toVial.id);
  const movedBall = <Ball>sourceVial.balls.pop();  

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

export function createBFSNodeFromState(board: GameState, movesToHere: Move[]): BFSGameStateNode {
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
