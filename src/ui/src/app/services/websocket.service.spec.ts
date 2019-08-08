import { TestBed, async } from '@angular/core/testing';

import { webSocket,WebSocketSubject } from "rxjs/webSocket";
import { WebSocketServiceSpy } from './websocketspy'
import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
        providers: [ 
          {provide: WebsocketService, useClass: WebSocketServiceSpy }  
      ]
    })
    .compileComponents();
  });

  it('should create', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service).toBeTruthy();
  });

  it('should connect', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    service.connect("sprintId").subscribe(data => {
      expect(data).toEqual([ [ Object({"Id":"sprintId","Name":"sprintName","Vote":-1,"Admin":true}) ] ])
    })
  });

  it('should send', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service.send("update")).toBeFalsy();
  });
});
