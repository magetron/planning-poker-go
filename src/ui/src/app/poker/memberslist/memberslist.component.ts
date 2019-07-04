import { Component, Input, OnInit } from '@angular/core';

import { InternalService } from 'src/app/services/internal.service';
import { CommsService } from 'src/app/services/comms.service';
import { User } from 'src/app/models/user';
import { Sprint } from 'src/app/models/sprint';

@Component({
  selector: 'app-memberslist',
  templateUrl: './memberslist.component.html',
  styleUrls: ['./memberslist.component.css']
})

export class MemberslistComponent implements OnInit {

  users: User[];
  @Input() sprint_id: string;

  displayedColumns: string[] = ['NAME'];

  constructor(
    private comms: CommsService,
    private internal: InternalService) { }

  ngOnInit() {
    console.log("Pulling data for sprint "+ this.sprint_id);
    this.comms.getSprintUsers(this.sprint_id).subscribe(res => {
      if (res && res.s === 200) {
        this.users = res.d as Array<User>;
      }
    });

  }
}
