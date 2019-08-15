import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MemberslistComponent } from './memberslist.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NewSprintComponent } from 'src/app/new-sprint/new-sprint.component';
import { JoinComponent } from 'src/app/join/join.component';
import { PokerCardComponent } from '../poker-card/poker-card.component';
import { PokerControlComponent } from '../poker-control/poker-control.component';
import { ShareComponent } from 'src/app/share/share.component';
import { ElapsedTimerComponent } from '../elapsed-timer/elapsed-timer.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WebSocketServiceSpy } from 'src/app/services/websocketspy';
import { CommsService } from 'src/app/services/comms.service';
import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';

fdescribe('MemberslistComponent', () => {
  let component: MemberslistComponent;
  let fixture: ComponentFixture<MemberslistComponent>;
  let internal: InternalService
  let socket: WebSocketServiceSpy

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: WebsocketService,
          useClass: WebSocketServiceSpy
        },
        CommsService,
        InternalService,
      ],
      declarations: [
        MemberslistComponent,
        NewSprintComponent,
        JoinComponent,
        PokerControlComponent,
        PokerCardComponent,
        ShareComponent,
        ElapsedTimerComponent,
       ],
       imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientTestingModule,
        MatTableModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
       ]
    })
    .compileComponents().then(
      internal = TestBed.get(InternalService),
      socket = TestBed.get(WebsocketService)
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(()=> {

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate null statistics when votes are invisible', () => {
    let votes = [{"Id":"6cdc22b1-db9b-4094-bb1f-e9485c023ea8","Name":"me","Vote":-3,"Admin":true},{"Id":"41c52577-3dff-4927-a67b-6e1bec5863fb","Name":"#$%^&(>","Vote":-2,"Admin":false},{"Id":"112b9d33-9e48-4dcf-9960-23ac36498afb","Name":"!@#$%^&*(","Vote":-1,"Admin":false}]
    expect(component.analysisVote(votes)).toEqual([0, 0, 0, 0])
  })

  it('should calculate correct statistics when one user voted', () => {
    let votes = [{"Id": "6cdc22b1-db9b-4094-bb1f-e9485c023ea8","Name": "me","Vote": -3,"Admin": true},{"Id": "41c52577-3dff-4927-a67b-6e1bec5863fb","Name": "#$%^&(>","Vote": 5,"Admin": false}]
    expect(component.analysisVote(votes)).toEqual([5, 5, 5, 5])
  })

  it('should calculate correct statistics when three users voted', () => {
    let votes = [{"Id":"6cdc22b1-db9b-4094-bb1f-e9485c023ea8","Name":"me","Vote":3,"Admin":true},{"Id":"41c52577-3dff-4927-a67b-6e1bec5863fb","Name":"#$%^&(>","Vote":5,"Admin":false},{"Id":"112b9d33-9e48-4dcf-9960-23ac36498afb","Name":"!@#$%^&*(","Vote":0.5,"Admin":false}]
    expect(component.analysisVote(votes)).toEqual([5, 3, (3+5+0.5)/3, 3])
  })

  it('should calculate correct mean for an even number of users voting', () => {
    let votes = [{"Id":"6cdc22b1-db9b-4094-bb1f-e9485c023ea8","Name":"me","Vote":3,"Admin":true},{"Id":"41c52577-3dff-4927-a67b-6e1bec5863fb","Name":"#$%^&(>","Vote":5,"Admin":false},{"Id":"112b9d33-9e48-4dcf-9960-23ac36498afb","Name":"!@#$%^&*(","Vote":0.5,"Admin":false},{"Id":"7df868eb-da95-4ad7-9f64-e2ce0d5719d2","Name":"happy tester","Vote":0.5,"Admin":false}]
    expect(component.analysisVote(votes)).toEqual([0.5, (0.5+3)/2, (3+5+0.5+0.5)/4, 2])
  })

  it('should show showVote button to admins only', () => {
    
    //Beginning - no user, no button
    let show_btn: Element = fixture.debugElement.nativeElement.querySelector("button#btn1")
    expect(show_btn).toBeNull()
    
    let userAdmin: User = {
      Name : "user",
      Id : "userId",
      Vote : -1,
      Admin : true
    };
    internal.updateUser(userAdmin)
    fixture.whenStable()
    fixture.detectChanges()

    //User admin - show button
    show_btn = fixture.debugElement.nativeElement.querySelector("button#btn1")
    expect(show_btn).toBeDefined()
    expect(show_btn.innerHTML).toBe("Show Vote")

    userAdmin.Admin=false
    internal.updateUser(userAdmin)
    fixture.whenStable()
    fixture.detectChanges()
    
    //User not admin - hide button
    show_btn = fixture.debugElement.nativeElement.querySelector("button#btn1")
    expect(show_btn).toBeNull()
  })
});
