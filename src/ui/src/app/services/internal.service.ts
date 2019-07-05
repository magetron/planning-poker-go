import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User} from '../models/user';
import { Sprint } from '../models/sprint';

@Injectable({
  providedIn: 'root'
})

export class InternalService {

  private user = new BehaviorSubject<User>({name: "", id: "", vote: -1});
  private sprint = new BehaviorSubject<Sprint>({name: "", id: ""});

  user$ = this.user.asObservable();
  sprint$ = this.sprint.asObservable();

  constructor() { }

  updateUser(user: User) {
    this.user.next(user);
  }

  updateSprint(sprint: Sprint) {
    this.sprint.next(sprint);
  }
}
