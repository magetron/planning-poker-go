import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User} from '../models/user';
import { Sprint } from '../models/sprint';
import { Round } from '../models/round';

@Injectable({
  providedIn: 'root'
})

export class InternalService {

  private user = new BehaviorSubject<User>(null);
  private sprint = new BehaviorSubject<Sprint>({Name: "", Id: ""});
  private stats = new BehaviorSubject<number[]>([0,0,0]);
  private round = new BehaviorSubject<Round>({Name: "default", Id : 0, Avg : 0, Med: 0, Final: 0, Archived : false, CreationTime : 0,});
  private isVoteShown = new BehaviorSubject<boolean>(false);
  private logoutAll = new BehaviorSubject<boolean>(false);
  private users = new BehaviorSubject<User[]>(null);
  private rounds = new BehaviorSubject<Round[]>([{Name: "default",Id : 0,Avg : 0,Med: 0,Final: 0,Archived : false,CreationTime : 0,}]);

  user$ = this.user.asObservable();
  sprint$ = this.sprint.asObservable();
  stats$ = this.stats.asObservable();
  round$ = this.round.asObservable();
  isVoteShown$ = this.isVoteShown.asObservable();
  logoutAll$ = this.logoutAll.asObservable();
  users$ = this.users.asObservable();
  rounds$ = this.rounds.asObservable();

  constructor() { }

  updateUser(user: User) {
    this.user.next(user);
  }

  updateSprint(sprint: Sprint) {
    this.sprint.next(sprint);
  }

  updateStats(stats: number[]) {
    this.stats.next(stats);
  }

  updateRound(round: Round) {
    this.round.next(round);
  }

  showVote(isVoteShown: boolean) {
    this.isVoteShown.next(isVoteShown);
  }

  logInUser(user: User) {
    this.updateUser(user);
    localStorage.setItem("user", JSON.stringify(user))
  }

  reloadOrKickUser(): boolean {
    let user = localStorage.getItem("user");
    if (user != null) {
      this.updateUser(JSON.parse(user) as User)
      return true;
    } else {
      return false
    }
  }
  logoutAllUsers(logoutAll: boolean) {
    this.logoutAll.next(logoutAll);
  }

  updateUsers(users: User[]){
    this.users.next(users);
  }

  updateRounds(rounds: Round[]){
    this.rounds.next(rounds);
  }

}
