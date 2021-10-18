import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolverParametersFormComponent } from './solver-parameters-form.component';

describe('SolverParametersFormComponent', () => {
  let component: SolverParametersFormComponent;
  let fixture: ComponentFixture<SolverParametersFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolverParametersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolverParametersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
