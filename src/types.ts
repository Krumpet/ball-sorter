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

export interface AStarConfig {
  heuristic: (state: GameStateNode) => number;
  heuristicScale: number;
  costFunction: (state: BFSGameStateNode) => number;
  costScale: number;
}

export type StringState = string;

export interface SolutionWithStats {
  moves: Move[];
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
