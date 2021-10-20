import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { nonnegativeNumber } from '../../validation';
import {
  AStarConfig,
  GameStateNode, BFSGameStateNode, usesDistance, usesHeuristics, solverTypesValue, heuristics, distances, SolverParameters
} from '../../types';
import { calculateEntropyForState, calculateDistanceHeuristicForState } from '../../functions';
import { SolverService } from '../solver.service';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

@Component({
  selector: 'app-solver-parameters-form',
  templateUrl: './solver-parameters-form.component.html',
  styleUrls: ['./solver-parameters-form.component.css']
})
export class SolverParametersFormComponent implements OnInit, OnDestroy {

  readonly solverTypes = solverTypesValue;
  readonly heuristics = heuristics;
  readonly distances = distances;

  readonly functionMapping:
    & { [k in typeof heuristics[number]]: (state: GameStateNode) => number }
    & { [k in typeof distances[number]]: (state: BFSGameStateNode) => number }
    = {
      'entropy': (state) => calculateEntropyForState(state),
      'moves': (state) => calculateDistanceHeuristicForState(state),
      'distance': (state) => (state.movesToHere || []).length
    };

  readonly initialSolverConfigurations: { [k in SolverParameters['solver']]: AStarConfig } = {
    'BFS': { g: { distance: this.functionMapping['distance'], distanceWeight: 1.0 } },
    'BFS-Recursive': { g: { distance: this.functionMapping['distance'], distanceWeight: 1.0 } },
    'DFS': { g: { distance: this.functionMapping['distance'], distanceWeight: 1.0 } },
    'Greedy': { h: { heuristic: this.functionMapping['moves'], heuristicWeight: 1.0 } },
    'AStar-Moves': {
      h: { heuristic: this.functionMapping['moves'], heuristicWeight: 1.0 },
      g: { distance: this.functionMapping['distance'], distanceWeight: 1.0 }
    },
    'AStar-Entropy': {
      h: { heuristic: this.functionMapping['entropy'], heuristicWeight: 30.0 },
      g: { distance: this.functionMapping['distance'], distanceWeight: 1.0 }
    },
  };

  isHeuristicRelevant!: boolean;
  isDistanceRelevant!: boolean;

  formGroup!: FormGroup;
  subscriptionHolder = new Subscription();

  constructor(private fb: FormBuilder, private solverService: SolverService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      solver: ['', Validators.required],
      parameters: this.fb.group({
        h: this.fb.group({
          heuristic: [null, Validators.required],
          heuristicWeight: [1, [Validators.required, nonnegativeNumber]],
        }),
        g: this.fb.group({
          distance: [null, Validators.required],
          distanceWeight: [1, [Validators.required, nonnegativeNumber]]
        })
      })
    });

    this.subscriptionHolder.add(this.formGroup.get('solver')!.valueChanges.subscribe((solver: SolverParameters['solver']) => {
      this.isHeuristicRelevant = solver !== 'BFS' && solver !== 'BFS-Recursive' && solver !== 'DFS';
      this.isDistanceRelevant = solver !== 'Greedy';
      const hControl = this.formGroup.get('parameters.h')!;
      if (this.isHeuristicRelevant) {
        hControl.enable();
      } else {
        hControl.disable();
      }
      const gControl = this.formGroup.get('parameters.g')!;
      if (this.isDistanceRelevant) {
        gControl.enable();
      } else {
        gControl.disable();
      }

      // load default values into parameters on solver switch
      this.formGroup.get('parameters')!.patchValue(this.initialSolverConfigurations[solver]);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptionHolder.unsubscribe();
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    const value: SolverParameters = this.formGroup.value;
    if (usesDistance(value.parameters)) {
      value.parameters.g.distanceWeight = +value.parameters.g.distanceWeight;
    }
    if (usesHeuristics(value.parameters)) {
      value.parameters.h.heuristicWeight = +value.parameters.h.heuristicWeight;
    }
    this.solverService.solve(value);
  }
}
