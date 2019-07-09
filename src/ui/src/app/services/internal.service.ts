import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User} from '../models/user';
import { Sprint } from '../models/sprint';

@Injectable({
  providedIn: 'root'
})

export class InternalService {

  private user = new BehaviorSubject<User>({name: "", id: "", Vote: -1});
  private sprint = new BehaviorSubject<Sprint>({name: "", id: ""});
  private stats = new BehaviorSubject<number[]>([0,0,0]);

  user$ = this.user.asObservable();
  sprint$ = this.sprint.asObservable();
  stats$ = this.stats.asObservable();

  constructor() { }

  updateUser(user: User) {
    this.user.next(user);
  }

  updateSprint(sprint: Sprint) {
    this.sprint.next(sprint);
  }

  updateStats(stats: number[]) {
    this.stats.next(stats);
    //console.log("this.stats = ", this.stats._value[0]);
  }

}
