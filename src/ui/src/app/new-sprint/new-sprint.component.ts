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
      this.commsService.createSprint(this.name).subscribe(result => {
        
        if (result.statusCodes !== 200) {
          
        } else {
        this.sprint.id = result;
        this.sprint.name = this.name;

        console.log(this.sprint.id);
        }
      });

    //See responce, show responce
    //maybe make this async and in a separate function?
    //this.sprint.id = result.;
  }

}
