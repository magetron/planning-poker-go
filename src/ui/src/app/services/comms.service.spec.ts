import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CommsService } from './comms.service';

import * as globals from '../services/globals.service';
import { Sprint } from '../models/sprint';
import { HttpResponse } from '@angular/common/http';

fdescribe('CommsService', () => {

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

  it('should create comms service', () => {
    expect(commsService).toBeTruthy();
  });


  it('should create new sprint',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
    
      service.createSprint("sprintId1").subscribe(data => {
        expect(data).toEqual({
          "d": "sprintId1",
          "s": 200
        });
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints');
      expect(req.request.method).toEqual('POST');

      req.flush({
        "d": "sprintId1",
        "s": 200
      });
    })
  );

  it('should return sprint details',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
    
      service.getSprintDetails("sprintId1").subscribe(data => {
        expect(data).toEqual({
          "d": {
              "Id": "sprintId1",
              "Name": "Sprint 1",
              "CreationTime": "2019-07-31T11:28:20.601309+01:00"
          },
          "s": 200
        });
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1');
      expect(req.request.method).toEqual('GET');

      req.flush({
        "d": {
            "Id": "sprintId1",
            "Name": "Sprint 1",
            "CreationTime": "2019-07-31T11:28:20.601309+01:00"
        },
        "s": 200
      });
    })
  );

  it('should allow user to join sprint',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {

      let sprint: Sprint = ({Name: "Sprint 1", Id: "sprintId1"});
    
      service.joinSprint("User 1", sprint).subscribe(data => {
        expect(data).toEqual({
          "d": {
              "Id": "userId1",
              "Name": "User 1",
              "Vote": -1,
              "Admin": false
          },
          "s": 200
        });
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/users');
      expect(req.request.method).toEqual('POST');

      req.flush({
        "d": {
            "Id": "userId1",
            "Name": "User 1",
            "Vote": -1,
            "Admin": false
        },
        "s": 200
      });
    })
  );

  it('should return users details',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
    
      service.getSprintUsers("sprintId1").subscribe(data => {
        expect(data).toEqual({
          "d": [
              {
                  "Id": "userId1",
                  "Name": "User 1",
                  "Vote": -1,
                  "Admin": true
              },
              {
                  "Id": "userId2",
                  "Name": "User 2",
                  "Vote": -1,
                  "Admin": false
              }
          ],
          "s": 200
        });
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/users');
      expect(req.request.method).toEqual('GET');

      req.flush({
        "d": [
            {
                "Id": "userId1",
                "Name": "User 1",
                "Vote": -1,
                "Admin": true
            },
            {
                "Id": "userId2",
                "Name": "User 2",
                "Vote": -1,
                "Admin": false
            }
        ],
        "s": 200
      });
    })
  );

  it('should allow user to vote',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
      service.selectCard("sprintId1","userId1",333).subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/users/userId1');
      expect(req.request.method).toEqual('PUT');

      req.flush("");
    })
  );

  it('should allow admin to set next admin',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
      service.appointSuccessor("sprintId1","userId1","userId2").subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/users/userId1/setadmin');
      expect(req.request.method).toEqual('POST');

      req.flush("");
    })
  );

  it('should allow add story',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
      service.addStory("sprintId1","Story 1").subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/rounds');
      expect(req.request.method).toEqual('POST');

      req.flush("");
    })
  );

  it('should allow archive round',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
      service.archiveRound("sprintId1",1 , -3, -3, -3 ).subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/rounds/1');
      expect(req.request.method).toEqual('PUT');

      req.flush("");
    })
  );

  it('should allow delete user',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
      service.deleteUser("sprintId1", "userId1" ).subscribe(data => {
        expect(data).toEqual("");
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/users/userId1');
      expect(req.request.method).toEqual('DELETE');

      req.flush("");
    })
  );

 it('should get user details',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
      service.getUserDetails("sprintId1", "userId1" ).subscribe(data => {
        expect(data).toEqual({
          "d": {
              "Id": "af4ce453-6c84-483e-a55a-7f55669c0839",
              "Name": "User 1",
              "Vote": -1,
              "Admin": false
          },
          "s": 200
        });
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/users/userId1');
      expect(req.request.method).toEqual('GET');

      req.flush({
        "d": {
            "Id": "af4ce453-6c84-483e-a55a-7f55669c0839",
            "Name": "User 1",
            "Vote": -1,
            "Admin": false
        },
        "s": 200
      });
    })
  );
  
  it('should allow admin to set vote to be shown',
    inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {
      service.showVote("sprintId1", "userId1", true ).subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(globals.apiUrl + '/sprints/sprintId1/users/userId1/showvote');
      expect(req.request.method).toEqual('POST');

      req.flush("");
    })
  );
  

});
