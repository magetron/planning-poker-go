import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TopBarComponent } from './top-bar.component';
import { AppRoutingModule } from '../app-routing.module';
import { NewSprintComponent } from '../new-sprint/new-sprint.component';
import { JoinComponent } from '../join/join.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { ShareComponent } from '../share/share.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';
import { ElapsedTimerComponent } from '../poker/elapsed-timer/elapsed-timer.component';


describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClientTestingModule,
      ],
      declarations: [
         TopBarComponent,
         NewSprintComponent,
         JoinComponent,
         PokerControlComponent,
         PokerCardComponent,
         MemberslistComponent,
         ShareComponent,
         ElapsedTimerComponent,
        ],
      imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientTestingModule,
        MatIconModule,
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatTableModule,
        MatListModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
