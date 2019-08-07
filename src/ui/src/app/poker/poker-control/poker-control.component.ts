import { Component, OnInit, Input, Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { throwError, forkJoin, Subscription } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AssertionError } from 'assert';

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
    "Name": "none",
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
  subscriber: Subscription

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
      if (res && res.s === 200) {
        if (res.d['Id'] === this.sprint_id) {
          this.internal.updateSprint(res.d as Sprint);
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

    this.subscriber = this.webSocket.connect(this.sprint_id).subscribe();
    
    this.internal.rounds$.subscribe(msg => {
      this.rounds = msg
      this.round = this.rounds[this.rounds.length - 1]
      }
    )

    this.internal.stats$.subscribe(msg => {
      this.stats = msg
    });
    this.internal.user$.subscribe(msg => this.user = msg);
    this.internal.isVoteShown$.subscribe(msg => this.isVoteShown = msg);
    this.startTimer();
  }

  socketBroadcast() {
    this.webSocket.send("update");
  }

  addStory (story: string): void {
    this.startTimer();

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
        console.log("Set Vote to be shown?", false);
        this.socketBroadcast();
      } else {
        console.log("Set Vote to be shown failed");
      }
    });
  }

  startTimer(): void {
    if (this.rounds && this.rounds[this.rounds.length - 1].CreationTime) {
      setInterval(() => this.timePassed = new Date().getTime() / 1000 - this.rounds[this.rounds.length - 1].CreationTime, 1000)
    } else {
      setTimeout(()=> this.startTimer(), 1000);
      //Timer is updated every 1000ms.
    }
  }

  archiveRound(): void {
    this.comms.archiveRound(this.sprint_id, this.round.Id, this.stats[2],
       this.stats[1], this.stats[3]).subscribe(response => {
      if (response && response.status === 200) {
        this.rounds[this.rounds.length - 1].Archived = true;
        this.internal.updateRounds(this.rounds);
        this.socketBroadcast()
        console.log("Round archived: ", this.round.Id);
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
  
  hideLastElementinList(title: Round, displayTitle: string): any{
    if (title.Archived){
      return title.Final;
    } else if (title.Name == this.round.Name) {
      return "voting";
    } else {
      return title.Final;
    }
  }

  beautifyMean(num: number): string{
    return num.toFixed(2);
  }

  secondsToClockString(seconds: number): string {
    let min = (seconds/60).toLocaleString("en", {maximumFractionDigits: 0})
    let sec = (seconds%60).toLocaleString("en", {minimumIntegerDigits: 2, maximumFractionDigits: 0})

    return min + ":" + sec
  }
}
