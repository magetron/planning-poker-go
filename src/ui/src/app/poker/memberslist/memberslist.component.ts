import { Component, Input, OnInit } from '@angular/core';

import { InternalService } from 'src/app/services/internal.service';
import { CommsService } from 'src/app/services/comms.service';
import { User } from 'src/app/models/user';
import { Sprint } from 'src/app/models/sprint';
import { Cardify } from '../../models/cardify.component';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import * as globals from "../../services/globals.service";

@Component({
  selector: 'app-memberslist',
  templateUrl: './memberslist.component.html',
  styleUrls: ['./memberslist.component.css']
})

export class MemberslistComponent extends Cardify implements OnInit {

  users: User[];
  @Input() sprint_id: string;
  voteSocket$: WebSocketSubject<any>;

  displayedColumns: string[] = ['NAME', 'VOTE'];

  constructor(
    private comms: CommsService,
    private internal: InternalService) {
    super();
  }

  ngOnInit() {
    this.voteSocket$ = webSocket({
      url: globals.voteSocket,
      serializer: msg => msg, //Don't JSON encode the sprint_id
      deserializer: ({ data }) => {
        console.log(data);
        let j = JSON.parse(data) as User[];
        return j;
      },
      binaryType: "blob",
    });

    //TODO: catch server unavailable
    this.voteSocket$.subscribe(
      msg => { // Called whenever there is a message from the server.
        //console.log('socket received');
        this.users = msg;
        this.internal.updateStats(this.analysisVote());
        //console.log("this.stats = ", this.internal.stats._value[0])
      },
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );

    //Start talking ot the socket
    this.refreshSocket();
  }

  refreshSocket(): void {
    //console.log("Pulling data for sprint " + this.sprint_id);
    this.voteSocket$.next(this.sprint_id);
    setTimeout(() => this.refreshSocket(), globals.socketRefreshTime);
  }

  analysisVote(): Array<number> {
    let result = [];
    for (const i of this.users) {
      if (i.Vote != -1 && i.Vote != -2 ) {
        //console.log("Vote added", i.Vote);
        result.push(i.Vote);
        console.log("Vote Array is ", result);
      } else {
        console.log("No vote is registered");
      }
    }
    var avg = parseFloat(this.mean(result).toFixed(2));
    var median = this.median(result);
    var mode = this.mode(result);
    console.log("Mode, Median, Avg = ", [mode, median, avg]);
    return [mode, median, avg];
  }

  mean(arr): number {
    var i,
    sum = 0,
    for (i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  }

  median(arr): number {
    if (arr.length === 0) return 0;
    arr.sort(function(a, b) {
      return a - b;
    });
    var half = Math.floor(arr.length / 2);
    if (arr.length % 2){
      return arr[half];
    } else {
      return (arr[half - 1] + arr[half]) / 2.0;
    }
  }

  mode(arr): number {
    var modes = [], count = [], i, number, maxIndex = 0;

    for (i = 0; i < arr.length; i += 1) {
      number = arr[i];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
        maxIndex = count[number];
      }
    }

    for (i in count)
      if (count.hasOwnProperty(i) && count[i] === maxIndex) {
          modes.push(Number(i));
      }
    return Math.max.apply(null, modes);
  }
}
