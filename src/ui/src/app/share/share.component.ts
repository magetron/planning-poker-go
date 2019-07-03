import { Component, OnInit, Input} from '@angular/core';

import { Sprint } from '../../models/sprint';
import { baseUrl } from '../services/globals.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})

export class ShareComponent implements OnInit {

  @Input() share : Sprint;
  baseUrl: string = '';

  constructor() { }

  ngOnInit() {
    this.baseUrl = location.origin;
  }

}
