import { Component, OnInit, Input} from '@angular/core';
import { Sprint } from '../sprint';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  @Input() share : Sprint;

  constructor() { }

  ngOnInit() {
  }

}
