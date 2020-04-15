import { Vial, Ball, GameState, Move } from './types';
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
 * if every vial is empty or has all 4 balls of the same color
 * @param state gameState
 */
export function isGameOver(state: GameState) {
  return state.vials.every(vial => isEmpty(vial) ||
    (vial.balls.every(b => b.color === vial.balls[0].color) && vial.balls.length === ballsPerColor));
}

export function getPossibleMoves(stateBefore: GameState): Move[] {
  if (isGameOver(stateBefore)) {
    return [];
  }

  return [].concat.apply([], stateBefore.vials.filter(v => !isEmpty(v)).map(fromVial => {
    const validTargets = stateBefore.vials.filter(possibleTarget => possibleTarget.id !== fromVial.id &&
      !isFull(possibleTarget) &&
      (isEmpty(possibleTarget) || topBall(possibleTarget).color === topBall(fromVial).color));
    return validTargets.map(toVial => ({ fromVial, toVial, stateBefore }));
  }));
}
