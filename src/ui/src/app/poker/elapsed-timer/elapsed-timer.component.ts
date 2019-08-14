import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Timer } from 'easytimer.js';

import { Round } from '../../models/round';
import { InternalService } from 'src/app/services/internal.service';

@Component({
  selector: 'app-elapsed-timer',
  templateUrl: './elapsed-timer.component.html',
  styleUrls: ['./elapsed-timer.component.css']
})

export class ElapsedTimerComponent implements OnInit {

  gettingRefTime: boolean = true
  timer: Timer = new Timer();
  displayedTime = "0:00"
  subscriber: Subscription

  constructor(
    private internal: InternalService,
  ) { }

  ngOnInit() {
    this.subscriber = this.internal.rounds$.subscribe(rounds => {
      if (rounds && rounds[0].CreationTime && this.gettingRefTime) {
        this.getRefTime(rounds[0].CreationTime);
        this.gettingRefTime = false //TODO: substitute with line below ()
        //this.subscriber.unsubscribe()
      }
    })
  }

  getRefTime(referenceTime: number): void {
    let timePassed = (new Date().getTime()/1000 - referenceTime)
    this.startTimer(timePassed);
  }

  startTimer(timePassed: number): void {
    let self = this;
    this.timer.start({precision: 'seconds', startValues: {seconds: timePassed} });
    this.timer.addEventListener('secondsUpdated', function (e) {
      self.displayedTime = self.timerToString()
    });
  }

  timerToString(): string {
  let hh = this.timer.getTimeValues().hours
    if (hh) {
      return `${hh}:${this.timer.getTimeValues().minutes.toString()}:${this.timer.getTimeValues().toString().slice(6)}`
    } else {
      return `${this.timer.getTimeValues().minutes.toString()}:${this.timer.getTimeValues().toString().slice(6)}`
    }
  }
}
