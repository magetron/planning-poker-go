import { Component, OnInit, Input, Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatListModule } from '@angular/material';
import { throwError, forkJoin, Subscription, timer } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AssertionError } from 'assert';
import { Timer } from 'easytimer.js';

import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';
import { Sprint } from 'src/app/models/sprint';
import { Round } from '../../models/round';
import { CommsService } from 'src/app/services/comms.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-poker-control',
  templateUrl: './poker-control.component.html',
  styleUrls: ['./poker-control.component.css']
})

export class PokerControlComponent implements OnInit {

  @Input() sprint_id: string;
  round: Round = {
    "Name": "",
    "Id" : 0,
    "Avg" : 0,
    "Med" : 0,
    "Final" : 0,
    "Archived" : false,
    "CreationTime" : 0,
  };
  nextStory: string = "";
  rounds: Round[];
  stats: number[];
  timePassed = 0;
  displayedColumns: string[] = ['RESULT', 'ROUNDS'];
  user: User;
  baseUrl: string;
  isVoteShown : boolean;
  subscriber: Subscription;
  referenceTime: number;
  timer: Timer = new Timer();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internal: InternalService,
    private comms: CommsService,
    private webSocket: WebsocketService
  ) {}

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.baseUrl = environment.baseUrl;

    this.comms.getSprintDetails(this.sprint_id)
    .subscribe(res => {
      if (res && res.status === 200) {
        if (res.body.d['Id'] === this.sprint_id) {
          this.internal.updateSprint(res.body.d as Sprint);
        } else {
          throw new AssertionError({message: "The server messed up"});
        }
      } else if (res) {
          console.log("Unexpected response:" + res);
      }
    },
    err => {
      console.log('Connection error', err);
      //TODO: Handle properly - notify the user, retry?
      this.router.navigateByUrl(`/join/${this.sprint_id}`);
      return throwError(err);
    })

    
    this.internal.rounds$.subscribe(msg => {
      this.rounds = msg
      this.round = this.rounds[this.rounds.length - 1]
    })

    this.internal.stats$.subscribe(msg => {
      this.stats = msg
    });
    this.internal.user$.subscribe(msg => {
      this.user = msg
    });
    this.internal.user$.pipe(first()).subscribe(msg => {
      if (msg && msg.Id) {
        this.subscriber = this.webSocket.connect(this.sprint_id, msg.Id).subscribe();
        if (msg.Admin){
          this.addStory ("")
        }
      }
    });
    this.internal.isVoteShown$.subscribe(msg => this.isVoteShown = msg);
    
  }

  socketBroadcast() {
    this.webSocket.send("update");
  }

  addStory (story: string): void {

    forkJoin(
      this.comms.addStory(this.sprint_id, story).pipe(first()),
      this.comms.showVote(this.sprint_id, this.user.Id, false ).pipe(first())
      ).subscribe(response => {
      if (response[0] && response[0].status === 200) {
        this.round.Name = story;
        this.nextStory = "";
      } else {
        console.log("Server communication error");
      }
      if (response[1] && response[1].status === 200) {
        this.socketBroadcast();
        this.getRefTime();
      } else {
        console.log("Set Vote to be shown failed");
      }
    });
  }

  getRefTime(){
    if (this.round && this.round.CreationTime != 0) {
      console.log("this.referenceTime", this.round.CreationTime )
    } else {
      this.round.CreationTime = new Date().getTime()/1000
    }
    this.timePassed = (new Date().getTime()/1000 - this.round.CreationTime)/1000
    this.startTimer();
  }

  startTimer(){
    this.timer.start({precision: 'seconds', startValues: {seconds: this.timePassed} });
    let self = this;
    this.timer.addEventListener('secondsUpdated', function (e){
      let exist = document.getElementById("roundTime")
      if (exist){
        exist.innerText = self.timer.getTimeValues().toString().slice(3)
      }
    });
  }

  archiveRound(title: string): void {
    this.setRoundTitle(title)
    this.timer.stop();
    this.comms.archiveRound(this.sprint_id, this.round.Id, this.stats[2],
       this.stats[1], this.stats[3]).subscribe(response => {
      if (response && response.status === 200) {
        this.rounds[this.rounds.length - 1].Archived = true;
        this.internal.updateRounds(this.rounds);
        this.socketBroadcast()
        console.log("Round archived: ", this.round.Id);
        this.addStory ("")
      } else {
        console.log("Server communication error");
      }
    });

    this.comms.selectCard(this.sprint_id, this.user.Id, -1).subscribe(response => {
        if (response.status === 200) {
          console.log("Initialize vote");
        } else {
          console.log("Initialize vote fail");
        }
    });

    this.socketBroadcast();
  }
  
  hideLastElementInList(title: Round, displayTitle: string): any{
    if (title.Archived){
      return title.Final;
    } else if (title.Name == this.round.Name) {
      return "--";
    } else {
      return title.Final;
    }
  }

  beautifyMean(num: number): string{
    return num.toFixed(2);
  }

  copylink(link: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  setRoundTitle(title: string) {
    this.comms.setRoundTitle(this.sprint_id, this.round.Id, title).subscribe(response => {
      if (response && response.status === 200) {
        this.round.Name = title
        this.rounds[this.rounds.length - 1].Name = title;
        this.internal.updateRounds(this.rounds);
        this.socketBroadcast()
        console.log("Updated round", this.round.Id, "title: ", title);
      } else {
        console.log("Server communication error");
      }
    });
  }

  title_ify (title: string) {
    if (title == ""){
      return "👑 " + "is typing ..."
    } else {
      return title
    }
  }

}
