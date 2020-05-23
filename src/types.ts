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

<<<<<<< HEAD
// tslint:disable-next-line: no-empty-interface
=======
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
export interface NotEmptyVial extends Vial { }

export type VialDescription = BallColor[];

export type GameDescription = VialDescription[];

export interface GameState {
  vials: Vial[];
<<<<<<< HEAD
=======
  
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
}

export interface GameStateNode extends GameState {
  possibleMoves: CalculatedMoveForSolver[];
}

<<<<<<< HEAD
// tslint:disable-next-line: no-empty-interface
=======
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
export interface DFSGameStateNode extends GameStateNode { }

export interface BFSGameStateNode extends GameStateNode {
  movesToHere: Move[];
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
