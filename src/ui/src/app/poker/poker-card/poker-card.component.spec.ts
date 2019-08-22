import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { AppRoutingModule } from '../../app-routing.module';
import { PokerCardComponent} from './poker-card.component';
import { NewSprintComponent } from '../../new-sprint/new-sprint.component';
import { JoinComponent } from '../../join/join.component';
import { PokerControlComponent } from '../poker-control/poker-control.component';
import { MemberslistComponent } from '../memberslist/memberslist.component';
import { ShareComponent } from 'src/app/poker/share/share.component';
import { ElapsedTimerComponent } from '../elapsed-timer/elapsed-timer.component';
import { InternalService } from 'src/app/services/internal.service';
import { CommsService } from 'src/app/services/comms.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WebSocketServiceSpy } from 'src/app/services/websocketspy';
import { Round } from 'src/app/models/round';

describe('PokerCardComponent', () => {
  let component: PokerCardComponent;
  let fixture: ComponentFixture<PokerCardComponent>;
  let internal: InternalService;
  let comms: CommsService;
  let socket: WebsocketService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: convertToParamMap({'sprint_id': 'test_id'})}}
        },
        {
          provide: WebsocketService,
          useClass: WebSocketServiceSpy
        },
        InternalService,
      ],
      declarations: [ 
        PokerCardComponent,
        PokerControlComponent,
        NewSprintComponent,
        MemberslistComponent,
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
      ]
    })
    .compileComponents().then(() => {
      internal = TestBed.get(InternalService)
      comms = TestBed.get(CommsService)
      socket = TestBed.get(WebsocketService)
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should vote on button press', () => {
    spyOn(comms, "selectCard").and.returnValue(of({status: 200}))
    spyOn(socket, "send")

    let user = {
      "Id": "userId3",
      "Name": "User 3",
      "Vote": -1,
      "Admin": false
    }
    internal.updateUser(user)

    //using id='myId' instead of #myId because of https://stackoverflow.com/q/20306204
    let show_btn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("button[id='-2']")
    show_btn.click()
    fixture.detectChanges()
    expect(comms.selectCard).toHaveBeenCalledWith('test_id', 'userId3', -2)
    expect(socket.send).toHaveBeenCalledWith("update");
    expect(show_btn.classList).toContain("card-secondary")
  })

  it('should clear votes on round switch', () => {
    let user = {
      "Id": "userId3",
      "Name": "User 3",
      "Vote": 7,
      "Admin": false
    }
    internal.updateUser(user)

    let rounds: Array<Round> = [{
      "Id": 1,
      "Name": "Task 1",
      "Med": 0,
      "Avg": 0,
      "Final": 0,
      "Archived": false,
      "CreationTime": 1564664527
    }]
    internal.updateRounds(rounds)
    component.myVote = 7    
    fixture.detectChanges()
    expect(component.myVote).toBe(7)
    expect(component.user.Vote).toBe(7)

    rounds[0].Archived = true
    internal.updateRounds(rounds)
    fixture.detectChanges()

    expect(component.myVote).toBe(-1, "selected vote is cleared")
    expect(component.user.Vote).toBe(7, "Poker card doesn't update the vote in the user object. Memeberslist does")
  })
});
