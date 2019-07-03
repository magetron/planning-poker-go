import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CommsService } from '../services/comms.service';
import { InternalService } from '../services/internal.service';
import { Sprint } from '../models/sprint';
import { User } from '../models/user';

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
    this.sprint.id = this.route.snapshot.paramMap.get('sprint_id');
    //TODO: get sprint title from backend
    //if you get a sprint title, set the sprint
    this.comms.getSprintDetails(this.sprint.id)
      .pipe(
        catchError(err => {
          console.log('Connection error', err);
          //TODO: Handle properly - notify the user, retry?
          return throwError(err);
        })
      )
      .subscribe(res => {
        if (res && res.s === 200) {
          if (res.d['Id'] === this.sprint.id) {
            this.sprint.name = res.d['Name'];
            this.internal.updateSprint(this.sprint);
          } else {
            //TODO: redirect - invalid Id
          }
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
            this.user.id = res.d['Id'];
            this.user.name = res.d['Name'];
            this.internal.updateUser(this.user);
            this.router.navigateByUrl(`/table/${this.sprint.id}`);
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
    this.user = {
      name: "",
      id: "",
    }
    this.sprint = {
      name: "",
      id: "",
    }
  }
}
