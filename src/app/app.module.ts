import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { MoveComponent } from './move/move.component';
import { MovesComponent } from './moves/moves.component';
import { VialComponent } from './vial/vial.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MoveComponent,
    MovesComponent,
    VialComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
