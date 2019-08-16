import { MatMenuModule, MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core'
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { Sprint } from 'src/app/models/sprint';
import { ShareComponent } from 'src/app/poker/share/share.component';
import { TopBarComponent } from 'src/app/top-bar/top-bar.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NewSprintComponent } from 'src/app/new-sprint/new-sprint.component';
import { JoinComponent } from 'src/app/join/join.component';
import { PokerCardComponent } from 'src/app/poker/poker-card/poker-card.component';
import { PokerControlComponent } from 'src/app/poker/poker-control/poker-control.component';
import { MemberslistComponent } from 'src/app/poker/memberslist/memberslist.component';
import { environment } from 'src/environments/environment';
import { ElapsedTimerComponent } from 'src/app/poker/elapsed-timer/elapsed-timer.component';

describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: convertToParamMap({'sprint_id': 'test'})}}
        }
      ],
      declarations: [
         ShareComponent,
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
        MatCardModule,
        MatIconModule,
        MatToolbarModule,
        MatInputModule,
        MatTableModule,
        MatListModule,
        MatMenuModule,
      ] 
    })
    .compileComponents().then();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct url', ()=> {
    let visible_link: string = fixture.debugElement.query(By.css("mat-toolbar a")).childNodes[0].nativeNode.data
    expect(visible_link).toEqual('http://localhost:4200/#/join/test')
  })

  it('should lead to correct url', ()=> {
    let link: string = fixture.debugElement.query(By.css("mat-toolbar a")).properties.href
    expect(link).toEqual('#' + "/join/" + "test")
  })

  //TODO: actually test clipboard?
  it('should copy url to clipboard', async ()=> {
    spyOn(component, "copylink")

    let copy_button: any = fixture.debugElement.nativeElement.querySelector("button")
    copy_button.click()
    await fixture.whenStable();
    
    expect(component.copylink).toHaveBeenCalled()
  })
});
