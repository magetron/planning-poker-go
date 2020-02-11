import { TestBed, async } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { NewSprintComponent } from './new-sprint/new-sprint.component';
import { JoinComponent } from './join/join.component';
import { PokerControlComponent } from './poker/poker-control/poker-control.component';
import { ShareComponent } from 'src/app/poker/share/share.component';
import { PokerCardComponent } from './poker/poker-card/poker-card.component';
import { MemberslistComponent } from './poker/memberslist/memberslist.component';
import { ElapsedTimerComponent } from './poker/elapsed-timer/elapsed-timer.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
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
        MatInputModule,
        MatTableModule,
        MatListModule,
        MatMenuModule,
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Planning Poker'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Planning Poker');
  });
});
