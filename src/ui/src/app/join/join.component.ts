import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CommsService } from '../comms.service';
import { Sprint } from '../sprint';
import { User } from '../user';

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
    private service: CommsService,
  ) { }

  ngOnInit() {
    this.intialize();
    this.sprint.id = this.route.snapshot.paramMap.get('sprint_id');
    //TODO: get sprint title from backend
    //if you get a sprint title, set the sprint
    this.service.getSprintDetails(this.sprint.id)
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
    //this.service
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
