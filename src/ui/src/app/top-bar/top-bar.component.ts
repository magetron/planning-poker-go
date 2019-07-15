import { Component, OnInit, Input} from '@angular/core';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private comms: CommsService,
    private internal: InternalService
  ) { }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.internal.user$.subscribe(user => this.user = user);
    this.internal.sprint$.subscribe(sprint => this.sprint = sprint)
  }

  isInvalid() {
    return(false)
    //return(this.user.Rank)
    //TODO: set up log out as a new component and update the button everytime a master changes
  }

  logOut() {
    this.comms.getUserDetails(this.sprint.Id, this.user.Id).subscribe(response => {
      if (response.s == 200) {
        this.user.Rank = response.d['Rank'];
        this.internal.updateUser(this.user);
        console.log("user attempt to log out info", this.user)

        if (this.user.Rank == 1){
          console.log("Cannot logout, you havn't set your successor yet!");
        } else {
          this.comms.deleteUser (this.sprint.Id, this.user.Id).subscribe(response => {
            if (response.s == 200) {
              console.log("User logged out");
              this.router.navigateByUrl(`/new`);
            } else {
              console.log("User log out failed");
            }
          });
        }

      } else {
        console.log("Error");
      }
    });
  }

}
