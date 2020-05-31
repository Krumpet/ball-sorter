import {
  Vial, Ball, GameState, Move,
  CalculatedMove, DFSGameStateNode,
  CalculatedMoveForSolver, GameDescription, VialDescription,
  BFSGameStateNode, NotEmptyVial, BallColor, AStarStateNode, AStarConfig, StringState
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

export function createBFSNodeFromState(board: GameState, movesToHere: Move[] = []): BFSGameStateNode {
  const possibleMoves: CalculatedMoveForSolver[] = getPossibleMoves(board)
    .map(move => calculateMove(board, move))
    .map(move => ({ ...move, isBad: false }));
  const boardStateNode: BFSGameStateNode = { ...board, possibleMoves, movesToHere };
  return boardStateNode;
}

export function createAStarNodeFromState(board: GameState,
  heuristics: { [k in StringState]: number },
  config: AStarConfig,
  movesToHere: Move[] = []): AStarStateNode {
  const stateNode = createBFSNodeFromState(board, movesToHere);
  const stringState = stringifyState(stateNode);
  let heuristic = 0;
  if (stringState in heuristics) {
    heuristic = heuristics[stringState];
  } else {
    heuristic = config.heuristic(stateNode) * config.heuristicScale; // TODO: check if optional
    heuristics[stringState] = heuristic;
  }
  const distance = config.costFunction(stateNode) * config.costScale;
  return {
    stateNode,
    heuristic,
    distance,
    score: heuristic + distance,
    moveToHere: movesToHere.length ? movesToHere[movesToHere.length - 1] : null,
    stringState: stringState
  };
}

export function getPath(state: AStarStateNode, parents: { [x: string]: AStarStateNode; }) {
  // let curr = state;
  // const path = [curr.moveToHere];
  // while (parents[curr.stringState]) {
  //   path.unshift(parents[curr.stringState].moveToHere);
  //   curr = parents[curr.stringState];
  // }
  // return path.filter(move => !!move);
  return state.stateNode.movesToHere;
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

export function sumArray(array: number[]): number {
  // initial value to handle empty arrays
  return array.reduce((sum, current) => sum + current, 0);
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
  const vialEntropy = sumArray(
    Object.values(ballsGroupedByColor)
      .map(num => {
        if (num === 0) { return 0; } // probability is zero, avoid calculating 0 * -infinity
        const probability = num / ballsNumber;
        return -probability * Math.log(probability);
      })
  ); // sum color entropies
  return vialEntropy;
}

export function calculateEntropyForState(state: GameState): number {
  const totalBalls = sumArray(
    state.vials.map(vial => vial.balls.length)
  );
  const stateEntropy = sumArray(
    state.vials
      .filter(vial => !isEmpty(vial))
      .map(vial => vial.balls.length * entropyOfVial(vial) / totalBalls)
  ); // sum vial entropies
  return stateEntropy;
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
      if (!(baseColor in dictionary) || dictionary[baseColor].amount < amountOfThatColor) {
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
      if (!(ball.color in baseVialMap) || baseVialMap[ball.color].index !== index) {
        result++;
      }
    });
  });
  return result;
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
