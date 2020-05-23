import { Component, OnInit, Input } from '@angular/core';
<<<<<<< HEAD
import { BoardStateService } from '../board-state.service';
import { Move } from '../../types';
import { stringifyMove } from '../../functions';
=======
import { Move } from 'src/types';
import { topBall, stringifyMove } from 'src/functions';
import { BoardStateService } from '../board-state.service';
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.css']
})
export class MoveComponent implements OnInit {
  @Input() move!: Move;
  text!: string;

  constructor(private stateService: BoardStateService) { }

  ngOnInit() {
    this.text = stringifyMove(this.move);
  }

  makeMove() {
    this.stateService.makeMove(this.move);
  }

}
