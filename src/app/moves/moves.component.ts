import { Component, Input } from '@angular/core';
import { GameState, Move } from '../../types';
import { BoardStateService } from '../board-state.service';

@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.css']
})
export class MovesComponent {
  _state!: GameState;
  possibleMoves!: Move[];
  @Input() set state(v: GameState) {
    this._state = v;
    this.possibleMoves = this.stateService.getPossibleMoves();
  }
  constructor(private stateService: BoardStateService) { }
}
