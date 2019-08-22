import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';

import { PokerControlComponent } from './poker-control.component';
import { PokerCardComponent } from '../poker-card/poker-card.component';
import { MemberslistComponent } from '../memberslist/memberslist.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NewSprintComponent } from 'src/app/new-sprint/new-sprint.component';
import { JoinComponent } from 'src/app/join/join.component';
import { ShareComponent } from 'src/app/poker/share/share.component';
import { InternalService } from 'src/app/services/internal.service';
import { CommsService } from 'src/app/services/comms.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WebSocketServiceSpy } from 'src/app/services/websocketspy';
import { ElapsedTimerComponent } from '../elapsed-timer/elapsed-timer.component';


describe('PokerControlComponent', () => {
  let component: PokerControlComponent;
  let fixture: ComponentFixture<PokerControlComponent>;
  let router: Router;

  beforeEach(async(() => {
    /*const internalSpy = jasmine.createSpyObj('InternalService', {
      'updateSprint': null,
      'rounds$': of(null),
      'stats$': of(null),
      'user$': of(null),
      'isVoteShown$': of(null),
      'updateRounds': function() {},
      })
    const commsSpy = jasmine.createSpyObj('CommsService', {
      'getSprintDetails': of({
        "d": {
          "Id": "5yojNtnjM",
          "Name": "DEMO Sprint",
          "CreationTime": "2019-07-31T11:57:20.338407+01:00"
        },
        "s": 200
      }), 
      'addStory': of({}), 
      'showVote': of({}), 
      'archiveRound': function() {}, 
      'selectCard': function() {} 
    })*/

    TestBed.configureTestingModule({
      providers: [
        { 
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: convertToParamMap({'sprint_id': 'test'})}}
        },/*
        {
          provide: InternalService,
          useValue: internalSpy
        },
        {
          provide: CommsService,
          useValue: commsSpy
        },*/
        {
          provide: WebsocketService,
          useClass: WebSocketServiceSpy
        }
      ],
      declarations: [
        PokerControlComponent,
        PokerCardComponent,
        MemberslistComponent,
        NewSprintComponent,
        JoinComponent,
        ShareComponent,
        ElapsedTimerComponent,
       ],
       imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientTestingModule,
        MatTableModule,
        MatCardModule,
        MatListModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
       ],
    })
    .compileComponents().then(
      router = TestBed.get(Router)
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerControlComponent);
    spyOn(router, "navigateByUrl")
    component = fixture.componentInstance
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
  });

  it('should display time', fakeAsync(() => {
    component.timePassed = 0
    component.startTimer();
    tick(4000);
    expect(component.timer.getTimeValues().toString().slice(3)).toBe('00:04');
    component.timer.stop();
    expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
  }));

});
