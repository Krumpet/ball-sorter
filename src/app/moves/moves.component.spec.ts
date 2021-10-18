import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MovesComponent } from './moves.component';

describe('MovesComponent', () => {
  let component: MovesComponent;
  let fixture: ComponentFixture<MovesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MovesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
