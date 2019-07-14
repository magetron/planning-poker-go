import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';
import { Sprint } from 'src/app/models/sprint';
import { Round } from '../../models/round';
import { CommsService } from 'src/app/services/comms.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import * as globals from '../../services/globals.service';

@Component({
  selector: 'app-poker-control',
  templateUrl: './poker-control.component.html',
  styleUrls: ['./poker-control.component.css']
})

export class PokerControlComponent implements OnInit {

  @Input() sprint_id: string;
  curStory: Round = {
    "Name": "default",
    "Id" : 0,
    "Avg" : 0,
    "Med" : 0,
    "Final" : 0,
    "Archived" : false,
    "CreationTime" : 0,
  };
  nextStory: string = "";
  storyList: Round[];
  roundInfoSocket$: WebSocketSubject<any>;
  stats: number[];
  timePassed = 0;
  displayedColumns: string[] = ['ROUNDS', 'RESULT'];
  user: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internal: InternalService,
    private comms: CommsService,
  ) {}

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');

    this.roundInfoSocket$ = webSocket({
      url: globals.roundInfoSocket,
      serializer: msg => msg, //Don't JSON encode the sprint_id
      deserializer: ({data}) => {
        //console.log(data);
        return JSON.parse(data);
      },
      openObserver: {
        next: () => {
          this.startTimer(); //TODO: replace with always counting maybe?
        }
      },
      binaryType: "blob",
    });

    //TODO: catch server unavailable
    this.roundInfoSocket$.subscribe(
      msg => { // Called whenever there is a message from the server.
        //console.log('socket received');
        this.storyList = msg;
        //console.log("storyList: ",msg," ", this.storyList[this.storyList.length - 1]);
        this.curStory = this.storyList[this.storyList.length - 1];

        if (this.curStory.Archived){
          this.comms.selectCard(this.sprint_id, this.user.Id, -1, "none").subscribe(response => {
              if (response.status === 200) {
                //console.log("Initialize vote");
              } else {
                //console.log("Initialize vote fail");
              }
          });
        } else {
          this.curStory.Avg = this.stats[2];
          this.curStory.Med = this.stats[1];
          this.curStory.Final = this.stats[1];
        }
      },
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );

    //Start talking ot the socket
    this.refreshSocket();
    this.internal.stats$.subscribe(msg => this.stats = msg);
    this.internal.user$.subscribe(msg => this.user = msg);
  }

  addStory (story: string): void {
    this.startTimer();
    this.comms.addStory(this.sprint_id, story).subscribe(response => {
      if (response && response.status === 200) {
        //console.log("Story submitted, Sprint-id:", this.sprint_id);
        this.curStory.Name = story;
        this.nextStory = "";
      } else {
        console.log("Server communication error");
      }
    });
  }

  refreshSocket(): void {
    //console.log("Pulling data for sprint " + this.sprint_id);
    this.roundInfoSocket$.next(this.sprint_id);
    setTimeout(() => this.refreshSocket(), globals.socketRefreshTime);
  }

  startTimer(): void {
    if (this.storyList && this.storyList[this.storyList.length - 1].CreationTime) {
      setInterval(() => this.timePassed = new Date().getTime() / 1000 - this.storyList[this.storyList.length - 1].CreationTime, 1000)
      console.log("Timer started, ID:");
    } else {
      console.log("Time start failed");
      setTimeout(()=> this.startTimer(), globals.socketRefreshTime);
    }
  }

  archiveRound(): void{
    this.comms.archiveRound(this.sprint_id, this.curStory.Id, this.curStory.Avg, this.curStory.Med, this.curStory.Final).subscribe(response => {
      if (response && response.status === 200) {
        console.log("Round archived: ", this.curStory.Id);
      } else {
        console.log("Server communication error");
      }
    });

    this.comms.selectCard(this.sprint_id, this.user.Id, -1, "none").subscribe(response => {
        if (response.status === 200) {
          console.log("Initialize vote");
        } else {
          console.log("Initialize vote fail");
        }
    });
  }

}
