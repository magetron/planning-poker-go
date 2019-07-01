import { Component, OnInit, Input } from '@angular/core';

import { Sprint } from '../sprint';
import { CommsService } from '../comms.service';

@Component({
  selector: 'app-new-sprint',
  templateUrl: './new-sprint.component.html',
  styleUrls: ['./new-sprint.component.css']
})

export class NewSprintComponent implements OnInit {

  sprint: Sprint;
  @Input() name: string = '';

  constructor(private commsService: CommsService) { }

  ngOnInit() {
    this.sprint = Sprint.constructor();
  }

  createSprint(): void {
      //POST sprint.name to /new
    try {
      this.commsService.createSprint(this.name).subscribe(
        result => {
          //this.sprint.id = result; //FIXME
          this.sprint.name = this.name;

          console.log(this.sprint.id);

          //TODO: Pass the Sprint object to shareComponent
        },
        error => {
          console.log("Creating a sprint failed /r/n" + error);
        }
      );
    } catch {

    }

  }
}
