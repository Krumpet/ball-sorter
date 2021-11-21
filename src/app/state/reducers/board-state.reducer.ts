import { createReducer, on } from "@ngrx/store";
import { calculateMove } from "../../../functions";
import { GameState } from "../../../types";
import { makeMove, selectLevel } from "../actions/board-state.actions";

export const initialState: GameState = { vials: [] };

export const boardReducer = createReducer(initialState,
    on(makeMove, (state, { move }) => calculateMove(state, move).stateAfter),
    on(selectLevel, (state, { level }) => level)
);