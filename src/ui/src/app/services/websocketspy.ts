import { Observable, Subject } from 'rxjs';

const mockData = {
  // some arbitrary data
};

export class WebSocketServiceSpy {

  private messageSpy = new Subject<string>();
  private messageHandler = this.messageSpy.asObservable();

  createObservableSocket(url: string): Observable<string> {
    console.log(`Websocket would connect to ${url}.`);

   return new Observable(observer => {
      this.messageHandler.subscribe(() => {
        observer.next(JSON.stringify(mockData));
      });
    });
  }

  sendMessage(message: any) {
    this.messageSpy.next();
  }

  connect(sprint_id: string): Observable<any> {
  }


}