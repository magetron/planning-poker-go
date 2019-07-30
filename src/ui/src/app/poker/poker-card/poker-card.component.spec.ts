import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRoutingModule } from '../../app-routing.module';

import { PokerCardComponent} from './poker-card.component';
import { NewSprintComponent } from '../../new-sprint/new-sprint.component';
import { JoinComponent } from '../../join/join.component';

describe('PokerCardComponent', () => {
  let component: PokerCardComponent;
  let fixture: ComponentFixture<PokerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        PokerCardComponent,
        NewSprintComponent,
        JoinComponent
      ],
      imports: [
        AppRoutingModule
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(PokerCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(PokerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
