import { Component, OnInit } from '@angular/core';

import { Sprint } from '../sprint';
import { CommsService } from '../comms.service';

@Component({
  selector: 'app-new-sprint',
  templateUrl: './new-sprint.component.html',
  styleUrls: ['./new-sprint.component.css']
})

export class NewSprintComponent implements OnInit {

  sprint: Sprint;
  name: string = '';

  constructor(private commsService: CommsService) { }

  ngOnInit() {
    this.sprint = {
      id: '123',
      name: '123'
    }
  }

  createSprint(): void {
      //POST sprint.name to /new
      if (this.name){
        this.commsService.createSprint(this.name).subscribe( response => {
          if (response) {
            this.sprint.id = response.d;
            this.sprint.name = this.name;
          }
        });
      }
  }
}
