import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';

import { CommsService } from '../services/comms.service'
import * as globals from '../services/globals.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sprint } from '../models/sprint';
import { User } from '../models/user';

import { JoinComponent } from './join.component';
import { NewSprintComponent } from '../new-sprint/new-sprint.component';
import { ShareComponent } from '../share/share.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';


describe('JoinComponent', () => {
  let joinComponent: JoinComponent;
  let fixture: ComponentFixture<JoinComponent>;

  let httpTestingController: HttpTestingController;
  let commsService : CommsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CommsService,
      ],
      declarations: [
        NewSprintComponent,
        ShareComponent, 
        JoinComponent,
        PokerControlComponent,
        PokerCardComponent,
        MemberslistComponent,
        Observable
      ],
      imports: [ 
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatCardModule, 
        MatFormFieldModule, 
        MatIconModule,
        MatListModule, 
        MatTableModule, 
        MatButtonModule, 
        MatInputModule,  
        MatToolbarModule,
        Injectable,
        HttpClient, 
        HttpHeaders
      ]
    })
    .compileComponents().then(() => {
      // fixture = TestBed.createComponent(JoinComponent);
      // joinComponent = fixture.componentInstance;
      // fixture.detectChanges();
      httpTestingController = TestBed.get(HttpTestingController);
      commsService = TestBed.get(commsService);
    });
  }));

  beforeEach(() => {
    commsService.createSprint("Sprint1").subscribe((data: any) => {
      expect(data.name).toBe('Sprint1');
      fixture = TestBed.createComponent(JoinComponent);
      joinComponent = fixture.componentInstance;
      fixture.detectChanges();
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // it('internal service should be created', () => {
  //   expect(internalService).toBeTruthy();
  // });

  // it('should create', () => {
  //   expect(joinComponent).toBeTruthy();
  // });

  it('should create a sprint', () => {
    // commsService.createSprint("Sprint1").subscribe((data: any) => {
    //   expect(data.name).toBe('Sprint1');
    // });
    //const req = httpTestingController.expectOne(`${globals.apiUrl}/sprints`);
    //expect(req.request.method).toBe('POST','GET');
  });
});
