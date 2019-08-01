import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
//import { switchMap,retryWhen,delay } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from 'src/environments/environment';
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
      url: environment.infoSocket + sprint_id,
      serializer: msg => msg,
      deserializer: ({ data }) => {
        let j = JSON.parse(data);
        this.internal.updateUsers(j[0]);
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
