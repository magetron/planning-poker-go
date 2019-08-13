import { Component, OnInit } from '@angular/core';
import { Timer } from 'easytimer.js';

import { Round } from '../../models/round';
import { InternalService } from 'src/app/services/internal.service';

@Component({
  selector: 'app-elapsed-timer',
  templateUrl: './elapsed-timer.component.html',
  styleUrls: ['./elapsed-timer.component.css']
})
export class ElapsedTimerComponent implements OnInit {

  timePassed = 0;
  rounds: Round[];
  referenceTime: number;
  gettingRefTime = true;
  timer: Timer = new Timer();

  constructor(
    private internal: InternalService,
  ) { }

  ngOnInit() {

    this.internal.rounds$.subscribe(msg => {
      this.rounds = msg
      if (this.rounds && this.rounds[0].CreationTime && this.gettingRefTime) {
        this.referenceTime = this.rounds[0].CreationTime
        this.getRefTime();
      } else {
        this.referenceTime = new Date().getTime()
      }
    })

  }


  getRefTime(){
    this.gettingRefTime = false;
    this.timePassed = (new Date().getTime()/1000 - this.referenceTime)
    this.startTimer();
  }

  startTimer(){
    let self = this;
    this.timer.start({precision: 'seconds', startValues: {seconds: this.timePassed} });
    this.timer.addEventListener('secondsUpdated', function (e){
      let exist = document.getElementById("elapsedTime")
      if (exist){
        exist.innerText = self.timer.getTimeValues().toString().slice(3)
      }
    });
  }

  

}
