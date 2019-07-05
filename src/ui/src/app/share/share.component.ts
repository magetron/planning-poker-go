import { Component, OnInit, Input} from '@angular/core';

import { Sprint } from '../models/sprint';
import * as globals from '../services/globals.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})

export class ShareComponent implements OnInit {

  @Input() share : Sprint;
  baseUrl: string;

  constructor() { }

  ngOnInit() {
    this.baseUrl = globals.baseUrl;
  }

  copylink(link: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
