import { Component, OnInit, Input } from '@angular/core'
import { Vial } from '../../types';
import { ballsPerVial } from '../../consts';

@Component({
  selector: 'app-vial',
  templateUrl: './vial.component.html',
  styleUrls: ['./vial.component.css']
})
export class VialComponent implements OnInit {

  @Input() vial!: Vial;
  display!: string[];
  constructor() { }

  ngOnInit() {
    this.display = this.vial.balls.map(b => b.color);
    while (this.display.length < ballsPerVial) {
      this.display.push('blank');
    }
    this.display.reverse();
  }

}
