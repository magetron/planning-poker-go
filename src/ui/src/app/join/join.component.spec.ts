import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { CommsService } from '../services/comms.service'
import { environment } from '../../environments/environment';
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
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: convertToParamMap({'sprint_id': 'testSprint'})}}
        }
      ],
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
        HttpClientTestingModule,
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
      httpTestingController = TestBed.get(HttpTestingController);
      commsService = TestBed.get(CommsService);
    });
  }));

  beforeEach(inject([HttpTestingController, CommsService], 
      (httpMock: HttpTestingController, service: CommsService) => {

        service.createSprint("Sprint 1").subscribe(respond => {
          console.log(respond);
          expect(respond).toEqual({
            "d": "testSprint",
            "s": 200
          });
        });
  
        //set the expectations for the HttpClient mock
        const req = httpMock.expectOne(environment.apiUrl + '/sprints');
        expect(req.request.method).toEqual('POST');
  
        //fake data to be returned by the mock
        req.flush({
          "d": "testSprint",
          "s": 200
        });
      
        fixture = TestBed.createComponent(JoinComponent);
        joinComponent = fixture.componentInstance;
        fixture.detectChanges();
      
    })
  );

  afterEach(() => {
  });


  it('should create', () => {
    expect(joinComponent).toBeTruthy();
  });

});
