import { Component } from '@angular/core';
import { BoardStateService } from './board-state.service';
import { SolverService } from './solver.service';
<<<<<<< HEAD
import { calculateEntropyForState } from '../functions';
=======
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4

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
<<<<<<< HEAD

  showEntropy() {
    console.log(calculateEntropyForState(this.stateService.board));
  }
=======
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4
}
