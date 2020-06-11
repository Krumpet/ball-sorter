import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Form, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { nonnegativeNumber } from '../../validation';

// type solverTypes = 'BFS' | 'BFS-Recursive' | 'DFS' | 'AStar';

const solverTypesValue: ['BFS', 'BFS-Recursive', 'DFS', 'AStar', 'Greedy'] = ['BFS', 'BFS-Recursive', 'DFS', 'AStar', 'Greedy'];
const heuristics: ['entropy', 'moves'] = ['entropy', 'moves'];
const distances: ['distance'] = ['distance'];

interface SolverParameters {
  solver: typeof solverTypesValue[number];
  parameters: {
    h?: {
      heuristic: typeof heuristics[number];
      heuristicWeight: number;
    };
    g?: {
      distance: typeof distances[number];
      distanceWeight: number;
    };
  };
}

@Component({
  selector: 'app-solver-parameters-form',
  templateUrl: './solver-parameters-form.component.html',
  styleUrls: ['./solver-parameters-form.component.css']
})
export class SolverParametersFormComponent implements OnInit, OnDestroy {

  readonly solverTypes = solverTypesValue;
  readonly heuristics = heuristics;
  readonly distances = distances;

  isHeuristicRelevant: boolean;
  isDistanceRelevant: boolean;
  formGroup: FormGroup;

  subscriptionHolder = new Subscription();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      solver: ['', Validators.required],
      parameters: this.fb.group({
        h: this.fb.group({
          heuristic: ['', Validators.required],
          heuristicWeight: [1, [Validators.required, nonnegativeNumber]],
        }),
        g: this.fb.group({
          distance: ['distance', Validators.required],
          distanceWeight: [1, [Validators.required, nonnegativeNumber]]
        })
      })
    });

    this.subscriptionHolder.add(this.formGroup.get('solver').valueChanges.subscribe((solver: typeof solverTypesValue[number]) => {
      this.isHeuristicRelevant = solver !== 'BFS' && solver !== 'BFS-Recursive' && solver !== 'DFS';
      const relevantControl = this.formGroup.get('parameters.h');
      if (this.isHeuristicRelevant) {
        relevantControl.enable();
      } else {
        relevantControl.disable();
      }
    }));

    this.subscriptionHolder.add(this.formGroup.get('solver').valueChanges.subscribe((solver: typeof solverTypesValue[number]) => {
      this.isDistanceRelevant = solver !== 'Greedy';
      const relevantControl = this.formGroup.get('parameters.g');
      if (this.isDistanceRelevant) {
        relevantControl.enable();
      } else {
        relevantControl.disable();
      }
    }));

    this.formGroup.valueChanges.subscribe(v => console.log(v, this.formGroup.valid));
  }

  ngOnDestroy(): void {
    this.subscriptionHolder.unsubscribe();
  }

  onSubmit(value: SolverParameters) {
    console.log(value);
  }

}
