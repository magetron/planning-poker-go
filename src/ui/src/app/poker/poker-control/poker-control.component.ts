import { Component, OnInit, Input, Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AssertionError } from 'assert';

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
    "Name": "none",
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
  baseUrl: string;
  isVoteShown : boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internal: InternalService,
    private comms: CommsService
  ) {}

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.baseUrl = globals.baseUrl;

    this.comms.getSprintDetails(this.sprint_id)
    .pipe(
      catchError(err => {
        console.log('Connection error', err);
        //TODO: Handle properly - notify the user, retry?
        this.router.navigateByUrl(`/join/${this.sprint_id}`);
        //TODO: delete user from local storage?
        return throwError(err);
      })
    )
    .subscribe(res => {
      if (res && res.s === 200) {
        if (res.d['Id'] === this.sprint_id) {
          this.internal.updateSprint(res.d as Sprint);
        } else {
          throw new AssertionError({message: "The server messed up"});
        }
      } else if (res) { //response indicates the sprintID is invalid
          console.log("Unexpected response:" + res);
      }
    })


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
          this.comms.selectCard(this.sprint_id, this.user.Id, -1 ).subscribe(response => {
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
    this.internal.isVoteShown$.subscribe(msg => this.isVoteShown = msg);
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
/*
    this.comms.showVote(this.sprint_id, this.user.Id, false ).subscribe(response => {
      if (response && response.s === 200) {
        console.log("Set Vote to be shown?", false);
      } else {
        console.log("Set Vote to be shown failed");
      }
    })*/
  }

  refreshSocket(): void {
    //console.log("Pulling data for sprint " + this.sprint_id);
    this.roundInfoSocket$.next(this.sprint_id);
    setTimeout(() => this.refreshSocket(), globals.socketRefreshTime);
  }

  startTimer(): void {
    if (this.storyList && this.storyList[this.storyList.length - 1].CreationTime) {
      setInterval(() => this.timePassed = new Date().getTime() / 1000 - this.storyList[this.storyList.length - 1].CreationTime, 1000)
    } else {
      setTimeout(()=> this.startTimer(), globals.socketRefreshTime);
    }
  }

  archiveRound(): void{
    this.comms.archiveRound(this.sprint_id, this.curStory.Id, this.curStory.Avg, this.curStory.Med, this.curStory.Final).subscribe(response => {
      if (response && response.status === 200) {
        this.curStory.Archived = true;
        this.internal.updateRound(this.curStory);
        console.log("Round archived: ", this.curStory.Id);
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
  }
  
  hideLastElementinList(title: Round, displayTitle: string): any{
    if (title.Archived){
      return title.Final;
    } else if (title.Name == this.curStory.Name) {
      return "voting";
    } else {
      return title.Final;
    }
  }

  beautifyMean(num: number): string{
    return num.toFixed(2);
  }

}
