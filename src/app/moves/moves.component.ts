import { Component, OnInit, Input } from '@angular/core';
import { GameState, Move } from 'src/types';
import { BoardStateService } from '../board-state.service';

@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.css']
})
export class MovesComponent implements OnInit {
  _state!: GameState;
  possibleMoves!: Move[];
  @Input() set state(v: GameState) {
    this._state = v;
    this.possibleMoves = this.stateService.getPossibleMoves();
  }
  constructor(private stateService: BoardStateService) { }

  ngOnInit() {
  }

}
