import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.css']
})
export class PokerCardComponent implements OnInit {

  points: number[] = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, -2]

  constructor() { }

  ngOnInit() {
  }

  cardify(point) {
    if (point && point === -2 ) {
      return '?';
    }
    return point;
  }

  vote(point){
    
  }

}
