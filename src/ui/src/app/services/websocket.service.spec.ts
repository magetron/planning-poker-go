import { TestBed } from '@angular/core/testing';

import { webSocket,WebSocketSubject } from "rxjs/webSocket";
import { WebSocketServiceSpy } from './websocketspy'
import { WebsocketService } from './websocket.service';

fdescribe('WebsocketService', () => {

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
    let sth : WebSocketSubject<any>;
    service.connect("sprintId").subscribe(data => {
      expect(data).toEqual(sth)
    })
  });

  // it('should create new sprint',
  //   inject([HttpTestingController, CommsService], 
  //     (httpMock: HttpTestingController, service: CommsService) => {
  
  // );

});



// describe('WebsocketService', () => {
//   beforeEach(() => TestBed.configureTestingModule({}));

//   it('should be created', () => {
//     const service: WebsocketService = TestBed.get(WebsocketService);
//     expect(service).toBeTruthy();
//   });
// });

  // it('should create random component', (done) => {
  //   setTimeout(() => {
  //     expect(component).toBeTruthy();
  //     done();
  //   }, 1000);
  // });
