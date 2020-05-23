import { Component, OnInit } from '@angular/core';
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
