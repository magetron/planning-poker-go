import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CommsService } from '../services/comms.service';
import { InternalService } from '../services/internal.service';
import { Sprint } from '../../models/sprint';
import { User } from '../../models/user';

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
    .pipe (
      catchError(err => {
        console.log('Connection error', err);
        //TODO: Handle properly - notify the user, retry?
        return throwError(err);
      })
    )
    .subscribe( response => {
      if (response) {
        if (response.d['Id'] === this.sprint.id) {
          this.sprint.name = response.d['Name'];
        } else {
          //TODO: redirect - invalid Id
        }
      }
    })
  }

  registerUser(username: string): void {
    this.user.name = username;

    console.log("Waiting for backend to implement user management");
    this.internal.updateUser(this.user);
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
