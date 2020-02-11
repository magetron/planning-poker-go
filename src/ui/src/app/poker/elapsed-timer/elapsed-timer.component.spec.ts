import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';

import { async, ComponentFixture, TestBed, tick, fakeAsync  } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ElapsedTimerComponent } from './elapsed-timer.component';
import { InternalService } from 'src/app/services/internal.service';
import { Round } from 'src/app/models/round'

describe('ElapsedTimerComponent', () => {
  let component: ElapsedTimerComponent;
  let fixture: ComponentFixture<ElapsedTimerComponent>;
  let internal: InternalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
      ],
      declarations: [ 
        ElapsedTimerComponent,
      ],
      imports: [
        MatCardModule,
      ]
    })
    .compileComponents().then(
      internal = TestBed.get(InternalService)
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElapsedTimerComponent);
    component = fixture.componentInstance;
    jasmine.clock().install()
  });

  afterEach(() => {
    jasmine.clock().uninstall()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate time', fakeAsync(() => {
    internal.updateRounds([{
      "Id": 1, 
      "Name": "Task 1", 
      "Med": 0, 
      "Avg": 0, 
      "Final": 0, 
      "Archived": false, 
      "CreationTime": 1564664527 
    }])
    jasmine.clock().mockDate(new Date(1564664527 * 1000))
    fixture.detectChanges()
    tick(4000);
    expect(component.timer.getTimeValues().toString().slice(3)).toBe('00:04');
    expect(component.timer.getTimeValues().toString().slice(6)).toBe('04');
    expect(component.timerToString()).toBe('00:04');
    component.timer.stop();
  }));

  it('should display 0:00 when no round has started', fakeAsync(() => {
    jasmine.clock().mockDate(new Date(1564664527 * 1000))
    fixture.detectChanges()
    tick(4000);
    fixture.detectChanges()
    let time = fixture.debugElement.query(By.css("div#elapsedTime")).childNodes[0].nativeNode.data
    expect(time).toBe(' 00:00\n');
    component.timer.stop();
  }));

  it('should display time', fakeAsync(() => {
    internal.updateRounds([{
      "Id": 1, 
      "Name": "Task 1", 
      "Med": 0, 
      "Avg": 0, 
      "Final": 0, 
      "Archived": false, 
      "CreationTime": 1564664527 
    }])
    jasmine.clock().mockDate(new Date(1564664527 * 1000))
    fixture.detectChanges()
    tick(4000);
    fixture.detectChanges()
    let time = fixture.debugElement.query(By.css("div#elapsedTime")).childNodes[0].nativeNode.data
    expect(time).toBe(' 00:04\n');
    component.timer.stop();
  }));

});
