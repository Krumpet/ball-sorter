import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BallComponent } from '../ball/ball.component';

import { VialComponent } from './vial.component';

describe('VialComponent', () => {
  let component: VialComponent;
  let fixture: ComponentFixture<VialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [VialComponent, BallComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VialComponent);
    component = fixture.componentInstance;
    component.vial = { id: 0, balls: [] }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
