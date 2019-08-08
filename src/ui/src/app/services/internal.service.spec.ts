import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { InternalService } from './internal.service';
import { User } from '../models/user';
import { Sprint } from '../models/sprint';
import { Round } from '../models/round';

describe('InternalService', () => {

  let internalService : InternalService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      InternalService
    ]})
    .compileComponents().then(() => {
      internalService = TestBed.get(InternalService);
    })
  );

  afterEach(() => {
    localStorage.removeItem("user")
  })

  it('should be created', () => {
    expect(internalService).toBeTruthy();
  });

  it('should update user', (done:DoneFn) => {

    let userIn: User = {
      Name : "user",
      Id : "userId",
      Vote : -1,
      Admin : true
    };

    let userOut = new BehaviorSubject<User> ({
      Name : "user",
      Id : "userId",
      Vote : -1,
      Admin : true
    });

    const userPromise = new Promise ((resolve) => {
      internalService.updateUser(userIn);
      resolve();
    });

    userPromise.then(() => {
      expect(internalService.user$).toEqual(userOut.asObservable());
      done();
    });
  });
  
  it('should update sprint', (done:DoneFn) => {

    let sprintIn: Sprint = {
      Name : "sprint",
      Id : "sprintId"
    };
  
    let sprintOut = new BehaviorSubject<Sprint> ({
      Name : "sprint",
      Id : "sprintId"
    });
  
    const sprintPromise = new Promise ((resolve) => {
      internalService.updateSprint(sprintIn);
      resolve();
    });

    sprintPromise.then(() => {
      expect(internalService.sprint$).toEqual(sprintOut.asObservable());
      done();
    });
  });

  it('should update statistics', (done:DoneFn) => {

    let statsIn = [0,0,0,0]
  
    let statsOut = new BehaviorSubject<number[]>([0,0,0,0])
  
    const statsPromise = new Promise ((resolve) => {
      internalService.updateStats(statsIn);
      resolve();
    });

    statsPromise.then(() => {
      expect(internalService.stats$).toEqual(statsOut.asObservable());
      done();
    });
  });

  it('should update showVote variable', (done:DoneFn) => {

    let isVoteShownIn = false;
  
    let isVoteShownOut = new BehaviorSubject<boolean>(false);
  
    const showVotePromise = new Promise ((resolve) => {
      internalService.showVote(isVoteShownIn);
      resolve();
    });

    showVotePromise.then(() => {
      expect(internalService.isVoteShown$).toEqual(isVoteShownOut.asObservable());
      done();
    });
  });

  it('should update user with info from local storage', (done:DoneFn) => {

    let userIn: User = {
      Name : "user",
      Id : "userId",
      Vote : -1,
      Admin : true
    };

    let userOut = new BehaviorSubject<User> ({
      Name : "user",
      Id : "userId",
      Vote : -1,
      Admin : true
    });

    const userPromise = new Promise ((resolve) => {
      internalService.logInUser(userIn);
      resolve();
    });

    userPromise.then(() => {
      expect(internalService.user$).toEqual(userOut.asObservable());
      done();
    });
  });



  it('should not reload when new user is joining the sprint', () => {
    expect(internalService.reloadOrKickUser()).toBe(false);
  });

  it('should reload/kick user when user exist in local storage', (done: DoneFn) => {
    let userIn: User = {
      Name : "user",
      Id : "userId",
      Vote : -1,
      Admin : true
    };

    let userOut = new BehaviorSubject<User> ({
      Name : "user",
      Id : "userId",
      Vote : -1,
      Admin : true
    });

    const userPromise = new Promise ((resolve) => {
      internalService.logInUser(userIn);
      resolve();
    });

    userPromise.then(() => {
      expect(internalService.user$).toEqual(userOut.asObservable());
      expect(internalService.reloadOrKickUser()).toBe(true);
      done();
    });
  });

  it('should log all users out', (done: DoneFn) => {
    let logoutAllIn = true;

    let logoutAllOut = new BehaviorSubject<boolean> (true);

    const logoutAllPromise = new Promise ((resolve) => {
      internalService.logoutAllUsers(logoutAllIn);
      resolve();
    });

    logoutAllPromise.then(() => {
      expect(internalService.logoutAll$).toEqual(logoutAllOut.asObservable());
      done();
    });
  });

  it('should update users list', (done:DoneFn) => {

    let usersIn: User[] = [{
      Name : "user1",
      Id : "user1Id",
      Vote : -1,
      Admin : true
    },{
      Name : "user2",
      Id : "user2Id",
      Vote : -1,
      Admin : false
    }];

    let usersOut = new BehaviorSubject<User[]> ([{
      Name : "user1",
      Id : "user1Id",
      Vote : -1,
      Admin : true
    },{
      Name : "user2",
      Id : "user2Id",
      Vote : -1,
      Admin : false
    }]);

    const userPromise = new Promise ((resolve) => {
      internalService.updateUsers(usersIn);
      resolve();
    });

    userPromise.then(() => {
      expect(internalService.users$).toEqual(usersOut.asObservable());
      done();
    });
  });


  it('should update rounds list', (done:DoneFn) => {

    let roundsIn: Round[] = [{
      Name: "",
      Id: 1,
      Avg: 0,
      Med: 0,
      Final: 0,
      Archived: true,
      CreationTime: 0
    },{
      Name: "",
      Id: 2,
      Avg: 0,
      Med: 0,
      Final: 0,
      Archived: false,
      CreationTime: 1
    }];

    let roundsOut = new BehaviorSubject<Round[]> ([{
      Name: "",
      Id: 1,
      Avg: 0,
      Med: 0,
      Final: 0,
      Archived: true,
      CreationTime: 0
    },{
      Name: "",
      Id: 2,
      Avg: 0,
      Med: 0,
      Final: 0,
      Archived: false,
      CreationTime: 1
    }]);

    const roundPromise = new Promise ((resolve) => {
      internalService.updateRounds(roundsIn);
      resolve();
    });

    roundPromise.then(() => {
      expect(internalService.rounds$).toEqual(roundsOut.asObservable());
      done();
    });
  });



});
