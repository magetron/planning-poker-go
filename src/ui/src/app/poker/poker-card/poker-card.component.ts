import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';
import { CommsService } from 'src/app/services/comms.service';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.css']
})

export class PokerCardComponent implements OnInit {

  points: number[] = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, -2]
  @Input() sprint_id: string;
  user: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internal: InternalService,
    private comms: CommsService,
  ) { }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.internal.user$.subscribe(
      res => this.user = res
    )
    //Kick undefined users to rejoin, for example when reloading page
    if (!this.user || !this.user.vote) {
      this.router.navigate(["join", this.sprint_id])
    }
  }

  vote(point: number){
    this.comms.selectCard(this.sprint_id, this.user.id, point)
     .subscribe((response => {  
        if (response.status === 200) {
          console.log("Selection success");
          
          document.getElementById(point.toString()).classList.add("selected");
          let old = document.getElementById(this.user.vote.toString())
          if (old) {
            old.classList.remove("selected");
          }
          this.user.vote = point;
          this.internal.updateUser(this.user);
          
        } else {
          console.log("Selection error");
        }
    }))
  }

  cardify (point: number) {
    if (point && point === -2 ) {
      return '?';
    }
    return point;
  }
}
