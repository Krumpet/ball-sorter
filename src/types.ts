export interface Ball {
  color: BallColor;
  vialId: number;
}

export type BallColor = 'red' | 'yellow' | 'green';

export interface Vial {
  balls: Ball[];
  id: number;
}

export type VialDescription = BallColor[] | 'empty';

export type GameDescription = VialDescription[];

export interface GameState {
  vials: Vial[];
  moveToHere: null | Move;
}


export interface GameStateNode extends GameState {
  possibleMoves: CalculatedMoveForSolver[];
}

export interface Move {
  stateBefore: GameState;
  fromVial: Vial;
  toVial: Vial;
}

export interface CalculatedMove extends Move {
  stateAfter: GameState;
}

export interface CalculatedMoveForSolver extends CalculatedMove {
  isBad: boolean;
}
