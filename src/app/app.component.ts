import { Component } from '@angular/core';
import { BoardStateService } from './board-state.service';
import { SolverService } from './solver.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   *
   */
  constructor(public stateService: BoardStateService, private solverService: SolverService) {
  }

  solve() {
    this.solverService.solve(this.stateService.board);
  }
}
