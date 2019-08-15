import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    private commsService: CommsService, 
    private intern: InternalService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.sprint = {
      Id: '',
      Name: '',
      CreationTime: Date.toString()
    }
  }

  createSprint(name: string): void {
    //POST sprint.name to /new
    if (name) {
      this.commsService.createSprint(name).subscribe(response => {
        if (response) {
          this.sprint = {
            Id: response.d,
            Name: name,
            //TODO: We should really return it from the server instead
            CreationTime: Date.toString(), 
          }
          this.intern.updateSprint(this.sprint);
          this.router.navigateByUrl(`/join/${this.sprint.Id}`)
        }
      });
    } else {
      console.log("Empty sprint name submitted");
    }
  }
}
