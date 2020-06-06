import { Component, OnInit, Input } from '@angular/core'
import { Vial, BallColor } from '../../types';
import { ballsPerVial } from '../../consts';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, startWith } from 'rxjs/operators';
import { BoardStateService } from '../board-state.service';

@Component({
  selector: 'app-vial',
  templateUrl: './vial.component.html',
  styleUrls: ['./vial.component.css'],
  animations: [
    trigger('ballUp', [
      state('down', style({
        backgroundColor: 'black',
        width: 100,
        // margin: 200
      })),
      state('up', style({
        backgroundColor: 'red',
        width: 200,
        // margin: 30
      })),
      transition('down => up', [animate('1s')]),
      transition('up => down', [animate('0.5s')])
    ])
  ]
})
export class VialComponent implements OnInit {

  @Input() vial!: Vial;
  display!: (BallColor | 'blank')[];
  topBallIndex: number;
  animationTrigger$: Observable<'up' | 'down'>;
  constructor(private stateService: BoardStateService) { }

  ngOnInit() {
    this.display = this.vial.balls.map(b => b.color);
    while (this.display.length < ballsPerVial) {
      this.display.push('blank');
    }
    this.display.reverse();
    this.topBallIndex = this.display.findIndex(color => color !== 'blank');
    if (this.topBallIndex === -1) {
      // bottom slot needs to be set as top ball to listen for 'down' animations
      this.topBallIndex = ballsPerVial - 1;
    }
    this.animationTrigger$ = this.stateService.animateVial$.pipe(
      filter(({ id }) => id === this.vial.id),
      map(({ direction }) => direction),
      distinctUntilChanged(),
      tap(x => console.log('emitting', x)),
      startWith('down')
    );
  }

}
