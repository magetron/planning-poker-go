import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';
import { Sprint } from 'src/app/models/sprint';
import { CommsService } from 'src/app/services/comms.service';

@Component({
  selector: 'app-poker-control',
  templateUrl: './poker-control.component.html',
  styleUrls: ['./poker-control.component.css']
})

export class PokerControlComponent implements OnInit {

  @Input() sprint_id: string;
  sprint: Sprint;
  user: User;
  curStory: string = 'default';
  nextStory: String = '';
  storylist:string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internal: InternalService,
    private comms: CommsService,
  ) {}

  ngOnInit() {
  }


  addStory (story: string): void {
    if(story) {
      this.comms.addStory(this.sprint_id, story).subscribe(response => {
        if (response){
          console.log("Story submitted");
          this.curStory = story;
          this.nextStory = '';
        }
      });
    } else {
      console.log("Empty story title submitted");
    }
  }

}
