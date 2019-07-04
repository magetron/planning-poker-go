import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.css']
})

export class PokerCardComponent implements OnInit {

  points: number[] = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, -2]
  @Input() sprint_id: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    console.log("Poker-card reporting for sprint "+this.sprint_id);
  }

  cardify(point: number) {
    if (point && point === -2 ) {
      return '?';
    }
    return point;
  }

  vote(point: number){
    
  }

}
