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
    this.intialize();
    this.sprint.Id = this.route.snapshot.paramMap.get('sprint_id');
    //if you get a sprint title, set the sprint
    this.comms.getSprintDetails(this.sprint.Id)
      .pipe(
        catchError(err => {
          console.log('Connection error', err);
          //TODO: Handle properly - notify the user, retry?
          this.router.navigateByUrl(`/new`);
          return throwError(err);
        })
      )
      .subscribe(res => {
        if (res && res.s === 200) {
          if (res.d['Id'] === this.sprint.Id) {
            this.sprint.Name = res.d['Name'];
            this.internal.updateSprint(res.d as Sprint);
          } else {
            throw new AssertionError({message: "The server messed up"});
          }
        } else if (res) { //response indicates the sprintID is invalid
            console.log("Unexpected responce:" + res);
        }
      })
  }

  registerUser(username: string): void {
    if (username) {
      this.comms.joinSprint(username, this.sprint).pipe(
        catchError(err => {
          console.log('Connection error', err);
          //TODO: Handle properly - notify the user, retry?
          return throwError(err);
        })
      ).subscribe(
        res => {
          if (res && res.s === 200) {
//            this.user = res.d as User;
            this.internal.logInUser(res.d as User);
            this.router.navigateByUrl(`/table/${this.sprint.Id}`);
          } else if (res && res.s === 404) {
            console.log("Sprint not found");
            this.router.navigateByUrl(`/new`); //TODO get .status and test that instead
          } else {
            console.log("Connection error");
          }
        }
      )
    } else {
      console.log("Empty username submitted")
    }
  }

  intialize(): void {
    console.log("intialize func is being called")
    /*
    this.user = {
      Name: "",
      Id: "",
      Vote: -1,
      Admin: false,
    }*/
    this.sprint = {
      Name: "",
      Id: "",
    }
  }
}
