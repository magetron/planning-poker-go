import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';
import { Sprint } from 'src/app/models/sprint';
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
  sprint: Sprint;
  user: User;
  curStory: string = 'default';
  nextStory: string = '';
  storyList: Sprint[];
  roundInfoSocket$: WebSocketSubject<any>;
  stats: number[];

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
        console.log(data);
        let j = JSON.parse(data) as User[];
        return j;
      },
      binaryType: "blob",
    });

    //TODO: catch server unavailable
    this.roundInfoSocket$.subscribe(
      msg => { // Called whenever there is a message from the server.
        //console.log('socket received');
        this.storyList = msg;
      },
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );

    //Start talking ot the socket
    this.refreshSocket();
    this.internal.stats$.subscribe(msg => this.stats = msg);
  }

  addStory (story: string): void {
    if (story) {
      this.comms.addStory(this.sprint_id, story).subscribe(response => {
        if (response && response.status === 200) {
          console.log("Story submitted, Sprint-id:", this.sprint_id);
          this.curStory = story;
          this.nextStory = '';
        }
      });
    } else {
      console.log("Empty story title submitted");
    }
  }

  refreshSocket(): void {
    //console.log("Pulling data for sprint " + this.sprint_id);
    this.roundInfoSocket$.next(this.sprint_id);
    setTimeout(() => this.refreshSocket(), globals.socketRefreshTime);
  }
}
