import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';
//import { Round } from 'src/app/models/round';
import { CommsService } from 'src/app/services/comms.service';
import { Cardify } from '../../models/cardify.component';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.css']
})

export class PokerCardComponent extends Cardify implements OnInit {

  points: number[] = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, -2]
  @Input() sprint_id: string;
  user: User;
  enableCard: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internal: InternalService,
    private comms: CommsService,
  ) { super(); }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.internal.user$.subscribe(
      res => this.user = res
    )
    //Kick undefined users to rejoin, for example when reloading page
    if (!this.user || !this.user.Id) {
      this.router.navigate(["join", this.sprint_id])
    }
    /*this.internal.round$.subscribe(msg => {
      if (msg.Archived) {
        console.log("msg.archived received")
        this.enableCard = true;
        var i = document.getElementsByClassName("card-secondary");
        for(var j=0; j < i.length; j++)
        {
          i[j].classList.remove("card-secondary");
        }
      } else {
        this.enableCard = false;
      }
    });*/
  }

  vote(point: number) {
    this.comms.selectCard(this.sprint_id, this.user.Id, point).subscribe((response => {
        if (response.status === 200) {
          //console.log("Selection success");

          let old = document.getElementsByClassName("card-secondary")
          console.log("Selection success", old);
          //let old = document.getElementById(this.user.Vote.toString())
          if (old[0]) {
            old[0].classList.remove("card-secondary");
          }
          document.getElementById(point.toString()).classList.add("card-secondary");
          this.user.Vote = point;
          this.internal.updateUser(this.user);

        } else {
          console.log("Selection error");
        }
    }))
  }
}
