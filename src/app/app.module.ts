import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { MoveComponent } from './move/move.component';
import { MovesComponent } from './moves/moves.component';
import { VialComponent } from './vial/vial.component';
import { BallComponent } from './ball/ball.component';
import { SolverParametersFormComponent } from './solver-parameters-form/solver-parameters-form.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MoveComponent,
    MovesComponent,
    VialComponent,
    BallComponent,
    SolverParametersFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
