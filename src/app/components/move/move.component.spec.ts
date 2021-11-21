import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Vial } from '../../../types';

import { MoveComponent } from './move.component';

describe('MoveComponent', () => {
  let component: MoveComponent;
  let fixture: ComponentFixture<MoveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MoveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveComponent);
    component = fixture.componentInstance;
    const vialOne: Vial = { balls: [{ color: 'blue', vialId: 0 }], id: 0 };
    const vialTwo: Vial = { balls: [{ color: 'blue', vialId: 1 }], id: 1 };
    component.move = {
      fromVial: vialOne, toVial: vialTwo
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
