import { Component, OnInit, Input } from '@angular/core';

import { Sprint } from '../sprint';

@Component({
  selector: 'app-new-sprint',
  templateUrl: './new-sprint.component.html',
  styleUrls: ['./new-sprint.component.css']
})

export class NewSprintComponent implements OnInit {

  @Input() sprintName: Sprint;

  constructor() { }

  ngOnInit() {
  }

}
