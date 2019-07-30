import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewSprintComponent } from './new-sprint.component';
import { By } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { ShareComponent } from '../share/share.component';
import { JoinComponent } from '../join/join.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';

fdescribe('NewSprintComponent', () => {
  let newSprintComponent: NewSprintComponent;
  let joinComponent: JoinComponent;
  let fixture: ComponentFixture<NewSprintComponent>;

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
      fixture = TestBed.createComponent(NewSprintComponent);
      newSprintComponent = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSprintComponent);
    newSprintComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', async(() => {
    expect(newSprintComponent).toBeTruthy();
  }));

  fit("should have title 'Welcome to Planning Poker' in h1 tag", async(() => {
    const title = fixture.debugElement.nativeElement;
    expect(title.querySelector('h1').textContent).toContain('Welcome to Planning Poker');
  }));

  fit("should have title 'Create a new session' in mat-card", async(() => {
    const title = fixture.debugElement.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toBe(' Create a new session ');
  }));

  // it('should display join link after user press enter', async(() => {
  //   const inputEn = fixture.debugElement.query(By.css('matInput[Name="name"]'));
  //   const inputEl = inputEn.nativeElement;
  //   inputEl.value = 'Sprint 1';
  //   inputEl.dispatchEvent(new Event('input'));
  //   fixture.detectChanges();
  //   expect(joinComponent).toBeTruthy();
  //   // const de = fixture.debugElement.query(By.css('h2'));
  //   // expect(de.nativeElement.textContent).toEqual('Updated Task 1');
  // }));

  // fit("should display join link after user press enter", async(() => {
  //   const inputClick = fixture.debugElement.nativeElement;
  //   inputClick.querySelector('button').click();
  //   fixture.detectChanges();
  //   expect(fixture.debugElement.queryAll(By.css('.menu-item')).length).toEqual(2);
  // }));

});
