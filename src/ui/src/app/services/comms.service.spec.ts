import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CommsService } from './comms.service';

import { environment } from 'src/environments/environment'
import { Sprint } from '../models/sprint';
import { HttpResponse } from '@angular/common/http';

describe('CommsService', () => {

  let httpMock: HttpTestingController;
  let comms : CommsService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CommsService
    ],
    imports: [
      HttpClientTestingModule,
      ]
    })
    .compileComponents().then(() => {
      httpMock = TestBed.get(HttpTestingController);
      comms = TestBed.get(CommsService);
    })
  );

  afterEach(() => {
    httpMock.verify();
  });

  it('should create comms service', () => {
    expect(comms).toBeTruthy();
  });


  it('should create new sprint', () => {
      comms.createSprint("sprintId1").subscribe(data => {
        expect(data).toEqual({
          "d": "sprintId1",
          "s": 200
        });
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints');
      expect(req.request.method).toEqual('POST');

      req.flush({
        "d": "sprintId1",
        "s": 200
      });
    });

  it('should return sprint details', () => {
    comms.getSprintDetails("sprintId1").subscribe(data => {
        expect(data.body.d).toEqual({
          "Id": "sprintId1",
          "Name": "Sprint 1",
          "CreationTime": "2019-07-31T11:28:20.601309+01:00"
        })
        expect(data.body.s).toEqual(200)
        expect(data.status).toEqual(200)
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1');
      expect(req.request.method).toEqual('GET');

      //fake data to be returned by the mock
      req.flush({
        "d": {
            "Id": "sprintId1",
            "Name": "Sprint 1",
            "CreationTime": "2019-07-31T11:28:20.601309+01:00"
        },
        "s": 200
      });
    });

  it('should allow user to join sprint', () => {
      let sprint: Sprint = ({Name: "Sprint 1", Id: "sprintId1", CreationTime: "2019-07-31T11:28:20.601309+01:00"});
    
      comms.joinSprint("User 1", sprint).subscribe(data => {
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

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/users');
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
    });

  it('should return users details', () => {
    comms.getSprintUsers("sprintId1").subscribe(data => {
        expect(data).toEqual({
          "d": {
            "Users": {
              "userId1":{
                    "Id": "userId1",
                    "Name": "User 1",
                    "Vote": -1,
                    "Admin": true
                },
                "userId2":{
                    "Id": "userId2",
                    "Name": "User 2",
                    "Vote": -1,
                    "Admin": false
                }
              },
              "SprintId": "sprintId1",
              "VotesShown": false,
              "AdminId": "userId1"
            },
          "s": 200
        });
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/users');
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
  });

  it('should allow user to vote',() => {
    comms.selectCard("sprintId1","userId1",333).subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/users/userId1');
      expect(req.request.method).toEqual('PUT');

      req.flush("");
  });

  it('should allow admin to set next admin',() => {
      comms.appointSuccessor("sprintId1","userId1","userId2").subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/users/userId1/setadmin');
      expect(req.request.method).toEqual('POST');

      req.flush("");
    });

  it('should allow adding a story', () => {
      comms.addStory("sprintId1","Story 1").subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/rounds');
      expect(req.request.method).toEqual('POST');

      req.flush("");
  });

  it('should allow archive round', () => {
      comms.archiveRound("sprintId1",1 , -3, -3, -3 ).subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/rounds/1');
      expect(req.request.method).toEqual('PUT');

      req.flush("");
  });

  it('should allow delete user', () => {
      comms.deleteUser("sprintId1", "userId1" ).subscribe(data => {
        expect(data).toEqual("");
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/users/userId1');
      expect(req.request.method).toEqual('DELETE');

      req.flush("");
    });

 it('should get user details', () => {
    comms.getUserDetails("sprintId1", "userId1" ).subscribe(data => {
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

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/users/userId1');
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
  });
  
  it('should allow admin to set vote to be shown', () => {
      comms.showVote("sprintId1", "userId1", true ).subscribe(data => {
        expect(data.status).toEqual(200);
      });

      const req = httpMock.expectOne(environment.apiUrl + '/sprints/sprintId1/users/userId1/showvote');
      expect(req.request.method).toEqual('POST');

      req.flush("");
  });
});
