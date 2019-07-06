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
      deserializer: ({data}) => {
        console.log(data);
        let j = JSON.parse(data) as User[];
        this.refreshSocket();
        return j;
      },
      openObserver: {
        next: function () {
           () => this.refreshSocket();
        }
      },
      binaryType: "blob",
    });
    //TODO: catch server unavailable
    
    this.voteSocket$.subscribe(
      msg => { // Called whenever there is a message from the server.
        console.log('socket received');
        this.users = msg; 
      }, 
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );

    /*
    this.comms.getSprintUsers(this.sprint_id).subscribe(res => {
      if (res && res.s === 200) {
        this.users = res.d as Array<User>;
      }
    });*/
  }

  refreshSocket(): void {
    console.log("Pulling data for sprint " + this.sprint_id);
    this.voteSocket$.next(this.sprint_id);
    setTimeout(function() {
      ()=> this.refreshSocket()
    }, globals.socketRefreshTime);
  }
}
