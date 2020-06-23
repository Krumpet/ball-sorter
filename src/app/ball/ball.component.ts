import {Component, OnInit, Input} from '@angular/core';
import {BallColor} from '../../types';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.css']
})
export class BallComponent implements OnInit {

  @Input() color!: BallColor;
  ballClass!: {
    'background-color': BallColor;
  };

  constructor() { }

  ngOnInit() {
    this.ballClass = {'background-color': this.color};
  }

}
