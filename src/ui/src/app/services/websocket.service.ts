import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
//import { switchMap,retryWhen,delay } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from 'src/environments/environment';
import { InternalService } from './internal.service';
import { User } from 'src/app/models/user';
import { Round } from 'src/app/models/round';

export interface UserResponse {
  Users : {[key: string]: User},
  Rounds : {[key: number]: Round},
  SprintId : string,
  VotesShown : boolean,
  AdminId : string
}

@Injectable({
  providedIn: 'root'
})


export class WebsocketService {

  infoSocket$: WebSocketSubject<any>;
  RETRY_SECONDS = 10; 
  count = 0;

  constructor(
    private internal: InternalService,
  ) { }

  connect(sprint_id: string, user_id: string): Observable<any> {
    this.infoSocket$ = webSocket({
      url: environment.infoSocket + sprint_id + "/users/" + user_id,
      serializer: msg => msg,
      deserializer: ({ data }) => {
        let j = JSON.parse(data);
        let res = <UserResponse> j[0]
        this.internal.updateUsers(res.Users);
        this.internal.showVote(res.VotesShown);
        this.internal.updateAdmin(res.AdminId);
        if (j.length == 2 && j[1].Rounds){
          this.internal.updateRounds(j[1].Rounds);
        }
        return j;
      },
      binaryType: "blob",
    });
    return this.infoSocket$;
  }

  send(data: any) {
    if (this.infoSocket$) {
      this.infoSocket$.next(data);
    } else {
      console.error('Did not send data, open a connection first');
    }
  }

  closeConnection() {
    if (this.infoSocket$) {
      this.infoSocket$.complete();
      this.infoSocket$ = null;
    }
  }
  ngOnDestroy() {
    this.closeConnection();
  }
}
