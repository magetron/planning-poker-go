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

describe('MemberslistComponent', () => {
  let component: MemberslistComponent;
  let fixture: ComponentFixture<MemberslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MemberslistComponent,
        NewSprintComponent,
        JoinComponent,
        PokerControlComponent,
        PokerCardComponent,
        ShareComponent,

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
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
});
