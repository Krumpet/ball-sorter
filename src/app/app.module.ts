import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { BallComponent } from './components/ball/ball.component';
import { MoveComponent } from './components/move/move.component';
import { MovesComponent } from './components/moves/moves.component';
import { SolverParametersFormComponent } from './components/solver-parameters-form/solver-parameters-form.component';
import { VialComponent } from './components/vial/vial.component';
import { LevelSelectorComponent } from './components/level-selector/level-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MoveComponent,
    MovesComponent,
    VialComponent,
    BallComponent,
    SolverParametersFormComponent,
    LevelSelectorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
