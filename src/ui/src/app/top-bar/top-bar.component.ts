import { Component, OnInit, Input, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

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
  sprint: Sprint;
  @Input() sprint_id: string;
  logoutAll: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private comms: CommsService,
    private internal: InternalService,
    private socket: WebsocketService,
  ) { }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.internal.user$.subscribe(user => this.user = user);
    this.internal.sprint$.subscribe(sprint => this.sprint = sprint);
    this.internal.logoutAll$.subscribe(msg => {
      if(msg){
        console.log("logging all user out",msg);
        this.router.navigateByUrl(`/new`);
        console.log("logging all user out");
      }
    });
  }

  logOut() {
    this.internal.user$.pipe(first()).subscribe(response => {
      if (this.user.Admin){
        console.log("Cannot logout, you haven't set your successor yet!");
      } else {
        this.comms.deleteUser(this.sprint.Id, this.user.Id).subscribe(response => {
          if (response == null) {
            console.log("User logged out");
            localStorage.removeItem("user");
            this.socket.send("update")
            this.internal.updateUser(null);
            this.router.navigateByUrl(`/new`);
          } else {
            console.log("User log out failed");
          }
        });
      }
    });
  }


 @HostListener('window:unload', [ '$event' ])
   unloadHandler(event) {
    if (this.user.Admin){
      console.log("Admin logout");
      this.comms.appointSuccessor(this.sprint_id, this.user.Id, "");
      /*.subscribe(response => {
        if (response && response.status === 200) {
          console.log("Set new admin random successful")
        } else {
          console.log("All users log out")
          this.internal.logoutAllUsers(true);
        }
      })*/
    }
    console.log("func ended");
  }

}
