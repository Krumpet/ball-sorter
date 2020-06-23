import { Component, OnInit } from '@angular/core';
import { BoardStateService } from '../board-state.service';
import { GameState} from '../../types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board$!: Observable<GameState>;
  constructor(public stateService: BoardStateService) {
  }

  ngOnInit() {
    this.board$ = this.stateService.board$;
  }

  doMove(id: number) {
    this.stateService.vialClicked(id);
  }
}
