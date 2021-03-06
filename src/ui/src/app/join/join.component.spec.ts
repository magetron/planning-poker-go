import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

import { CommsService } from '../services/comms.service'
import { environment } from '../../environments/environment';
import { JoinComponent } from './join.component';
import { NewSprintComponent } from '../new-sprint/new-sprint.component';
import { ShareComponent } from 'src/app/poker/share/share.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';
import { ElapsedTimerComponent } from '../poker/elapsed-timer/elapsed-timer.component';
import { SprintResponse } from 'src/app/models/responses';


describe('JoinComponent', () => {
  let joinComponent: JoinComponent;
  let fixture: ComponentFixture<JoinComponent>;
  let httpMock: HttpTestingController;
  let comms: CommsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {
            paramMap: convertToParamMap({'sprint_id': 'testSprint'})
          }}
        },
      ],
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
      ]
    })
    .compileComponents().then(() => {
      httpMock = TestBed.get(HttpTestingController);
      comms = TestBed.get(CommsService);
      router = TestBed.get(Router);
    });
  }));

  beforeEach(() => {
    spyOn(router, "navigateByUrl")

    fixture = TestBed.createComponent(JoinComponent);
    joinComponent = fixture.componentInstance;
  });

  afterEach(() => {
  });
    
  it('should create', () => {
    fixture.detectChanges()
    expect(joinComponent).toBeTruthy();
  });
    
  it("should kick out users if the sprint doesn't exist", () => {

    spyOn(comms, "getSprintDetails").and.returnValue(of({status: 404} as SprintResponse))

    fixture.detectChanges()

    expect(joinComponent.sprint.Id).toBe('testSprint')
    expect(comms.getSprintDetails).toHaveBeenCalledWith('testSprint')

    expect(router.navigateByUrl).toHaveBeenCalledWith('/new')
  });

  it("should kick out users if errors are thrown", () => {

    spyOn(comms, "getSprintDetails").and.returnValue(throwError("ObservableError"))

    fixture.detectChanges()

    expect(joinComponent.sprint.Id).toBe('testSprint')
    expect(comms.getSprintDetails).toHaveBeenCalled()

    expect(router.navigateByUrl).toHaveBeenCalledWith('/new')
  });

  it("should do nothing when users submit an empty name", () => {
    fixture.detectChanges()

    joinComponent.registerUser("")

    fixture.detectChanges()

    expect(router.navigateByUrl).toHaveBeenCalledTimes(0)
  })
  //TODO: verify other parameters for registerUser()
})