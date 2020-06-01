import { Component, OnInit } from '@angular/core';
import { FormBuilder, Form, FormGroup, Validators } from '@angular/forms';

// type solverTypes = 'BFS' | 'BFS-Recursive' | 'DFS' | 'AStar';

const solverTypesValue: ['BFS' , 'BFS-Recursive' , 'DFS' , 'AStar'] = ['BFS' , 'BFS-Recursive' , 'DFS' , 'AStar'];

interface SolverParameters {
  solver: typeof solverTypesValue[number];
  heuristic: string;
  heuristicWeight: number;
}

@Component({
  selector: 'app-solver-parameters-form',
  templateUrl: './solver-parameters-form.component.html',
  styleUrls: ['./solver-parameters-form.component.css']
})
export class SolverParametersFormComponent implements OnInit {

  readonly solverTypes = solverTypesValue;
  formGroup: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      solver: ['', Validators.required]
    });
  }

}
