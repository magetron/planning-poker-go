import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';

import { NewSprintComponent } from './new-sprint.component';
import { ShareComponent } from '../share/share.component';
import { JoinComponent } from '../join/join.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';

fdescribe('NewSprintComponent', () => {
  let newSprintComponent: NewSprintComponent;
  let joinComponent: JoinComponent;
  let newSprintFixture: ComponentFixture<NewSprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        NewSprintComponent, 
        ShareComponent, 
        JoinComponent,
        PokerControlComponent,
        PokerCardComponent,
        MemberslistComponent
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
    });
  }));

  beforeEach(() => {
    newSprintFixture = TestBed.createComponent(NewSprintComponent);
    newSprintComponent = newSprintFixture.componentInstance;
    newSprintFixture.detectChanges();
  });

  fit('should create', async(() => {
    expect(newSprintComponent).toBeTruthy();
  }));

  fit("should have title 'Welcome to Planning Poker' in h1 tag", async(() => {
    const title = newSprintFixture.debugElement.nativeElement;
    expect(title.querySelector('h1').textContent).toContain('Welcome to Planning Poker');
  }));

  fit("should have title 'Create a new session' in mat-card", async(() => {
    const title = newSprintFixture.debugElement.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toBe(' Create a new session ');
  }));

  // it('should display join link after user press enter', async(() => {
  //   const inputEn = fixture.debugElement.query(By.css('div mat-card-content mat-form-field input'));
  //   const inputEl = inputEn.nativeElement;
  //   inputEl.value = 'Sprint 1';
  //   inputEl.dispatchEvent(new Event('input'));
  //   inputEl.dispatchEvent(new Event('keyup.enter'));
  //   fixture.detectChanges();
  //   expect(newSprintComponent.name).toContain(inputEl);
  //   // const de = fixture.debugElement.query(By.css('h2'));
  //   // expect(de.nativeElement.textContent).toEqual('Updated Task 1');
  // }));




  // describe('JoinComponent', () => {
  //   let joinComponent: JoinComponent;
  //   let joinFixture: ComponentFixture<JoinComponent>;
  
  //   beforeEach(async(() => {
  //     TestBed.compileComponents().then(() => {
  //       // const inputEn = newSprintFixture.debugElement.query(By.css('div mat-card-content mat-form-field input'));
  //       // const inputEl = inputEn.nativeElement;
  //       // inputEl.value = 'Sprint 1';
  //       // inputEl.dispatchEvent(new Event('input'));
  //       // inputEl.dispatchEvent(new Event('keyup.enter'));
  //       newSprintComponent.createSprint("Sprint1");
  //       joinFixture = TestBed.createComponent(JoinComponent);
  //       joinComponent = joinFixture.componentInstance;
  //       joinFixture.detectChanges();
  //     });
  //   }));
  
  //   beforeEach(() => {
  //   });

  //   it('should create', async(() => {
  //     expect(joinComponent).toBeTruthy();
  //   }));

  // });

});
