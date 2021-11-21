import { createAction, props } from "@ngrx/store";
import { GameState, Move } from "../../../types";

export const makeMove = createAction('[Board State] Make Move', props<{ move: Move /*  OmitExisting<Move, 'stateBefore'> */ }>());

export const selectLevel = createAction('[Board State] Select Level', props<{ level: GameState }>());