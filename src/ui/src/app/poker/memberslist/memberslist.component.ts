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
  user: User;
  @Input() sprint_id: string;
  voteSocket$: WebSocketSubject<any>;
  showV: boolean = false;
  btn1text: string;
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
        //console.log(data);
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
        //this.internal.updateUser(this.userRank());
        //console.log("this.stats = ", this.internal.stats._value[0])
      },
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );

    //Start talking ot the socket
    this.refreshSocket();
    this.btn1text = "Show Vote";
    this.internal.user$.subscribe(msg => this.user = msg);
  }

  refreshSocket(): void {
    //console.log("Pulling data for sprint " + this.sprint_id);
    this.voteSocket$.next(this.sprint_id);
    setTimeout(() => this.refreshSocket(), globals.socketRefreshTime);
  }

  analysisVote(): Array<number> {
    //result is an array of votes
    let result = this.users.map(i => i.Vote);
    //strip non-votes
    result = result.filter(i => i !== -1 && i !== -2);

    //calculate parameters
    var avg = parseFloat(this.mean(result).toFixed(2));
    var median = this.median(result);
    var mode = this.mode(result);
    //console.log("Mode, Median, Avg = ", [mode, median, avg]);
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

  showVoteFunc(): void {
  var state = document.getElementById("btn1").classList.toggle("showV");
  document.getElementById("btn1").classList.toggle("hideV")

  if (state){
    this.showV = true;
    this.btn1text = "Hide Vote";
  } else {
    this.showV = false;
    this.btn1text = "Show Vote";
  }

  }

  setNextMaster(user) : void{
    //console.log("debug userId ", user.Id);
    //console.log("debug this.userId ", this.user.Id);
    //console.log("debug this.user.Master ", this.user.Master);
    
    if (this.user.Master ){
      this.comms.appointSuccessor(this.sprint_id, this.user.Id, user.Id).subscribe(response => {
        //console.log("-----------debug: ", user.Id);
        if (response && response.s === 200) {
          //this.user.Master = response.d["Master"] 
          //this.internal.updateUser(this.user);
          console.log("Set successor");
          //TODO:update front end this.user via emmit
        } else {
          console.log("Set successor failed");
        }
      })
    }
    //console.log("func ended");
    //console.log("debug userId ", user.Id);
    //console.log("debug this.userId ", this.user.Id);
    //console.log("debug this.user.Master ", this.user.Master);
  }

  //userRank(): User {
  //  let id = this.users.map(x => x.Id)
  //  let rankings = this.users.map(y => y.Master);
  //  for (let i in id) {
  //    if (this.user == id[i]){
  //      this.user.Master = rankings[i];
  //      return (this.user)
  //    }
  //  }
  //}

  crowned (user): string{
    if (user.Master) {
      return ("Master:" + user.Name)
    } else {
      return (user.Name)
    }
  }

}
