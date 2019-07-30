import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, MatTableModule, MatButtonModule, MatInputModule,  MatToolbarModule } from '@angular/material';

import { InternalService } from '../services/internal.service'

import { JoinComponent } from './join.component';
import { NewSprintComponent } from '../new-sprint/new-sprint.component';
import { ShareComponent } from '../share/share.component';
import { PokerControlComponent } from '../poker/poker-control/poker-control.component';
import { PokerCardComponent } from '../poker/poker-card/poker-card.component';
import { MemberslistComponent } from '../poker/memberslist/memberslist.component';


fdescribe('JoinComponent', () => {
  let joinComponent: JoinComponent;
  let fixture: ComponentFixture<JoinComponent>;

  let httpTestingController: HttpTestingController;
  let internalService: InternalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        InternalService,
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
      fixture = TestBed.createComponent(JoinComponent);
      joinComponent = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    internalService = TestBed.get(InternalService);
    fixture = TestBed.createComponent(JoinComponent);
    joinComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  fit('internal serviec should be created', () => {
    expect(internalService).toBeTruthy();
  });

  it('should create', () => {
    expect(joinComponent).toBeTruthy();
  });
});
