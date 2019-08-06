import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core'

import { Sprint } from '../models/sprint';
import { ShareComponent } from './share.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { AppRoutingModule } from '../app-routing.module';
import { NewSprintComponent } from '../new-sprint/new-sprint.component';
import { JoinComponent } from '../join/join.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';
import { environment } from 'src/environments/environment';

describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
         ShareComponent,
         TopBarComponent,
         NewSprintComponent,
         JoinComponent,
         PokerControlComponent,
         PokerCardComponent,
         MemberslistComponent,
         ShareComponent,
       ],
      imports: [
        AppRoutingModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatToolbarModule,
        MatInputModule,
        MatTableModule,
        MatListModule,

      ] 
    })
    .compileComponents().then();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    component.share = {
      "Id" : "testSprint",
      "Name" : "Sprint 1"
    }
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct url', ()=> {
    let visible_link: string = fixture.debugElement.query(By.css("mat-card-subtitle a p")).childNodes[0].nativeNode.data
    expect(visible_link).toContain(environment.baseUrl + "/join/" + "testSprint")
  })
});
