import { Observable, Subject, of } from 'rxjs';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';

export class WebSocketServiceSpy {

  private messageSpy = new Subject<string>();
  private messageHandler = this.messageSpy.asObservable();

  connect(sprint_id: string, user_id: string): Observable<any> {
    let data = [{"Users":{"userId1":{"Id":"userId1","Name":"User 1","Vote":-1,"Admin":true}},"SprintId":"sprintId1","VotesShown":false,"AdminId":"userId1"}];
    let j = JSON.parse(JSON.stringify(data));
    return of(j);
  }

  send(data: any){
    if (data === "update"){
      this.messageSpy.next();
    } else {
      console.log('Did not send data, open a connection first');
    }
  }

}