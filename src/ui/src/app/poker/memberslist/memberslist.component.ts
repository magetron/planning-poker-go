import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InternalService } from 'src/app/services/internal.service';
import { CommsService } from 'src/app/services/comms.service';
import { User } from 'src/app/models/user';
import { Sprint } from 'src/app/models/sprint';
import { Cardify } from '../../models/cardify.component';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import * as globals from "../../services/globals.service";
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-memberslist',
  templateUrl: './memberslist.component.html',
  styleUrls: ['./memberslist.component.css']
})

export class MemberslistComponent extends Cardify implements OnInit {

  users: User[];
  user: User;
  @Input() sprint_id: string;

  showV: boolean = false;
  btn1text: string;
  displayedColumns: string[] = ['NAME', 'VOTE'];

  constructor(
    private router: Router,
    private webSocket: WebsocketService,
    private comms: CommsService,
    private internal: InternalService) {
    super();
  }

  ngOnInit() {
    this.socketBroadcast();
    this.btn1text = "Show Vote";
    this.internal.user$.subscribe(msg => this.user = msg);
    this.internal.users$.subscribe(msg => {
      this.users = msg;
      if(this.users){
        this.internal.updateStats(this.analysisVote());
      }
    });
  }

  socketBroadcast() {
    this.webSocket.send("update");
  }

  analysisVote(): Array<number> {
    let result = this.users.map(i => i.Vote);

    //strip non-votes
    result = result.filter(i => ![-1, -2, -3].includes(i));

    if(result.length === 0) return [0, 0, 0];

    var avg = this.mean(result);
    var median = this.median(result);
    var mode = this.mode(result);
    return [mode, median, avg];
  }

  mean(arr): number {
    var i, sum = 0;
    for (i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  }

  median(arr): number {
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

  showVoteFunc(): void {
    var state = document.getElementById("btn1").classList.toggle("showV");
    document.getElementById("btn1").classList.toggle("hideV")

    if (state) {
      this.showV = true;
      this.internal.showVote(this.showV)
      this.btn1text = "Hide Vote";
    } else {
      this.showV = false;
      this.internal.showVote(this.showV)
      this.btn1text = "Show Vote";
    }

    console.log("showV value", this.showV);
    this.comms.showVote(this.sprint_id, this.user.Id, this.showV ).subscribe((response => {
      if (response.status === 200) {
        this.socketBroadcast();
        //console.log("Set Vote to be shown?", this.showV);
      } else {
        console.log("Set Vote to be shown failed");
      }
    }))
  }

  setNextAdmin(successor : User) : void{
    if (this.user.Admin){
      this.comms.appointSuccessor(this.sprint_id, this.user.Id, successor.Id).subscribe(response => {
        console.info(response);
        if (response && response.status === 200) {
          console.log("Set successor");
          this.internal.updateUser(this.user);
          this.socketBroadcast();
        } else {
          console.log("Set successor failed");
        }
      })
    }
  }

  updateMe(): User {
    if (this.users.length >1 &&
     this.users[0].Id == this.user.Id &&
     this.users[0].Admin) {
      return (this.users[0])
    }
    return this.user;    
  }

  crowned (user: User): string {
    if (user.Admin) {
      return (user.Name +" \uD83D\uDC51")
    } else {
      return (user.Name)
    }
  }
}
