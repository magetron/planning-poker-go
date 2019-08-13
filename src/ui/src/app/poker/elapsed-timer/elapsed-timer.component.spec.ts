import { async, ComponentFixture, TestBed, tick, fakeAsync  } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';

import { ElapsedTimerComponent } from './elapsed-timer.component';

describe('ElapsedTimerComponent', () => {
  let component: ElapsedTimerComponent;
  let fixture: ComponentFixture<ElapsedTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ElapsedTimerComponent,
      ],
      imports: [
        MatCardModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElapsedTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display time', fakeAsync(() => {
    component.timePassed = 0
    component.startTimer();
    tick(4000);
    expect(component.timer.getTimeValues().toString().slice(3)).toBe('00:04');
    component.timer.stop();
  }));


});
