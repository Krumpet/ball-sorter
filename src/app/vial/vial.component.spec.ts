import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VialComponent } from './vial.component';

describe('VialComponent', () => {
  let component: VialComponent;
  let fixture: ComponentFixture<VialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
