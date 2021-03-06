import { Component, OnInit, Input, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommsService } from 'src/app/services/comms.service';
import { InternalService } from '../services/internal.service'; 
import { WebsocketService } from '../services/websocket.service';
import { User } from '../models/user';
import { Sprint } from '../models/sprint';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {

  user: User;
  users: {[key: string]: User};
  sprint: Sprint;
  @Input() sprint_id: string;
  logoutAll: boolean;
  subscriber

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private comms: CommsService,
    private internal: InternalService,
    private webSocket: WebsocketService,
  ) { }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.internal.sprint$.subscribe(sprint => this.sprint = sprint);
    this.internal.logoutAll$.subscribe(msg => {
      if(msg){
        console.log("logging all user out",msg);
        this.router.navigateByUrl(`/new`);
        console.log("logging all user out");
      }
    });
    if (this.sprint_id) {
      this.internal.user$.pipe(first()).subscribe(msg => {
        this.subscriber = this.webSocket.connect(this.sprint_id, msg.Id).subscribe();
      })
    };
    this.internal.user$.subscribe(msg => 
      this.user = msg
    );
    this.internal.users$.subscribe(msg => this.users = msg)
  }

  logOut() {
    this.internal.user$.pipe(first()).subscribe(response => {
      if (this.user.Admin){
        console.log("Cannot logout, you haven't set your successor yet!");
      } else {
        this.comms.deleteUser(this.sprint.Id, this.user.Id).subscribe(response => {
          if (response == null) {
            console.log("User logged out")
            localStorage.removeItem("user");
            this.webSocket.send("update")
            this.internal.updateUser(null);
            this.router.navigateByUrl(`/new`);
          } else {
            console.log("User log out failed");
          }
        });
      }
    });
  }


 @HostListener('window:beforeunload', [ '$event' ])
    unloadHandler(event) {
    console.log("someone closes the window")
    if (this.user.Admin){

      this.comms.appointSuccessor(this.sprint_id, this.user.Id , "").subscribe(response => {
        if (response && response.status === 200) {
          console.log("Set new admin randomly");
  
          this.comms.deleteUser(this.sprint_id, this.users[0].Id).subscribe(response => {
            if (response == null) {
              console.log("User logged out")
              localStorage.removeItem("user");
              this.webSocket.send("update")
            }
          });
        }
      })

    } else {
      this.logOut()
      this.webSocket.send("update")
    }
  }

}
