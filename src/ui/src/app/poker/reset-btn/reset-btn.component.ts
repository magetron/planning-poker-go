import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InternalService } from 'src/app/services/internal.service';
import { CommsService } from 'src/app/services/comms.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-reset-btn',
  templateUrl: './reset-btn.component.html',
  styleUrls: ['./reset-btn.component.css']
})
export class ResetBtnComponent implements OnInit {

  sprint_id: string;
  user: User;
  users: User[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socket: WebsocketService,
    private comms: CommsService,
    private internal: InternalService) {
  }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.internal.user$.subscribe(msg => this.user = msg);
    this.internal.users$.subscribe(msg => this.users = msg)    
  }

  resetFunc() : void {
    this.comms.appointSuccessor(this.sprint_id, this.user.Id , "").subscribe(response => {
      if (response && response.status === 200) {
        this.socket.send("update");
        console.log("Set new admin randomly");

        if (this.users[0].Admin == true) {
          this.comms.deleteUser(this.sprint_id, this.users[0].Id).subscribe(response => {
            if (response == null) {
              console.log("User logged out")
              localStorage.removeItem("user");
              this.socket.send("update")
            }
          });
        }

      } else {
        console.log("All users log out")
        this.internal.logoutAllUsers(true);
      }
    })
  }
}
