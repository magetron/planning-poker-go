import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

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

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const internalSpy = jasmine.createSpyObj('InternalService', ['updateSprint', 'rounds$', 'stats$', 'user$', 'isVoteShown$', 'updateRounds'])
    const commsSpy = jasmine.createSpyObj('CommsService', ['getSprintDetails', 'addStory', 'showVote', 'archiveRound', 'selectCard'])
  
    //getSprintDetailsSpy = commsSpy.getSprintDetails.and.returnValue(of())


    TestBed.configureTestingModule({
      providers: [
        /*{ 
          provide: Router,
          useValue: routerSpy
        },*/
        { 
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: convertToParamMap({'sprint_id': 'test'})}}
        },
        /*{
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
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerControlComponent);
    component = fixture.componentInstance
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display time', fakeAsync(() => {
    component.timePassed = 0
    component.startTimer();
    tick(4000);
    expect(component.timer.getTimeValues().toString().slice(3)).toBe('00:04');
    component.timer.stop();
  }));

});
