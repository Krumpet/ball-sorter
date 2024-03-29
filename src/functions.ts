import {
  AStarConfig,
  AStarStateNode,
  Ball,
  BallColor,
  BFSGameStateNode,
  CalculatedMove,
  CalculatedMoveForSolver,
  DFSGameStateNode,
  GameDescription,
  GameState,
  Move,
  NotEmptyVial,
  StringState,
  usesDistance,
  usesHeuristics,
  Vial,
  VialDescription
} from './types';
import { ballsPerColor, ballsPerVial } from './consts';

export function topBall(vial: NotEmptyVial): Ball {
  return vial.balls[vial.balls.length - 1];
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

  // TODO: calculate moves as moving all balls of the same color together
  const moves: Move[][] = sources.map(fromVial => {
    const validTargets = stateBefore.vials.filter(possibleTarget => possibleTarget.id !== fromVial.id &&
      !isFull(possibleTarget) &&
      !isEmpty(possibleTarget) &&
      topBall(possibleTarget).color === topBall(fromVial).color);
    const possibleEmptyVialTarget = stateBefore.vials.filter(isEmpty)[0];
    if (!!possibleEmptyVialTarget) {
      validTargets.push(possibleEmptyVialTarget);
    }
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

export function stringifyState(state: GameState): StringState {
  return state.vials.map(stringifyVial).sort().join('|');
}

export function stringifyMove(move: Move): string {
  return 'move ' + topBall(move.fromVial).color +
    ' ball from vial ' + (move.fromVial.id + 1) + ' to vial ' + (move.toVial.id + 1);
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
  return { ...board, possibleMoves };
}

export function createBFSNodeFromState(board: GameState, movesToHere: Move[] = []): BFSGameStateNode {
  const possibleMoves: CalculatedMoveForSolver[] = getPossibleMoves(board)
    .map(move => calculateMove(board, move))
    .map(move => ({ ...move, isBad: false }));
  return { ...board, possibleMoves, movesToHere };
}

export function createAStarNodeFromState(board: GameState,
  heuristics: { [k in StringState]: number },
  config: AStarConfig,
  movesToHere: Move[] = []): AStarStateNode {
  const stateNode = createBFSNodeFromState(board, movesToHere);
  const stringState = stringifyState(stateNode);
  let heuristic = 0, distance = 0;
  if (usesHeuristics(config)) {
    if (stringState in heuristics) {
      heuristic = heuristics[stringState];
    } else {
      heuristic = config.h.heuristic(stateNode) * config.h.heuristicWeight;
      heuristics[stringState] = heuristic;
    }
  }
  if (usesDistance(config)) {
    distance = config.g.distance(stateNode) * config.g.distanceWeight;
  }
  return {
    stateNode,
    heuristic,
    distance,
    score: heuristic + distance,
    moveToHere: movesToHere.length ? movesToHere[movesToHere.length - 1] : null,
    stringState: stringState
  };
}

// TODO: Do I ever need parents or is "movesToHere" maintained?
export function getPath(state: AStarStateNode, parents: { [x: string]: AStarStateNode; } = {}) {
  // let curr = state;
  // const path = [curr.moveToHere];
  // while (parents[curr.stringState]) {
  //   path.unshift(parents[curr.stringState].moveToHere);
  //   curr = parents[curr.stringState];
  // }
  // return path.filter(move => !!move);
  return state.stateNode.movesToHere;
}

/**
 * @param list list of ball colors
 * @param index the vial index to be used in balls and vial object
 */
export function generateVial(list: VialDescription, vialId: number): Vial {
  return { balls: list.map(color => ({ color, vialId })), id: vialId };
}

export function generateBoard(params: GameDescription): GameState {
  const vials = params.map((list, index) => generateVial(list, index));
  return { vials };
}

export function CountArrayItemsByFunction<T extends string, U>(array: U[], splitter: (item: U) => T):
  Partial<Record<T, number>> {
  const returnValue: Partial<Record<T, number>> = {};
  array.forEach(item => {
    const category = splitter(item);
    const count = returnValue[category] ?? 0;
    returnValue[category] = count + 1;
  });
  return returnValue;
}

export function sumArray(array: number[]): number {
  // initial value to handle empty arrays
  return array.reduce((sum, current) => sum + current, 0);
}

export function groupVialBallsByColor(vial: Vial) {
  return CountArrayItemsByFunction(vial.balls, (ball) => ball.color);
}

export function entropyOfVial(vial: Vial) {
  const ballsNumber = vial.balls.length;
  if (isEmpty(vial)) {
    return 0;
  }
  const ballsGroupedByColor = groupVialBallsByColor(vial);
  // sum color entropies
  return sumArray(
    Object.values(ballsGroupedByColor)
      .filter((num): num is number => !!num)
      .map((num) => {
        if (num === 0) {
          return 0;
        } // probability is zero, avoid calculating 0 * -infinity
        const probability = num / ballsNumber;
        return -probability * Math.log(probability);
      })
  );
}

export function calculateEntropyForState(state: GameState): number {
  const totalBalls = sumArray(
    state.vials.map(vial => vial.balls.length)
  );
  // sum vial entropies
  return sumArray(
    state.vials
      .filter(vial => !isEmpty(vial))
      .map(vial => vial.balls.length * entropyOfVial(vial) / totalBalls)
  );
}

export function calculateDistanceHeuristicForState(state: GameState): number {
  type baseColorDictionaryType = Partial<{ [c in BallColor]: { index: number; amount: number } }>;

  const baseVialMap: baseColorDictionaryType =
    state.vials.filter(vial => !isEmpty(vial)).reduce((dictionary, vial, index) => {
      const baseColor = vial.balls[0].color;
      let amountOfThatColor = 0;
      for (let ballIndex = 0; ballIndex < vial.balls.length; ballIndex++) {
        if (vial.balls[ballIndex].color === baseColor) {
          amountOfThatColor++;
        } else { break; } // stop counting once we hit the first off-color ball
      }
      if (!(baseColor in dictionary) || dictionary[baseColor]!.amount < amountOfThatColor) {
        // TODO: how to handle equality in amount?
        dictionary[baseColor] = { index, amount: amountOfThatColor };
      }
      return dictionary;
    }, {} as baseColorDictionaryType);

  // TODO: this could be changed to count all of the balls not directly on top of their base color,
  // e.g. (bottom -> purple purple grey purple -> top) would count the top purple as misplaced
  let result = 0;
  state.vials.filter(vial => !isEmpty(vial)).forEach((vial, index) => {
    vial.balls.forEach(ball => {
      if (!(ball.color in baseVialMap) || baseVialMap[ball.color]!.index !== index) {
        result++;
      }
    });
  });
  return result;
}

export function isLegalMove(from: Vial, to: Vial): boolean {
  return !isEmpty(from) && !isFull(to) &&
    (isEmpty(to) || topBall(to).color === topBall(from).color);
}
