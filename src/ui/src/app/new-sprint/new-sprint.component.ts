import { Component, OnInit } from '@angular/core';

import { Sprint } from '../models/sprint';
import { CommsService } from '../services/comms.service';
import { InternalService } from '../services/internal.service';


@Component({
  selector: 'app-new-sprint',
  templateUrl: './new-sprint.component.html',
  styleUrls: ['./new-sprint.component.css']
})

export class NewSprintComponent implements OnInit {

  sprint: Sprint;
  name: string = '';

  constructor(private commsService: CommsService, private intern: InternalService) { }

  ngOnInit() {
    this.sprint = {
      id: '',
      name: ''
    }
  }

  createSprint(name: string): void {
    //POST sprint.name to /new
    if (name) {
      this.commsService.createSprint(name).subscribe(response => {
        if (response) {
          this.sprint.id = response.d;
          this.sprint.name = name;
          this.intern.updateSprint(this.sprint);
        }
      });
    } else {
      console.log("Empty sprint name submitted");
    }
  }
}
