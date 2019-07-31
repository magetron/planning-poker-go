import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CommsService } from './comms.service';

import * as globals from '../services/globals.service';

describe('CommsService', () => {

  let httpTestingController: HttpTestingController;
  let commsService : CommsService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CommsService
    ],
    imports: [
      HttpClientTestingModule,
      ]
    })
    .compileComponents().then(() => {
      httpTestingController = TestBed.get(HttpTestingController);
      commsService = TestBed.get(CommsService);
    })
  );

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    //const commsService: CommsService = TestBed.get(CommsService);
    expect(commsService).toBeTruthy();
  });

  it('should return sprint details',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
    
      //call the service
      service.getSprintDetails("testSprint").subscribe(sprint => {
        console.log(sprint);
        expect(sprint).toEqual({
          "d": {
              "Id": "testSprint",
              "Name": "Sprint 1",
              "CreationTime": "2019-07-31T11:28:20.601309+01:00"
          },
          "s": 200
        });
      });

      //set the expectations for the HttpClient mock
      const req = httpMock.expectOne(globals.apiUrl + '/sprints/testSprint');
      expect(req.request.method).toEqual('GET');

      //fake data to be returned by the mock
      req.flush({
        "d": {
            "Id": "testSprint",
            "Name": "Sprint 1",
            "CreationTime": "2019-07-31T11:28:20.601309+01:00"
        },
        "s": 200
      });
    })
  );

});
