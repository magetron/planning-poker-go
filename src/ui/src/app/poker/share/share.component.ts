import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute} from '@angular/router';


import { Sprint } from '../../models/sprint';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})

export class ShareComponent implements OnInit {

  @Input() sprint_id : string;
  baseUrl: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sprint_id = this.route.snapshot.paramMap.get('sprint_id');
    this.baseUrl = environment.baseUrl;
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
