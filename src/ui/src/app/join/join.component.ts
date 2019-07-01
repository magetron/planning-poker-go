import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  @Input() user: User; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CommsService
  ) { }

  ngOnInit() {
    let proposed_id = this.route.snapshot.paramMap.get('sprint_id');
    //TODO: get sprint title from backend
    //if you get a sprint title, set the sprint

    this.sprint.id = proposed_id;
    //this.sprint.name = ;
  }

}
