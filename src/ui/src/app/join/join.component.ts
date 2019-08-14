import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CommsService } from '../services/comms.service';
import { InternalService } from '../services/internal.service';
import { Sprint } from '../models/sprint';
import { User } from '../models/user';
import { AssertionError } from 'assert';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})

export class JoinComponent implements OnInit {

  sprint: Sprint;
  username: string;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comms: CommsService,
    private internal: InternalService,
  ) { }

  ngOnInit() {
    this.initialize();
    this.sprint.Id = this.route.snapshot.paramMap.get('sprint_id');

    //TODO: this acts as a guard. Could be made into one
    //if you get a sprint title, set the sprint
    this.comms.getSprintDetails(this.sprint.Id)
      .subscribe(res => {
        console.info(res)
        if (res && res.status === 200) {
          if (res.body.d.Id === this.sprint.Id) {
            this.sprint.Name = res.body.d['Name'];
            this.internal.updateSprint(res.body.d as Sprint);

            if (this.internal.reloadOrKickUser()) {
              this.router.navigateByUrl(`/table/${this.sprint.Id}`);
            }

          } else {
            throw new AssertionError({message: "The server messed up"});
          }
        } else { //response indicates the sprintID is invalid
          console.log("Unexpected responce:" + res);
          this.router.navigateByUrl(`/new`);
        }
      },
      err => {
        console.log('Connection error', err);
        //TODO: Handle properly - notify the user, retry?
        this.router.navigateByUrl(`/new`);
      })
  }

  registerUser(username: string): void {
    if (username) {
      this.comms.joinSprint(username, this.sprint).subscribe(
        res => {
          if (res && res.s === 200) {
            this.internal.logInUser(res.d as User);
            this.router.navigateByUrl(`/table/${this.sprint.Id}`);
          } else if (res && res.s === 404) {
            console.log("Sprint not found");
            this.router.navigateByUrl(`/new`); //TODO get .status and test that instead
          } else {
            console.log("Connection error");
          }
        },
        err => {
          console.log('Connection error', err);
          //TODO: Handle properly - notify the user, retry?
          throw(err);
        }
      )
    } else {
      console.log("Empty username submitted")
    }
  }

  initialize(): void {
    //console.log("intialize func is being called")
    this.sprint = {
      Name: "",
      Id: "",
      CreationTime: Date.toString(),
    }
  }
}
