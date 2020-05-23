import { Component, OnInit, Input } from '@angular/core';
<<<<<<< HEAD
import { GameState, Move } from '../../types';
=======
import { GameState, Move } from 'src/types';
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
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
