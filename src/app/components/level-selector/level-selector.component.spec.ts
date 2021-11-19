import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LEVELS } from '../../../levels';
import { GameDescription } from '../../../types';

import { LevelSelectorComponent } from './level-selector.component';

describe('LevelSelectorComponent', () => {
  let component: LevelSelectorComponent;
  let fixture: ComponentFixture<LevelSelectorComponent>;
  const gameDescription: GameDescription = [['blue']]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LevelSelectorComponent],
      providers: [{ provide: LEVELS, useValue: {"11": gameDescription} }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a drop-down menu', () => {
    const compiled = fixture.debugElement.nativeElement;
    const selector = compiled.querySelector('select');
    expect(selector).not.toBeNull();
  });

  it('should have an input of levels', () => {
    expect(component.levelOptions).toBeDefined();
  });

  it('should have one levelOption', () => {
    expect(component.levelOptions.length).toBe(1);
  });
});
