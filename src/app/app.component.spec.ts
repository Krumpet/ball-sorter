import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BallComponent } from './components/ball/ball.component';
import { BoardComponent } from './components/board/board.component';
import { SolverParametersFormComponent } from './components/solver-parameters-form/solver-parameters-form.component';
import { VialComponent } from './components/vial/vial.component';
describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      declarations: [
        AppComponent, SolverParametersFormComponent, BoardComponent, VialComponent, BallComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
