import { TestBed } from '@angular/core/testing';

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
    service.connect("sprintId", "userId1").subscribe(data => {
      expect(data[0].Users).toEqual({"userId1":{"Id":"userId1","Name":"User 1","Vote":-1,"Admin":true }})
      expect(data[0].VotesShown).toEqual(false, "VotesShown status")
      expect(data[0].SprintId).toEqual("sprintId1")
      expect(data[0].AdminId).toEqual("userId1")
    })
  });

  it('should send', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service.send("update")).toBeFalsy();
  });
});
