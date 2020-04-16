import {
  Vial, Ball, GameState, Move,
  CalculatedMove, GameStateNode,
  CalculatedMoveForSolver, GameDescription, VialDescription
} from './types';
import { ballsPerColor, ballsPerVial } from './consts';

export function topBall(vial: Vial): Ball | null {
  return isEmpty(vial) ? null : vial.balls[vial.balls.length - 1];
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
  const sources = stateBefore.vials.filter(v => !isEmpty(v) && !isComplete(v));

  const moves: Move[][] = sources.map(fromVial => {
    const validTargets = stateBefore.vials.filter(possibleTarget => possibleTarget.id !== fromVial.id &&
      !isFull(possibleTarget) &&
      (isEmpty(possibleTarget) || topBall(possibleTarget).color === topBall(fromVial).color));
    return validTargets.map(toVial => ({ fromVial, toVial, stateBefore }));
  });

  return [].concat.apply([], moves);
}

export function calculateMove(stateBefore: GameState, move: Move): CalculatedMove {
  const newState: GameState = JSON.parse(JSON.stringify(stateBefore));
  const movedBall = newState.vials.find(v => v.id === move.fromVial.id).balls.pop();
  movedBall.vialId = move.toVial.id;
  newState.vials.find(v => v.id === move.toVial.id).balls.push(movedBall);
  newState.moveToHere = move;
  return { ...move, stateAfter: newState };
}

export function stringifyVial(vial: Vial): string {
  return vial.balls.map(b => b.color).join('');
}

export function stringifyMove(move: Move): string {
  return 'move ' + topBall(move.fromVial).color +
    ' ball from vial ' + move.fromVial.id + ' to vial ' + move.toVial.id;
}

/**
 * sort vials by ball colors so states with similar vials in a different order are considered the same
 */
export function areStatesEqual(one: GameState, two: GameState) {
  const [firstVials, secondVials] = [one, two].map(state => state.vials.map(v => stringifyVial(v)).sort());
  return firstVials.length === secondVials.length && firstVials.every((vialString, index) => vialString === secondVials[index]);
}

export function createNodeFromState(board: GameState): GameStateNode {
  const possibleMoves: CalculatedMoveForSolver[] = getPossibleMoves(board)
    .map(move => calculateMove(board, move))
    .map(move => ({ ...move, isBad: false }));
  const boardStateNode: GameStateNode = { ...board, possibleMoves };
  return boardStateNode;
}

let next_id = 0;

export function generateVial(list: VialDescription): Vial {
  const id = ++next_id;
  return { balls: list === 'empty' ? [] : list.map(color => ({ color, vialId: id })), id };
}

export function generateBoard(params: GameDescription): GameState {
  const vials = params.map(list => generateVial(list));
  return { vials, moveToHere: null };
}
