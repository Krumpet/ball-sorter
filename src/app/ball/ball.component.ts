import { Component, OnInit, Input } from '@angular/core';
import { BallColor } from 'src/types';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.css']
})
export class BallComponent implements OnInit {

  @Input() color: BallColor;
  colorValue: string;
  ballClass: { 'background-color': BallColor; };
  constructor() { }

  ngOnInit() {
    const colorValue = this.color;
    this.ballClass = { 'background-color': colorValue };
  }

}
