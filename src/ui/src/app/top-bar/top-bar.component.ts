import { Component, OnInit } from '@angular/core';

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

  constructor(private internal: InternalService) { }

  ngOnInit() {
    this.internal.user$.subscribe(user => this.user = user);
    this.internal.sprint$.subscribe(sprint => this.sprint = sprint)
  }

  //logOut() {
    
  //}

}
