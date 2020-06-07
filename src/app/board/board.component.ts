import { Component, OnInit } from '@angular/core';
import { BoardStateService } from '../board-state.service';
import { GameState, Ball } from '../../types';
import { isLegalMove } from '../../functions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  move: { id: number; ball: Ball; timer: any };
  board$: Observable<GameState>;
  constructor(public stateService: BoardStateService) {
  }

  ngOnInit() {
    this.board$ = this.stateService.board$;
  }

  doMove(id: number) {
    console.log('clicked vial', id);
    this.stateService.vialClicked(id);
    // if (!!this.move) {
    //   clearTimeout(this.move.timer);
    //   if (isLegalMove(this.move, id, this.board)) {
    //     this.stateService.makeMove({ stateBefore: this.board, fromVial: this.board.vials[this.move.id], toVial: this.board.vials[id] });
    //     this.board = this.stateService.board;
    //     this.move = null;
    //     return;
    //   }
    // }

    // const balls = this.board.vials[id].balls;
    // const ballToMove = balls[balls.length - 1];
    // this.move = { id, ball: ballToMove, timer: setTimeout(() => { console.log('stopped doing ', id); this.move = null; }, 2000) };
  }
}
