import { trigger, state, style, transition, animate } from "@angular/animations";
import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { ballsPerVial } from "../../../consts";
import { Vial, BallColor } from "../../../types";
import { BoardStateService } from "../../services/board-state.service";
import {distinctUntilChanged, filter, map, startWith} from 'rxjs/operators'

@Component({
  selector: 'app-vial',
  templateUrl: './vial.component.html',
  styleUrls: ['./vial.component.css'],
  animations: [
    trigger('ballUp', [
      state('down', style({})),
      state('up', style({
        transform: 'translateY(-{{balls}}00%)'
      }), { params: { balls: 1 } }),
      transition('down => up', [animate('0.3s ease-in')]),
      transition('up => down', [animate('0.3s ease-in')])
    ]),
    trigger('newBall', [
      state('down', style({})),
      state('up', style({
        visibility: 'hidden'
      }), { params: { balls: 1 } }),
      transition('down => up', [animate('0.3s ease-in')]),
      transition('up => down', [animate('0.3s ease-in')])
    ])
  ]
})
export class VialComponent implements OnInit {

  @Input() vial!: Vial;
  display!: (BallColor | 'blank')[];
  upBallListenerIndex!: number;
  downBallListenerIndex!: number;
  ballListener$!: Observable<'up' | 'down'>;
  constructor(private stateService: BoardStateService) { }

  ngOnInit() {
    this.display = this.vial.balls.map(b => b.color);
    while (this.display.length < ballsPerVial) {
      this.display.push('blank');
    }
    this.display.reverse();
    this.upBallListenerIndex = this.display.findIndex(color => color !== 'blank');
    this.downBallListenerIndex = this.display.lastIndexOf('blank');
    this.ballListener$ = this.stateService.animateVial$.pipe(
      filter(({ id }) => id === this.vial.id),
      map(({ direction }) => direction),
      distinctUntilChanged(),
      startWith('down')
    );
  }

}
