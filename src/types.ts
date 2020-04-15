export interface Ball {
  color: BallColor;
  vialId: number;
}

export type BallColor = 'red' | 'yellow';

export class Vial {
  static cid = 0;
  balls: Ball[];
  id: number;
  /**
   *
   */
  constructor(balls: BallColor[]) {
    this.id = Vial.cid++;
    this.balls = balls.map(color => ({ color, vialId: this.id }))
  }
  stringify(): string {
    return this.balls.map(b => b.color).join('');
  };
}

export interface GameState {
  vials: Vial[];
  moveToHere: null | Move;
}

export interface Move {
  stateBefore: GameState;
  // stateAfter: GameState;
  fromVial: Vial;
  toVial: Vial;
}

export function isBallsArray(x: any[]): x is string[] {
  return x.length === 0 || typeof x[0] === 'string';
}