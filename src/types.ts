export interface Ball {
  color: BallColor;
  vialId: number;
}

export type BallColor =
  | 'red'
  | 'yellow'
  | 'darkgreen'
  | 'blue'
  | 'yellowgreen'
  | 'pink'
  | 'gray'
  | 'orange'
  | 'mediumspringgreen'
  | 'purple'
  | 'saddlebrown'
  | 'lightskyblue';

export interface Vial {
  balls: Ball[];
  id: number;
}

// tslint:disable-next-line: no-empty-interface
export interface NotEmptyVial extends Vial { }

export type VialDescription = BallColor[];

export type GameDescription = VialDescription[];

export interface GameState {
  vials: Vial[];
}

export interface GameStateNode extends GameState {
  possibleMoves: CalculatedMoveForSolver[];
}

// tslint:disable-next-line: no-empty-interface
export interface DFSGameStateNode extends GameStateNode { }

export interface BFSGameStateNode extends GameStateNode {
  movesToHere: Move[];
}

export interface HeuristicParameters {
  h: {
    heuristic: (state: GameStateNode) => number;
    heuristicWeight: number;
  };
}

export interface DistanceParameters {
  g: {
    distance: (state: BFSGameStateNode) => number;
    distanceWeight: number;
  };
}

export type AStarConfig = HeuristicParameters | DistanceParameters | (HeuristicParameters & DistanceParameters);

export function usesHeuristics(config: AStarConfig): config is HeuristicParameters {
  return !!((config as HeuristicParameters).h);
}

export function usesDistance(config): config is DistanceParameters {
  return !!((config as DistanceParameters).g);
}

export type StringState = string;

export interface SolutionWithStats {
  moves: Move[] | null;
  nodeStats: {
    opened: number,
    totalUnique: number
  };
}

export interface AStarStateNode {
  stateNode: BFSGameStateNode;
  heuristic: number;
  distance: number;
  score: number;
  moveToHere: Move | null;
  stringState: StringState;
}

export interface Move {
  stateBefore: GameState;
  fromVial: NotEmptyVial;
  toVial: Vial;
}

export interface CalculatedMove extends Move {
  stateAfter: GameState;
}

export interface CalculatedMoveForSolver extends CalculatedMove {
  isBad: boolean;
}

export const solverTypesValue: ['BFS', 'BFS-Recursive', 'DFS', 'AStar-Moves', 'AStar-Entropy', 'Greedy'] =
  ['BFS', 'BFS-Recursive', 'DFS', 'AStar-Moves', 'AStar-Entropy', 'Greedy'];
export const heuristics: ['entropy', 'moves'] = ['entropy', 'moves'];
export const distances: ['distance'] = ['distance'];

export interface SolverParameters { // closely related to AStarConfig
  solver: typeof solverTypesValue[number];
  parameters: AStarConfig;
}