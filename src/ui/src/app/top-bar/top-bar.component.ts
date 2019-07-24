import { Component, OnInit, Input, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommsService } from 'src/app/services/comms.service';
import { InternalService } from '../services/internal.service'; 
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
    private internal: InternalService
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

  isInvalid() {
    return(false)
    //return(this.user.Admin)
    //TODO: set up log out as a new component and update the button everytime a master changes
  }

  logOut() {
    this.comms.getUserDetails(this.sprint.Id, this.user.Id).subscribe(response => {
      if (response.s == 200) {
        this.user.Admin = response.d['Admin'];
        this.internal.updateUser(this.user);
        console.log("user attempt to log out info", this.user)

        if (this.user.Admin){
          console.log("Cannot logout, you havn't set your successor yet!");
        } else {
          this.comms.deleteUser (this.sprint.Id, this.user.Id).subscribe(response => {
            if (response == null) {
              console.log("User logged out");
              localStorage.removeItem("user");
              //FIXME: remove from localStorage
              this.router.navigateByUrl(`/new`);
            } else {
              console.log("User log out failed");
            }
          });
        }

      } else {
        console.log("Network failed while trying to log out");
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
