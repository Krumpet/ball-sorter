import { Component } from '@angular/core';
import { BoardStateService } from './board-state.service';
import { SolverService } from './solver.service';
import { calculateEntropyForState } from '../functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /**
   *
   */
  constructor(public stateService: BoardStateService) {
  }
}