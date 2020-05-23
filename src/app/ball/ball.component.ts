import { Component, OnInit, Input } from '@angular/core';
<<<<<<< HEAD
import { BallColor } from '../../types';
=======
import { BallColor } from 'src/types';
>>>>>>> eaecc45c10bdc56c6a512efc90710cf2b1f21ff4

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.css']
})
export class BallComponent implements OnInit {

  @Input() color!: BallColor;
  colorValue!: string;
  ballClass!: {
    'background-color': BallColor;
  };
  constructor() { }

  ngOnInit() {
    const colorValue = this.color;
    this.ballClass = { 'background-color': colorValue };
  }

}
