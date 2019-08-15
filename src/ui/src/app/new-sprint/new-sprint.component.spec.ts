import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';

import { Router } from '@angular/router';
import { CommsService } from 'src/app/services/comms.service'
import { NewSprintComponent } from './new-sprint.component';
import { ShareComponent } from 'src/app/poker/share/share.component';
import { JoinComponent } from '../join/join.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';
import { ElapsedTimerComponent } from '../poker/elapsed-timer/elapsed-timer.component';


describe('NewSprintComponent', () => {
  let newSprintComponent: NewSprintComponent;
  let joinComponent: JoinComponent;
  let newSprintFixture: ComponentFixture<NewSprintComponent>;
  let comms: CommsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        NewSprintComponent, 
        ShareComponent, 
        JoinComponent,
        PokerControlComponent,
        PokerCardComponent,
        MemberslistComponent,
        ElapsedTimerComponent,
      ],
      imports: [ 
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatCardModule, 
        MatFormFieldModule, 
        MatIconModule,
        MatListModule, 
        MatTableModule, 
        MatButtonModule, 
        MatInputModule,  
        MatToolbarModule 
      ]
    })
    .compileComponents().then(() => {
      newSprintFixture = TestBed.createComponent(NewSprintComponent);
      newSprintComponent = newSprintFixture.componentInstance;
      newSprintFixture.detectChanges();
      comms = TestBed.get(CommsService);
      router = TestBed.get(Router);
    });
  }));

  beforeEach(() => {
    newSprintFixture = TestBed.createComponent(NewSprintComponent);
    newSprintComponent = newSprintFixture.componentInstance;
    newSprintFixture.detectChanges();
  });

  it('should create', async(() => {
    expect(newSprintComponent).toBeTruthy();
  }));

  it("should have title 'Welcome to Planning Poker' in h1 tag", async(() => {
    const title = newSprintFixture.debugElement.nativeElement;
    expect(title.querySelector('h1').textContent).toContain('Welcome to Planning Poker');
  }));

  it("should have title 'Create a new session' in mat-card", async(() => {
    const title = newSprintFixture.debugElement.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toBe(' Create a new session ');
  }));

  it("redirect to join page after sprint creation", () => {

    spyOn(comms, "createSprint").and.returnValue(of({d:"sprint_id", s:200}))
    spyOn(router, "navigateByUrl")
    newSprintComponent.createSprint("testSprint")
    newSprintFixture.detectChanges()
    expect(comms.createSprint).toHaveBeenCalled()
    expect(router.navigateByUrl).toHaveBeenCalledWith('/join/sprint_id')

  });

  it("reject empty sprint name", () => {

    spyOn(comms, "createSprint")
    spyOn(router, "navigateByUrl")
    newSprintComponent.createSprint("")
    expect(comms.createSprint).toHaveBeenCalledTimes(0)
    expect(router.navigateByUrl).toHaveBeenCalledTimes(0)

  });

});
