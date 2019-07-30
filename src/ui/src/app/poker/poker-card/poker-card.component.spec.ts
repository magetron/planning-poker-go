import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { AppRoutingModule } from '../../app-routing.module';
import { PokerCardComponent} from './poker-card.component';
import { NewSprintComponent } from '../../new-sprint/new-sprint.component';
import { JoinComponent } from '../../join/join.component';
import { PokerControlComponent } from '../poker-control/poker-control.component';
import { MemberslistComponent } from '../memberslist/memberslist.component';
import { ShareComponent } from 'src/app/share/share.component';

describe('PokerCardComponent', () => {
  let component: PokerCardComponent;
  let fixture: ComponentFixture<PokerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        PokerCardComponent,
        PokerControlComponent,
        NewSprintComponent,
        MemberslistComponent,
        JoinComponent,
        ShareComponent,
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
      fixture = TestBed.createComponent(PokerCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(PokerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
