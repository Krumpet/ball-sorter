import { Component, Inject, OnInit } from '@angular/core';
import { LEVELS } from '../../../levels';
import { GameDescription } from '../../../types';

@Component({
  selector: 'app-level-selector',
  templateUrl: './level-selector.component.html',
  styleUrls: ['./level-selector.component.css']
})
export class LevelSelectorComponent implements OnInit {
  public levelOptions: [string, GameDescription][] = [];

  constructor(@Inject(LEVELS) private levels: Record<string, GameDescription>) { }

  ngOnInit(): void {
    this.levelOptions = Object.entries(this.levels);
  }

}
