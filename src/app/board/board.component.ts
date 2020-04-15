import { Component, OnInit } from '@angular/core';
import { GameState, Vial, Move } from 'src/types';
import { getPossibleMoves } from 'src/functions';
import { BoardStateService } from '../board-state.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  constructor(public stateService: BoardStateService) {
  }

  ngOnInit() {
  }

}
