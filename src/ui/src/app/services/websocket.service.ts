import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
//import { switchMap,retryWhen,delay } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import * as globals from './globals.service';
import { InternalService } from './internal.service';

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

  connect(sprint_id: string): Observable<any> {
    this.infoSocket$ = webSocket({
      url: globals.infoSocket + sprint_id,
      serializer: msg => msg,
      deserializer: ({ data }) => {
        console.log("data", data);
        let j = JSON.parse(data);
        this.internal.updateUsers(j.Users);
        if (j.Rounds){
          this.internal.updateRounds(j.Rounds);
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
