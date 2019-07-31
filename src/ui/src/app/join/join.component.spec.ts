import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
//import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';

import { CommsService } from '../services/comms.service'
import * as globals from '../services/globals.service';

import { JoinComponent } from './join.component';
import { NewSprintComponent } from '../new-sprint/new-sprint.component';
import { ShareComponent } from '../share/share.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';


describe('JoinComponent', () => {
  let joinComponent: JoinComponent;
  let joinComponentFixture: ComponentFixture<JoinComponent>;

  let httpTestingController: HttpTestingController;
  let commsService : CommsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CommsService
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
        //HttpClientModule,
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

  beforeEach(() => {
    // commsService.createSprint("Sprint1").subscribe((data: any) => {
    //   expect(data.Name).toBe('Sprint1');
    //   //const route = TestBed.get(ActivatedRoute);
    //   //route.url = '${globals.apiUrl}/sprints/${data.Id}';
    //   //fixture = TestBed.createComponent(JoinComponent);
    //   //joinComponent = fixture.componentInstance;
    //   //fixture.detectChanges();
    // });
    // router = TestBed.get(Router)
  });

  afterEach(() => {
    httpTestingController.verify();
  });


});

  // it('should create', () => {
  //   expect(joinComponent).toBeTruthy();
  // });

  // it('should create a sprint', () => {
  //   // commsService.createSprint("Sprint1").subscribe((data: any) => {
  //   //   expect(data.name).toBe('Sprint1');
  //   // });
  //   //const req = httpTestingController.expectOne(`${globals.apiUrl}/sprints`);
  //   //expect(req.request.method).toBe('POST','GET');
  // });

