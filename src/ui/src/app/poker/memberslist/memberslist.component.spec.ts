import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MemberslistComponent } from './memberslist.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NewSprintComponent } from 'src/app/new-sprint/new-sprint.component';
import { JoinComponent } from 'src/app/join/join.component';
import { PokerCardComponent } from '../poker-card/poker-card.component';
import { PokerControlComponent } from '../poker-control/poker-control.component';
import { ShareComponent } from 'src/app/poker/share/share.component';
import { ElapsedTimerComponent } from '../elapsed-timer/elapsed-timer.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WebSocketServiceSpy } from 'src/app/services/websocketspy';
import { CommsService } from 'src/app/services/comms.service';
import { InternalService } from 'src/app/services/internal.service';
import { User } from 'src/app/models/user';

describe('MemberslistComponent', () => {
  let component: MemberslistComponent;
  let fixture: ComponentFixture<MemberslistComponent>;
  let internal: InternalService
  let socket: WebSocketServiceSpy
  let comms: CommsService

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
    .compileComponents().then( () => {
      internal = TestBed.get(InternalService),
      socket = TestBed.get(WebsocketService),
      comms = TestBed.get(CommsService)
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberslistComponent);
    component = fixture.componentInstance;
    component.sprint_id = "sprint_id1"
    fixture.detectChanges();
  });

  afterEach(() => {
    internal.updateUser(null)
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate null statistics when votes are invisible', () => {
    let votes = {"3a80c841-a17d-41e6-bad9-c391d5842b22":{"Id":"3a80c841-a17d-41e6-bad9-c391d5842b22","Name":"User 1","Vote":-3,"Admin":true},"5c741402-5089-4e43-a2e9-372fbc1a682c":{"Id":"5c741402-5089-4e43-a2e9-372fbc1a682c","Name":"User 2","Vote":-2,"Admin":false}}
    expect(component.analysisVote(votes)).toEqual([0, 0, 0, 0])
  })

  it('should calculate correct statistics when one user voted', () => {
    let votes = {"3a80c841-a17d-41e6-bad9-c391d5842b22":{"Id":"3a80c841-a17d-41e6-bad9-c391d5842b22","Name":"User 1","Vote":-3,"Admin":true},"5c741402-5089-4e43-a2e9-372fbc1a682c":{"Id":"5c741402-5089-4e43-a2e9-372fbc1a682c","Name":"User 2","Vote":5,"Admin":false}}
    expect(component.analysisVote(votes)).toEqual([5, 5, 5, 5])
  })

  it('should calculate correct statistics when three users voted', () => {
    let votes = {"3a80c841-a17d-41e6-bad9-c391d5842b22":{"Id":"3a80c841-a17d-41e6-bad9-c391d5842b22","Name":"User 1","Vote":3,"Admin":true},"5c741402-5089-4e43-a2e9-372fbc1a682c":{"Id":"5c741402-5089-4e43-a2e9-372fbc1a682c","Name":"User 2","Vote":5,"Admin":false},"112b9d33-9e48-4dcf-9960-23ac36498afb":{"Id":"112b9d33-9e48-4dcf-9960-23ac36498afb","Name":"!@#$%^&*(","Vote":0.5,"Admin":false}}    
    expect(component.analysisVote(votes)).toEqual([5, 3, (3+5+0.5)/3, 3])
  })

  it('should calculate correct mean for an even number of users voting', () => {
    let votes = {"3a80c841-a17d-41e6-bad9-c391d5842b22":{"Id":"3a80c841-a17d-41e6-bad9-c391d5842b22","Name":"User 1","Vote":3,"Admin":true},"5c741402-5089-4e43-a2e9-372fbc1a682c":{"Id":"5c741402-5089-4e43-a2e9-372fbc1a682c","Name":"User 2","Vote":5,"Admin":false},"112b9d33-9e48-4dcf-9960-23ac36498afb":{"Id":"112b9d33-9e48-4dcf-9960-23ac36498afb","Name":"!@#$%^&*(","Vote":0.5,"Admin":false},"7df868eb-da95-4ad7-9f64-e2ce0d5719d2":{"Id":"7df868eb-da95-4ad7-9f64-e2ce0d5719d2","Name":"happy tester","Vote":0.5,"Admin":false}}    
    expect(component.analysisVote(votes)).toEqual([0.5, (0.5+3)/2, (3+5+0.5+0.5)/4, 2])
  })

  describe('with users', () => {
    beforeEach(()=> {
      spyOn(comms, "appointSuccessor")
      spyOn(comms, "showVote")

      let user: User = {
        "Id": "userId1",
        "Name": "User 1",
        "Vote": -3,
        "Admin": true
      }
      let users = {
        "userId1": {
            "Id": "userId1",
            "Name": "User 1",
            "Vote": -3,
            "Admin": true
        },
        "userId2": {
            "Id": "userId2",
            "Name": "User 2",
            "Vote": -1,
            "Admin": false
        }}
      let adminId = "userId1"  
      internal.updateUser(user)
      internal.updateUsers(users)
      internal.updateAdmin(adminId)
    })

    it('should show showVote button to admins only', () => {
    
      //Beginning - no user, no button
      //let show_btn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("button#btn1")
      //expect(show_btn).toBeNull()
      
      fixture.detectChanges()
  
      //User admin - show button
      let show_btn = fixture.debugElement.nativeElement.querySelector("button#btn1")
      expect(show_btn).toBeDefined()
      expect(show_btn.innerHTML).toBe("Show Votes")
  
      internal.updateAdmin("userId2")
      let user = component.user
      user.Admin = false
      internal.updateUser(user)
      fixture.detectChanges()
      
      //User not admin - hide button
      show_btn = fixture.debugElement.nativeElement.querySelector("button#btn1")
      expect(show_btn).toBeNull()
    })
  
  
    it('should show/hide votes by press of a button', () => {
      fixture.detectChanges()
      
      let table_row_1: HTMLTableRowElement = fixture.debugElement.nativeElement.querySelector("tbody > tr")
  
      expect(table_row_1.cells[0].innerHTML).toBe(" User 1 👑 ")
      expect(table_row_1.cells[1].innerHTML).toBe(" ✅ ")
      
      let show_btn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("button#btn1")
      show_btn.click()
  
      let users = component.users
      for (let i of Object.values(users)) {
        i.Vote = 3
      }
      internal.updateUsers(users)
      fixture.detectChanges()
  
      expect(comms.showVote).toHaveBeenCalledWith("sprint_id1", "userId1", true)
      expect(show_btn.innerHTML).toBe("Hide Votes")
      expect(table_row_1).toHaveClass("mat-row")
  
      expect(table_row_1.cells[0].innerHTML).toBe(" User 1 👑 ")
      expect(table_row_1.cells[1].innerHTML).toBe(" 3 ")
  
      show_btn.click()
      for (let i of Object.values(users)) {
        i.Vote = -1
      }
      internal.updateUsers(users)
      fixture.detectChanges()
      
      expect(comms.showVote).toHaveBeenCalledWith("sprint_id1", "userId1", false)
      expect(table_row_1.cells[0].innerHTML).toBe(" User 1 👑 ")
      expect(table_row_1.cells[1].innerHTML).toBe("   ")
      expect(show_btn.innerHTML).toBe("Show Votes")
    })
  
    it("should not allow transferring master to oneself", () => {
      fixture.detectChanges()
      let table_row_1: HTMLTableRowElement = fixture.debugElement.nativeElement.querySelector("tbody > tr")
      table_row_1.click()
  
      expect(comms.appointSuccessor).toHaveBeenCalledTimes(0)
    })
    
    it("should transfer Admin status correctly", () => {
      fixture.detectChanges()
      let table_row_1: HTMLTableRowElement = fixture.debugElement.nativeElement.querySelector("tbody > tr:nth-child(2)")
      table_row_1.click()
  
      expect(comms.appointSuccessor).toHaveBeenCalledWith('sprint_id1', 'userId1', 'userId2')
    })
  })
});
