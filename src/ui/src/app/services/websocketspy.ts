import { Observable, Subject, of } from 'rxjs';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';

export class WebSocketServiceSpy {

  private messageSpy = new Subject<string>();
  private messageHandler = this.messageSpy.asObservable();

  connect(sprint_id: string): Observable<any> {
    let data = [[{"Id":"sprintId","Name":"sprintName","Vote":-1,"Admin":true}]];
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