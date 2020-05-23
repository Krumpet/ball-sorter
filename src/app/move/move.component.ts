import { Component, OnInit, Input } from '@angular/core';
import { BoardStateService } from '../board-state.service';
import { Move } from '../../types';
import { stringifyMove } from '../../functions';

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
