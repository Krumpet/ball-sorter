import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import { GameState, Vial, Move } from 'src/types';
import { getPossibleMoves } from 'src/functions';
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
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
