import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalService } from 'src/app/services/internal.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { User } from 'src/app/models/user';
import { Round } from 'src/app/models/round';
import { CommsService } from 'src/app/services/comms.service';
import { Cardify } from '../../models/cardify.component';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.css']
})

export class PokerCardComponent extends Cardify implements OnInit {

  points: number[] = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, -2]
  @Input() sprint_id: string;
  user: User;
  round: Round;
  enableCard: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internal: InternalService,
    private comms: CommsService,
    private webSocket: WebsocketService,
  ) { super(); }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.internal.user$.subscribe(
      res => this.user = res
    )

    if (!this.user || !this.user.Id) {
      this.router.navigate(["join", this.sprint_id])
    }

    this.internal.rounds$.subscribe(msg => this.round = msg[-1] );
  }

  socketBroadcast() {
    this.webSocket.send("update");
  }

  vote(point: number) {
    this.comms.selectCard(this.sprint_id, this.user.Id, point).subscribe((response => {
        if (response.status === 200) {
          this.socketBroadcast();
          let old = document.getElementsByClassName("card-secondary")
          if (old[0]) {
            old[0].classList.remove("card-secondary");
          }
          document.getElementById(point.toString()).classList.add("card-secondary");
          this.user.Vote = point;
          this.internal.updateUser(this.user);

        } else {
          console.log("Selection error");
        }
    }))
  }
}
